import crypto from 'crypto';

/**
 * Utility functions for conversion tracking
 */

/**
 * Hash a string using SHA-256 (required for Google Ads Enhanced Conversions and Meta CAPI)
 */
export function hashSHA256(value: string): string {
  if (!value) return '';
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

/**
 * Normalize and hash email address
 */
export function hashEmail(email: string): string {
  if (!email) return '';
  // Remove whitespace and convert to lowercase
  const normalized = email.toLowerCase().trim();
  return hashSHA256(normalized);
}

/**
 * Normalize phone number to E.164 format and hash it
 * Accepts formats like: (303) 555-1234, 303-555-1234, 3035551234
 * Returns hashed normalized phone in format: +13035551234
 */
export function normalizeAndHashPhone(phone: string, countryCode: string = '1'): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present
  let normalized = digits;
  if (!digits.startsWith(countryCode)) {
    normalized = countryCode + digits;
  }
  
  // Add + prefix for E.164 format
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }
  
  return hashSHA256(normalized);
}

/**
 * Normalize phone number to E.164 format without hashing
 */
export function normalizePhone(phone: string, countryCode: string = '1'): string {
  if (!phone) return '';
  
  const digits = phone.replace(/\D/g, '');
  let normalized = digits;
  
  if (!digits.startsWith(countryCode)) {
    normalized = countryCode + digits;
  }
  
  if (!normalized.startsWith('+')) {
    normalized = '+' + normalized;
  }
  
  return normalized;
}

/**
 * Generate a unique transaction ID for conversion deduplication
 */
export function generateTransactionId(): string {
  return `txn_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Validate conversion data payload
 */
export interface ConversionPayload {
  transactionId: string;
  leadType: 'lead_submit' | 'booking_confirmed' | 'phone_call_click' | 'brochure_download';
  value: number;
  currency: string;
  email?: string;
  phone?: string;
  communityId?: string;
  communityName?: string;
  careType?: string;
  // Click IDs
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  // Meta cookies
  fbp?: string;
  fbc?: string;
  // Browser data
  clientUserAgent?: string;
  clientIpAddress?: string;
  eventSourceUrl?: string;
  // UTM parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

/**
 * Validate that required conversion data is present
 */
export function validateConversionPayload(payload: Partial<ConversionPayload>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!payload.transactionId) {
    errors.push('transactionId is required');
  }
  
  if (!payload.leadType) {
    errors.push('leadType is required');
  }
  
  if (payload.value === undefined || payload.value === null) {
    errors.push('value is required');
  }
  
  if (!payload.currency) {
    errors.push('currency is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get current timestamp in ISO 8601 format for conversion APIs
 */
export function getConversionTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Convert ISO timestamp to Unix timestamp (seconds since epoch)
 * Required for Meta Conversions API
 */
export function toUnixTimestamp(isoDate?: string): number {
  const date = isoDate ? new Date(isoDate) : new Date();
  return Math.floor(date.getTime() / 1000);
}
