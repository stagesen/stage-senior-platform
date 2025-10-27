# Stage Senior Community Platform

## Overview
This platform is a comprehensive senior living community application for Stage Senior, a Colorado-based company. It serves as a unified system to showcase their four flagship communities, focusing on community details, floor plans, care types, events, and resident services. The core mission is to provide a resident-focused experience, prioritizing dignity, comfort, and joy through personalized care. This application complements Stage Senior's main marketing site by focusing exclusively on community-specific content and resident engagement.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using modern patterns. It leverages Wouter for routing, TanStack Query for state management, Tailwind CSS with shadcn/ui for styling, and React Hook Form with Zod for form handling. Vite is used for fast development and optimized builds. The architecture is component-based, supporting responsive design and accessibility, and includes features like a dynamic team directory with filtering, individual team member profiles, and dynamic contact cards.

### Backend Architecture
The backend is an Express.js application built with Node.js and TypeScript, adhering to RESTful API principles. It incorporates middleware for logging, JSON parsing, and error handling. A service layer pattern is used for data operations, ensuring separation of concerns.

### Performance Optimizations
The platform implements route-based code splitting using `React.lazy()` and `Suspense` for all page components to reduce initial bundle size. Lightweight API endpoints are designed to eliminate over-fetching, providing minimal data for specific UI components (e.g., `/api/communities/minimal`, `/api/communities/cards`, `/api/communities/dropdown`). Server-side filtering is utilized for community listings to optimize data retrieval.

**Image Performance (2025 Best Practices):**
- All hero images use `fetchpriority="high"` for optimal Largest Contentful Paint (LCP)
- Hero components (PageHero, ParallaxHero) use `<img>` tags instead of CSS backgrounds for better browser optimization
- All images have explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS)
- Below-the-fold images use `loading="lazy"` for deferred loading
- All images include `decoding="async"` for non-blocking rendering
- Optimizations applied across: community detail pages, landing pages, galleries, floor plans, and team member profiles

### Data Storage Solutions
PostgreSQL is the primary database, hosted on Neon for serverless capabilities. Drizzle ORM is used for type-safe database interactions and schema management. Zod schemas are shared between client and server for consistent data validation. The database schema supports complex relationships across various content types like communities, posts, events, FAQs, and tour requests.

### Authentication and Authorization
The system uses session-based authentication with `connect-pg-simple` for PostgreSQL session storage. Authorization is role-based, controlling access to admin functionalities.

### Content Management
A comprehensive admin interface provides CRUD operations for:
- **Community Management**: Includes details, amenities, care types, image uploads, `rating` fields, property map URLs (for Sightmap iframe embeds), and active/inactive status. Supports cascade deletion for associated data.
- **Content Systems**: Blog, team member, event, FAQ, gallery, and testimonial management with image uploads and community associations. Content assets (resource articles) support optional fields with proper nullable validation for `authorId`, `thumbnailImageId`, `featuredImageId`, and `fileSize`.
- **Dynamic Content**: Management for page heroes, floor plans, community highlights, "Experience the Difference" features, and homepage sections.
- **Lead Management**: Tour request system with automated email forwarding via Resend.
- **Data Utilities**: Database sync system for exporting/importing data.
- **Specialized Pages**: Management for Dining, Beauty Salon & Barber, Fitness & Therapy Center, and Courtyards & Patios pages, with smart amenity linking.
- **Google Ads Landing Page System**: Template-based dynamic landing pages with UTM tracking, content reuse, and an admin interface for template management.
- **Google Ads Conversion Manager**: Admin interface for creating and managing Google Ads conversion actions via API, with one-click templates, sync from Google Ads, and copy-to-clipboard labels for GTM integration.

### Image Management System
An integrated image management system stores images in object storage with metadata in PostgreSQL. It supports drag-and-drop uploads, multi-image galleries, and reference protection. Images are automatically processed for dimensions, and a custom `useResolveImageUrl` hook handles image ID resolution. Communities can have various image types (hero, logo, contact card, brochure card).

### Contact Information Formatting
A centralized contact information formatting system ensures consistency across all community displays. Helper functions in `client/src/lib/communityContact.ts` handle:
- **Phone Numbers**: `getPrimaryPhoneDisplay()` for formatted display, `getPrimaryPhoneHref()` for clickable tel: links with +1 country code prefix
- **Addresses**: `getCityStateZip()` and `getCityState()` for consistent location formatting, checking both `zipCode` and `zip` fields
- **Email**: `getPrimaryEmail()` for email addresses
- All phone links automatically normalize to international format (tel:+1...) for proper mobile device handling
- Graceful fallback to default Stage Senior contact information when community data is missing

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting.

