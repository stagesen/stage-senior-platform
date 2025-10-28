import type { Request, Response, NextFunction } from "express";

/**
 * URL Redirect Middleware
 *
 * Handles 301 redirects from old sitemap URLs to new structure
 * This ensures SEO value is preserved and search engines update their indexes
 */

// Map of old URLs to new URLs
const redirectMap: Record<string, string> = {
  // Properties → Communities
  "/properties": "/communities",
  "/properties/": "/communities",
  "/properties/golden-pond": "/communities/golden-pond",
  "/properties/stonebridge-assisted-living": "/communities/stonebridge-senior",
  "/properties/the-gardens-on-columbine": "/communities/the-gardens-at-columbine",
  "/properties/the-gardens-on-quail": "/communities/the-gardens-on-quail",

  // Special property pages that don't have direct community equivalents
  "/properties/healthy-at-home-care": "/in-home-care",
  "/properties/senior-living-colorado": "/communities",
  "/properties/senior-summits": "/communities",

  // Agents → Team
  "/agents/ben-chandler": "/team/ben-chandler",
  "/agents/bob-burden": "/team/bob-burden",
  "/agents/colleen-emery": "/team/colleen-emery",
  "/agents/jeff-ippen": "/team/jeff-ippen",
  "/agents/jonathan-hachmeister": "/team/jonathan-hachmeister",
  "/agents/josh-kavinsky": "/team/josh-kavinsky",
  "/agents/marci-gerke": "/team/marci-gerke",
  "/agents/natasha-barba": "/team/natasha-barba",
  "/agents/trevor-harwood": "/team/trevor-harwood",
  "/agents/troy-mcclymonds": "/team/troy-mcclymonds",

  // Other old URLs that may exist
  "/stage-cares-app": "/stage-cares",
  "/ads": "/",
  "/long-term-care-colorado": "/services/long-term-care",
  "/additional-ltc": "/services/long-term-care",
};

export function redirectMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get the path without query string
  const path = req.path;

  // Check if this path needs to be redirected
  if (redirectMap[path]) {
    // Preserve query string if present
    const queryString = Object.keys(req.query).length > 0
      ? '?' + new URLSearchParams(req.query as Record<string, string>).toString()
      : '';

    // 301 Moved Permanently - tells search engines to update their index
    return res.redirect(301, redirectMap[path] + queryString);
  }

  // No redirect needed, continue to next middleware
  next();
}
