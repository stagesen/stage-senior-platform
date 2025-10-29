import type { Community, CommunityCard } from "@shared/schema";

/**
 * Default contact information for Stage Senior
 */
const DEFAULT_PHONE_DISPLAY = "(970) 444-4689";
const DEFAULT_PHONE_DIAL = "+19704444689";

/**
 * Type guard to check if object has phone properties
 */
function hasPhoneProperties(obj: any): obj is { phoneDisplay?: string | null; phone?: string | null } {
  return obj && ('phoneDisplay' in obj || 'phone' in obj);
}

/**
 * Get the primary phone number for display (formatted)
 * Priority: phoneDisplay > phone > default
 */
export function getPrimaryPhoneDisplay(
  community: Community | CommunityCard | { phoneDisplay?: string | null; phone?: string | null }
): string {
  if (!hasPhoneProperties(community)) {
    return DEFAULT_PHONE_DISPLAY;
  }
  return community.phoneDisplay || community.phone || DEFAULT_PHONE_DISPLAY;
}

/**
 * Normalize a phone number to tel: href format with +1 country code
 */
function normalizePhoneHref(phone: string): string {
  // If phone already starts with tel:, strip it
  const cleanPhone = phone.startsWith('tel:') ? phone.slice(4) : phone;
  
  // If already has + prefix, use as-is
  if (cleanPhone.startsWith('+')) {
    return `tel:${cleanPhone}`;
  }
  
  // Remove all non-numeric characters
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  
  // If it's 10 digits, add +1 prefix
  if (digitsOnly.length === 10) {
    return `tel:+1${digitsOnly}`;
  }
  
  // If it's 11 digits and starts with 1, add + prefix
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `tel:+${digitsOnly}`;
  }
  
  // Otherwise, return as-is with tel: prefix
  return `tel:${cleanPhone}`;
}

/**
 * Get the primary phone number for tel: href (dialable format with +1 country code)
 * Priority: phoneDial > phoneDisplay > phone > default
 * Always normalizes to ensure +1 country code prefix
 */
export function getPrimaryPhoneHref(
  community: Community | CommunityCard | { phoneDial?: string | null; phoneDisplay?: string | null; phone?: string | null }
): string {
  // Check if phoneDial exists and normalize it
  if ('phoneDial' in community && community.phoneDial) {
    return normalizePhoneHref(community.phoneDial);
  }
  
  // Get phone from available properties
  let phone = DEFAULT_PHONE_DIAL;
  if (hasPhoneProperties(community)) {
    phone = community.phoneDisplay || community.phone || DEFAULT_PHONE_DIAL;
  }
  
  return normalizePhoneHref(phone);
}

/**
 * Get the secondary phone number for display (formatted)
 * For communities with multiple locations
 */
export function getSecondaryPhoneDisplay(
  community: Community | CommunityCard | { phoneDisplay2?: string | null; phone2?: string | null }
): string | null {
  const hasPhone2 = 'phoneDisplay2' in community || 'phone2' in community;
  if (!hasPhone2) return null;
  
  return (community as any).phoneDisplay2 || (community as any).phone2 || null;
}

/**
 * Get the secondary phone number for tel: href (dialable format with +1 country code)
 * Always normalizes to ensure +1 country code prefix
 */
export function getSecondaryPhoneHref(
  community: Community | CommunityCard | { phoneDial2?: string | null; phoneDisplay2?: string | null; phone2?: string | null }
): string | null {
  const hasPhone2 = 'phoneDial2' in community || 'phoneDisplay2' in community || 'phone2' in community;
  if (!hasPhone2) return null;
  
  // If phoneDial2 is provided, normalize it
  if ((community as any).phoneDial2) {
    return normalizePhoneHref((community as any).phoneDial2);
  }
  
  const phone = (community as any).phoneDisplay2 || (community as any).phone2;
  if (!phone) return null;
  
  return normalizePhoneHref(phone);
}

/**
 * Get formatted city, state, zip for display
 * Examples: "Denver, CO 80202" or "Denver, CO" (if no zip)
 */
export function getCityStateZip(
  community: Community | CommunityCard | { city?: string | null; state?: string | null; zip?: string | null; zipCode?: string | null }
): string {
  const parts: string[] = [];
  
  // CommunityCard always has city
  if ('city' in community && community.city) {
    parts.push(community.city);
  }
  
  // Check for state property
  if ('state' in community && community.state) {
    if (parts.length > 0) {
      // Add state after city with comma: "Denver, CO"
      parts.push(community.state);
    } else {
      // Just state if no city
      parts.push(community.state);
    }
  }
  
  // Join city and state with ", " then append zip with space
  let result = parts.join(', ');
  
  // Check both zip and zipCode fields (prioritize zip as it has correct data)
  const zipValue = ('zip' in community && community.zip) || ('zipCode' in community && community.zipCode);
  if (zipValue) {
    result += ` ${zipValue}`;
  }
  
  return result || 'Location TBD';
}

/**
 * Get formatted city and state only (no zip)
 * Example: "Denver, CO"
 */
export function getCityState(
  community: Community | CommunityCard | { city?: string | null; state?: string | null }
): string {
  const hasCity = 'city' in community && community.city;
  const hasState = 'state' in community && community.state;
  
  if (hasCity && hasState) {
    return `${community.city}, ${community.state}`;
  }
  
  if (hasCity) {
    return community.city!;
  }
  
  if (hasState) {
    return community.state!;
  }
  
  return 'Location TBD';
}

/**
 * Get primary email address
 */
export function getPrimaryEmail(
  community: Community | CommunityCard | { email?: string | null }
): string | null {
  if ('email' in community) {
    return community.email || null;
  }
  return null;
}

/**
 * Get full address as single string
 * Example: "123 Main St, Denver, CO 80202"
 */
export function getFullAddress(
  community: Community | CommunityCard | { 
    address?: string | null;
    street?: string | null;
    city?: string | null; 
    state?: string | null; 
    zip?: string | null;
    zipCode?: string | null;
  }
): string {
  const parts: string[] = [];
  
  // Check for street or address field (prioritize street as it's the primary field)
  const addressValue = ('street' in community && community.street) || ('address' in community && community.address);
  if (addressValue) {
    parts.push(addressValue);
  }
  
  const cityStateZip = getCityStateZip(community);
  if (cityStateZip && cityStateZip !== 'Location TBD') {
    parts.push(cityStateZip);
  }
  
  return parts.join(', ') || 'Address TBD';
}
