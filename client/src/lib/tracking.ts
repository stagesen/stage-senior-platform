/**
 * Tracking utilities for conversion tracking with Google Ads and Meta
 * Following the conversion schema specification for Stage Senior
 */

// Declare dataLayer for GTM integration
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Initialize dataLayer if it doesn't exist
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
}

/**
 * Get Meta _fbp cookie (Facebook browser pixel)
 */
export function getMetaFbp(): string | null {
  return getCookie('_fbp');
}

/**
 * Get Meta _fbc cookie (Facebook click ID)
 */
export function getMetaFbc(): string | null {
  return getCookie('_fbc');
}

/**
 * Get all Meta cookies for conversion tracking
 */
export function getMetaCookies() {
  return {
    fbp: getMetaFbp(),
    fbc: getMetaFbc(),
  };
}

/**
 * Generate a unique event_id using crypto.randomUUID()
 * This ID is used for deduplication across Google and Meta
 */
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Legacy transaction ID generator (kept for backward compatibility)
 */
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Simple SHA-256 hash function for client-side hashing
 * Note: For production, Enhanced Conversions should use server-side hashing
 */
export async function hashString(str: string): Promise<string> {
  if (!str) return '';
  
  // Normalize: lowercase and trim
  const normalized = str.toLowerCase().trim();
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('[Tracking] SHA-256 hashing failed, returning empty string', e);
      return '';
    }
  }
  
  // Crypto API not available
  return '';
}

/**
 * Hash email for Enhanced Conversions
 */
export async function hashEmail(email: string): Promise<string> {
  if (!email) return '';
  return hashString(email);
}

/**
 * Hash phone for Enhanced Conversions
 * Removes all non-numeric characters before hashing
 */
export async function hashPhone(phone: string): Promise<string> {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  return hashString(cleaned);
}

/**
 * Get click IDs from URL parameters (for passing to form submissions)
 */
export function getClickIdsFromUrl(): {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
} {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    gclid: params.get('gclid') || undefined,
    gbraid: params.get('gbraid') || undefined,
    wbraid: params.get('wbraid') || undefined,
    fbclid: params.get('fbclid') || undefined,
  };
}

/**
 * Get UTM parameters from URL
 */
export function getUtmParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
} {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
}

/**
 * Get consent flags (placeholder - should be integrated with your consent management)
 */
export function getConsentFlags(): {
  ad_user_data: boolean;
  ad_personalization: boolean;
} {
  // Default to true - in production, check actual consent state
  return {
    ad_user_data: true,
    ad_personalization: true,
  };
}

/**
 * Fire ScheduleTour event to dataLayer (primary conversion)
 * Value: $250
 */
export interface ScheduleTourOptions {
  event_id: string;
  email?: string;
  phone?: string;
  care_level?: string;
  metro?: string;
  community_name?: string;
  landing_page?: string;
}

export async function fireScheduleTour(options: ScheduleTourOptions): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const clickIds = getClickIdsFromUrl();
  const metaCookies = getMetaCookies();
  const consent = getConsentFlags();
  const utmParams = getUtmParams();
  
  // Hash PII for Enhanced Conversions
  const hashedEmail = options.email ? await hashEmail(options.email) : undefined;
  const hashedPhone = options.phone ? await hashPhone(options.phone) : undefined;
  
  const payload = {
    event: 'ScheduleTour',
    event_id: options.event_id,
    value: 250,
    currency: 'USD',
    care_level: options.care_level || '',
    metro: options.metro || '',
    community_name: options.community_name || '',
    landing_page: options.landing_page || window.location.pathname,
    gclid: clickIds.gclid,
    wbraid: clickIds.wbraid,
    gbraid: clickIds.gbraid,
    fbc: metaCookies.fbc,
    fbp: metaCookies.fbp,
    user: {
      email: hashedEmail,
      phone: hashedPhone,
    },
    consent: consent,
    ...utmParams,
  };
  
  console.log('[Tracking] ScheduleTour event:', payload);
  window.dataLayer.push(payload);
}

/**
 * Fire GenerateLead event to dataLayer (secondary conversion)
 * Value: $25
 */
export interface GenerateLeadOptions {
  event_id: string;
  email?: string;
  phone?: string;
  care_level?: string;
  metro?: string;
  community_name?: string;
  landing_page?: string;
}

export async function fireGenerateLead(options: GenerateLeadOptions): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const clickIds = getClickIdsFromUrl();
  const metaCookies = getMetaCookies();
  const consent = getConsentFlags();
  const utmParams = getUtmParams();
  
  const hashedEmail = options.email ? await hashEmail(options.email) : undefined;
  const hashedPhone = options.phone ? await hashPhone(options.phone) : undefined;
  
  const payload = {
    event: 'GenerateLead',
    event_id: options.event_id,
    value: 25,
    currency: 'USD',
    care_level: options.care_level || '',
    metro: options.metro || '',
    community_name: options.community_name || '',
    landing_page: options.landing_page || window.location.pathname,
    gclid: clickIds.gclid,
    wbraid: clickIds.wbraid,
    gbraid: clickIds.gbraid,
    fbc: metaCookies.fbc,
    fbp: metaCookies.fbp,
    user: {
      email: hashedEmail,
      phone: hashedPhone,
    },
    consent: consent,
    ...utmParams,
  };
  
  console.log('[Tracking] GenerateLead event:', payload);
  window.dataLayer.push(payload);
}

/**
 * Fire PhoneCallStart event to dataLayer (click-to-call)
 */
