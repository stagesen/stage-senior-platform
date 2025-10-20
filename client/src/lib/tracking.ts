/**
 * Tracking utilities for conversion tracking with Google Ads and Meta
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
 * Fire a lead event to dataLayer for GTM
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
 * Track phone call click
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
    leadValue: 25, // Phone clicks are worth less than tours
    community: options.community,
    identifiers: getMetaCookies(),
  });
}

/**
 * Track brochure download
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
    leadValue: 10, // Downloads are worth less than direct contact
    community: options.community,
    identifiers: getMetaCookies(),
  });
}

/**
 * Generate a unique transaction ID for event deduplication
 */
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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
