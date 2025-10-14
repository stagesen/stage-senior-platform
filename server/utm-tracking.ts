import { Request, Response, NextFunction } from "express";

// UTM tracking data interface
export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page_url?: string;
}

// Extend Express Session interface to include UTM data
declare module "express-session" {
  interface SessionData {
    utm?: UTMData;
  }
}

/**
 * Middleware to capture UTM parameters from query string and store in session
 * Only updates session if new UTM parameters are present
 */
export function utmTrackingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check if session exists
  if (!req.session) {
    return next();
  }

  const query = req.query;
  
  // Check if any UTM parameters are present in the query
  const hasUtmParams =
    query.utm_source ||
    query.utm_medium ||
    query.utm_campaign ||
    query.utm_term ||
    query.utm_content;

  // Only update if UTM parameters are present
  if (hasUtmParams) {
    const utmData: UTMData = {
      ...(query.utm_source && { utm_source: query.utm_source as string }),
      ...(query.utm_medium && { utm_medium: query.utm_medium as string }),
      ...(query.utm_campaign && { utm_campaign: query.utm_campaign as string }),
      ...(query.utm_term && { utm_term: query.utm_term as string }),
      ...(query.utm_content && { utm_content: query.utm_content as string }),
      landing_page_url: req.path,
    };

    // Store UTM data in session
    req.session.utm = utmData;
  }

  next();
}