### UI Component Libraries
- **Radix UI**: Headless UI components.
- **shadcn/ui**: Component library built on Radix UI.
- **Lucide React**: Icon library.

### Development Tools
- **Replit**: Platform-specific plugins.
- **Vite**: Fast development server and bundler.
- **ESBuild**: JavaScript bundler.
- **PostCSS**: CSS processing with Tailwind CSS.

### Utility Libraries
- **date-fns**: Date manipulation.
- **clsx**: Conditional CSS class names.
- **class-variance-authority**: Type-safe variant API.
- **cmdk**: Command palette implementation.

### Email Service
- **Resend**: For automated email notifications (e.g., tour requests).

### Advertising Platforms
- **Google Ads API**: For programmatic creation and management of conversion actions.
- **Google Ads**: Enhanced Conversions for Leads (ECL) integration with server-side and browser-side tracking.
- **Meta Conversions API**: Server-side conversion tracking for Facebook/Instagram ads.

## Conversion Tracking System

The platform implements comprehensive conversion tracking for Google Ads and Meta advertising platforms. The system captures user journey data from first click through conversion, with proper deduplication between server-side and browser-side events.

### Tracking Events

**Primary Conversions** (used for bidding):
- **ScheduleTour** - $250 value - Tour request submissions (native forms and TalkFurther widget)
- **PhoneCallStart** - $25 value - Click-to-call interactions

**Secondary Conversions** (observation only):
- **GenerateLead** - $25 value - General contact form submissions
- **PricingRequest** - $25 value - Pricing inquiry submissions

### Architecture

**Browser-Side Tracking:**
- Events fire to dataLayer with complete metadata (event_id, value, hashed PII, click IDs, UTM params)
- UTM parameters and click IDs (gclid, gbraid, wbraid, fbclid) auto-captured via middleware
- Meta cookies (_fbp, _fbc) tracked for attribution
- PII (email, phone) hashed with SHA-256 before transmission

**Server-Side Tracking:**
- Conversions sent to Google Ads Enhanced Conversions API and Meta Conversions API
- Click ID middleware preserves gclid/gbraid/wbraid in secure HTTP-only cookies
- Event deduplication using shared event_id between browser and server events
- Proper sequence: Server conversion fires first, browser fires backup with same event_id

**TalkFurther Integration:**
- Third-party scheduling widget opens when users click buttons with `talkfurther-schedule-tour` CSS class
- After submission, TalkFurther redirects to `/tour-scheduled` success page
- Success page fires conversion tracking with generated event_id if not in URL parameters

### Google Ads Conversion Manager

**Admin Interface** (`/admin` → Google Ads tab):

1. **Quick-Create Templates:**
   - Schedule Tour ($250, PRIMARY)
   - Generate Lead ($25, SECONDARY)
   - Pricing Request ($25, SECONDARY)
   - Phone Call Start ($25, PRIMARY)

2. **Sync from Google Ads:**
   - One-click sync button fetches all conversion actions from Google Ads API
   - Updates database with latest metadata (name, value, status, attribution model)
   - Shows synced/updated counts

3. **Copy Labels for GTM:**
   - Each conversion displays its label with copy-to-clipboard button
   - Labels needed for GTM tag configuration
   - Format: Opaque string extracted from Google Ads tag snippets

**GTM Integration Workflow:**

1. **In Admin Panel:**
   - Create conversion action using template or custom values
   - API creates conversion in Google Ads account
   - Copy the conversion label to clipboard

2. **In Google Tag Manager:**
   - Create trigger for custom event (e.g., "ScheduleTour")
   - Create Google Ads Conversion tag:
     - Conversion ID: AW-17667766916
     - Conversion Label: (paste from admin panel)
     - Transaction ID: {{DLV - event_id}}
     - Value: {{DLV - value}}
     - Enhanced Conversions: Manual mode with {{DLV - user.email}} and {{DLV - user.phone}} (already hashed)
   - Create Meta Pixel tag with eventID: {{DLV - event_id}} for deduplication

3. **Data Layer Variables in GTM:**
   - event_id, value, currency
   - user.email, user.phone (pre-hashed with SHA-256)
   - care_level, metro, community_name, landing_page
   - gclid, gbraid, wbraid, fbp, fbc

**API Credentials Required:**
- GOOGLE_ADS_DEVELOPER_TOKEN
- GOOGLE_ADS_CLIENT_ID
- GOOGLE_ADS_CLIENT_SECRET
- GOOGLE_ADS_REFRESH_TOKEN
- GOOGLE_ADS_CUSTOMER_ID

Stored as environment secrets for secure access to Google Ads API.