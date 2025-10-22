import { GoogleAdsApi } from 'google-ads-api';
// @ts-ignore - SDK doesn't have proper types
import { Content, EventRequest, UserData, ServerEvent } from 'facebook-nodejs-business-sdk';
import {
  ConversionPayload,
  hashEmail,
  normalizeAndHashPhone,
  toUnixTimestamp,
} from './conversion-utils';

/**
 * Service for sending conversion events to Google Ads and Meta Conversion APIs
 */

// Google Ads Configuration
const GOOGLE_ADS_CONFIG = {
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
};

const GOOGLE_ADS_CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '';
const GOOGLE_ADS_CONVERSION_ACTION_ID = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID || '';

// Meta Configuration
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '';

/**
 * Send conversion to Google Ads API using UploadClickConversions
 */
export async function sendGoogleAdsConversion(
  payload: ConversionPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if credentials are configured
    if (!GOOGLE_ADS_CONFIG.client_id || !GOOGLE_ADS_CONFIG.client_secret || !GOOGLE_ADS_CONFIG.developer_token) {
      console.warn('[Google Ads] Credentials not configured, skipping conversion tracking');
      return { success: false, error: 'Google Ads credentials not configured' };
    }

    if (!GOOGLE_ADS_CUSTOMER_ID || !GOOGLE_ADS_CONVERSION_ACTION_ID) {
      console.warn('[Google Ads] Customer ID or Conversion Action ID not configured');
      return { success: false, error: 'Google Ads customer or conversion action not configured' };
    }

    // Initialize Google Ads API client
    const client = new GoogleAdsApi({
      ...GOOGLE_ADS_CONFIG,
    });

    const customer = client.Customer({
      customer_id: GOOGLE_ADS_CUSTOMER_ID,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
    });

    // Prepare conversion data
    // Note: conversion_date_time is mandatory for Google Ads API
    const conversionDateTime = new Date().toISOString();
    
    const conversion: any = {
      conversion_action: `customers/${GOOGLE_ADS_CUSTOMER_ID}/conversionActions/${GOOGLE_ADS_CONVERSION_ACTION_ID}`,
      conversion_date_time: conversionDateTime,
      conversion_value: payload.value,
      currency_code: payload.currency,
      order_id: payload.transactionId,
    };

    // Add click IDs if available
    // Note: As of Oct 2025, Google allows both gclid and gbraid in the same conversion
    if (payload.gclid) {
      conversion.gclid = payload.gclid;
    }
    if (payload.gbraid) {
      conversion.gbraid = payload.gbraid;
    }
    if (payload.wbraid) {
      conversion.wbraid = payload.wbraid;
    }

    // Add Enhanced Conversions data (hashed PII)
    if (payload.email || payload.phone) {
      conversion.user_identifiers = [];
      
      if (payload.email) {
        conversion.user_identifiers.push({
          hashed_email: hashEmail(payload.email),
        });
      }
      
      if (payload.phone) {
        conversion.user_identifiers.push({
          hashed_phone_number: normalizeAndHashPhone(payload.phone),
        });
      }
    }

    // Upload conversion
    const response = await customer.conversionUploads.uploadClickConversions({
      customer_id: GOOGLE_ADS_CUSTOMER_ID,
      conversions: [conversion],
      partial_failure: false,
      validate_only: false,
    } as any);

    console.log('[Google Ads] Conversion sent successfully:', {
      transactionId: payload.transactionId,
      leadType: payload.leadType,
      value: payload.value,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Google Ads] Error sending conversion:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Send conversion to Meta Conversion API (CAPI)
 */
export async function sendMetaConversion(
  payload: ConversionPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if credentials are configured
    if (!META_ACCESS_TOKEN || !META_PIXEL_ID) {
      console.warn('[Meta CAPI] Credentials not configured, skipping conversion tracking');
      return { success: false, error: 'Meta credentials not configured' };
    }

    // Map lead types to Meta event names
    const eventNameMap: Record<string, string> = {
      lead_submit: 'Lead',
      schedule_tour: 'Lead', // ScheduleTour conversion
      booking_confirmed: 'CompleteRegistration',
      phone_call_click: 'Contact',
      brochure_download: 'Lead',
    };

    const eventName = eventNameMap[payload.leadType] || 'Lead';

    // Prepare user data with hashed PII
    const userData = new UserData();
    
    if (payload.email) {
      userData.setEmail(hashEmail(payload.email));
    }
    
    if (payload.phone) {
      userData.setPhone(normalizeAndHashPhone(payload.phone));
    }
    
    // Add Meta cookies for better matching
    if (payload.fbp) {
      userData.setFbp(payload.fbp);
    }
    
    if (payload.fbc) {
      userData.setFbc(payload.fbc);
    }
    
    // Add browser data
    if (payload.clientUserAgent) {
      userData.setClientUserAgent(payload.clientUserAgent);
    }
    
    if (payload.clientIpAddress) {
      userData.setClientIpAddress(payload.clientIpAddress);
    }

    // Create server event
    const serverEvent = new ServerEvent();
    serverEvent.setEventName(eventName);
    serverEvent.setEventTime(toUnixTimestamp());
    serverEvent.setUserData(userData);
    serverEvent.setEventId(payload.transactionId); // For deduplication with browser pixel
    serverEvent.setActionSource('website');
    
    if (payload.eventSourceUrl) {
      serverEvent.setEventSourceUrl(payload.eventSourceUrl);
    }

    // Add custom data
    const content = new Content();
    content.setId(payload.communityId || 'unknown');
    content.setTitle(payload.communityName || 'Tour Request');
    
    const customData: any = {
      value: payload.value,
      currency: payload.currency,
      content_type: 'product',
      contents: [content],
    };

    // Add conversion-specific metadata
    if (payload.careType) {
      customData.content_category = payload.careType;
    }

    serverEvent.setCustomData(customData);

    // Send event to Meta
    const eventRequest = new EventRequest(META_ACCESS_TOKEN, META_PIXEL_ID);
    eventRequest.setEvents([serverEvent]);

    const response = await eventRequest.execute();

    console.log('[Meta CAPI] Conversion sent successfully:', {
      transactionId: payload.transactionId,
      leadType: payload.leadType,
      eventName,
      value: payload.value,
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Meta CAPI] Error sending conversion:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

/**
 * Send conversion to both Google Ads and Meta
 * This is the main function to call from your tour request endpoint
 */
export async function sendConversion(
  payload: ConversionPayload
): Promise<{
  google: { success: boolean; error?: string };
  meta: { success: boolean; error?: string };
}> {
  console.log('[Conversion Service] Sending conversion:', {
    transactionId: payload.transactionId,
    leadType: payload.leadType,
    value: payload.value,
    hasEmail: !!payload.email,
    hasPhone: !!payload.phone,
    hasGclid: !!payload.gclid,
    hasFbp: !!payload.fbp,
  });

  // Send to both platforms in parallel
  const [googleResult, metaResult] = await Promise.all([
    sendGoogleAdsConversion(payload),
    sendMetaConversion(payload),
  ]);

  return {
    google: googleResult,
    meta: metaResult,
  };
}