export interface PhoneCallStartOptions {
  event_id: string;
  phone_number: string;
  community_name?: string;
  care_level?: string;
  metro?: string;
}

export function firePhoneCallStart(options: PhoneCallStartOptions): void {
  if (typeof window === 'undefined') return;
  
  const clickIds = getClickIdsFromUrl();
  const metaCookies = getMetaCookies();
  const consent = getConsentFlags();
  const utmParams = getUtmParams();
  
  const payload = {
    event: 'PhoneCallStart',
    event_id: options.event_id,
    value: 25,
    currency: 'USD',
    phone_number: options.phone_number,
    community_name: options.community_name || '',
    care_level: options.care_level || '',
    metro: options.metro || '',
    landing_page: window.location.pathname,
    gclid: clickIds.gclid,
    wbraid: clickIds.wbraid,
    gbraid: clickIds.gbraid,
    fbc: metaCookies.fbc,
    fbp: metaCookies.fbp,
    consent: consent,
    ...utmParams,
  };
  
  console.log('[Tracking] PhoneCallStart event:', payload);
  window.dataLayer.push(payload);
}

/**
 * Fire PricingRequest event to dataLayer (secondary conversion)
 */
export interface PricingRequestOptions {
  event_id: string;
  email?: string;
  phone?: string;
  care_level?: string;
  metro?: string;
  community_name?: string;
}

export async function firePricingRequest(options: PricingRequestOptions): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const clickIds = getClickIdsFromUrl();
  const metaCookies = getMetaCookies();
  const consent = getConsentFlags();
  const utmParams = getUtmParams();
  
  const hashedEmail = options.email ? await hashEmail(options.email) : undefined;
  const hashedPhone = options.phone ? await hashPhone(options.phone) : undefined;
  
  const payload = {
    event: 'PricingRequest',
    event_id: options.event_id,
    value: 25,
    currency: 'USD',
    care_level: options.care_level || '',
    metro: options.metro || '',
    community_name: options.community_name || '',
    landing_page: window.location.pathname,
    gclid: clickIds.gclid,
    wbraid: clickIds.wbraid,
    gbraid: clickIds.gbraid,
    fbc: metaCookies.fbc,
    fbp: metaCookies.fbp,
    user: {
      email: hashedEmail,
      phone: hashedPhone,
    },
    consent: consent,
    ...utmParams,
  };
  
  console.log('[Tracking] PricingRequest event:', payload);
  window.dataLayer.push(payload);
}

/**
 * Legacy fire lead function (kept for backward compatibility)
 */
export interface FireLeadOptions {
  event: 'lead_submit' | 'booking_confirmed' | 'phone_call_click' | 'brochure_download' | 'page_view';
  transactionId: string;
  leadType?: 'schedule_tour' | 'booking_confirmed' | 'phone_call_click' | 'brochure_download';
  leadValue: number;
  community?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  careType?: string;
  pageType?: string;
  templateName?: string;
  identifiers?: {
    email?: string;
    phone?: string;
    fbp?: string | null;
    fbc?: string | null;
  };
}

export function fireLead(options: FireLeadOptions): void {
  if (typeof window === 'undefined') return;
  
  const metaCookies = getMetaCookies();
  
  const payload = {
    event: options.event,
    transaction_id: options.transactionId,
    lead_type: options.leadType || options.event,
    lead_value: options.leadValue,
    community_name: options.community?.name,
    community_id: options.community?.id,
    community_slug: options.community?.slug,
    care_type: options.careType,
    page_type: options.pageType,
    template_name: options.templateName,
    identifiers: {
      email: options.identifiers?.email,
      phone: options.identifiers?.phone,
      fbp: options.identifiers?.fbp || metaCookies.fbp,
      fbc: options.identifiers?.fbc || metaCookies.fbc,
    },
  };
  
  console.log('[Tracking] Firing lead event:', payload);
  window.dataLayer.push(payload);
}

/**
 * Fire a page view event to dataLayer
 */
export function firePageView(options: {
  pageTitle: string;
  pagePath: string;
  pageType?: string;
  community?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  careType?: string;
  templateName?: string;
}): void {
  if (typeof window === 'undefined') return;
  
  const payload = {
    event: 'page_view',
    page_title: options.pageTitle,
    page_path: options.pagePath,
    page_type: options.pageType,
    page_location: window.location.href,
    page_referrer: document.referrer,
    community_name: options.community?.name,
    community_id: options.community?.id,
    community_slug: options.community?.slug,
    care_type: options.careType,
    template_name: options.templateName,
  };
  
  console.log('[Tracking] Firing page view:', payload);
  window.dataLayer.push(payload);
}

/**
 * Track phone call click (legacy)
 */
export function trackPhoneClick(options: {
  phoneNumber: string;
  community?: {
    id?: string;
    name?: string;
  };
  transactionId: string;
}): void {
  fireLead({
    event: 'phone_call_click',
    transactionId: options.transactionId,
    leadType: 'phone_call_click',
    leadValue: 25,
    community: options.community,
    identifiers: getMetaCookies(),
  });
}

/**
 * Track brochure download (legacy)
 */
export function trackBrochureDownload(options: {
  brochureUrl: string;
  community?: {
    id?: string;
    name?: string;
  };
  transactionId: string;
}): void {
  fireLead({
    event: 'brochure_download',
    transactionId: options.transactionId,
    leadType: 'brochure_download',
    leadValue: 10,
    community: options.community,
    identifiers: getMetaCookies(),
  });
}
