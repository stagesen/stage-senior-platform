import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to capture Google Ads and Meta click IDs from URL parameters
 * and store them in the session for later use in conversion tracking
 */

export interface ClickIdData {
  gclid?: string;      // Google Click ID
  gbraid?: string;     // Google Ads enhanced conversions (iOS)
  wbraid?: string;     // Google Ads enhanced conversions (Web)
  fbclid?: string;     // Facebook Click ID
  capturedAt?: string; // When the click IDs were captured
  sourceUrl?: string;  // URL where click IDs were captured
}

declare module 'express-session' {
  interface SessionData {
    clickIds?: ClickIdData;
  }
}

/**
 * Middleware to capture click IDs from query parameters
 * Should be registered early in the middleware chain
 */
export function clickIdCaptureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const query = req.query;
  
  // Check if any click ID parameters are present
  const hasClickIds =
    query.gclid ||
    query.gbraid ||
    query.wbraid ||
    query.fbclid;
  
  // Only update session if click IDs are present
  if (hasClickIds) {
    const clickIdData: ClickIdData = {
      ...(query.gclid && { gclid: query.gclid as string }),
      ...(query.gbraid && { gbraid: query.gbraid as string }),
      ...(query.wbraid && { wbraid: query.wbraid as string }),
      ...(query.fbclid && { fbclid: query.fbclid as string }),
      capturedAt: new Date().toISOString(),
      sourceUrl: req.originalUrl,
    };
    
    // Store in session (or update existing)
    req.session.clickIds = {
      ...req.session.clickIds,
      ...clickIdData,
    };
    
    console.log('[Click ID Capture]', clickIdData);
  }
  
  next();
}
