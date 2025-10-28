# Stage Senior Community Platform

## Overview
This platform is a comprehensive senior living community application for Stage Senior, showcasing their four flagship communities. It focuses on community details, floor plans, care types, events, and resident services, aiming to provide a resident-focused experience. The application complements Stage Senior's main marketing site by specializing in community-specific content and resident engagement.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
Built with React 18 and TypeScript, utilizing Wouter for routing, TanStack Query for state management, Tailwind CSS with shadcn/ui for styling, and React Hook Form with Zod for form handling. Vite is used for development. Features responsive design, accessibility, dynamic team directory, and hash-based URL navigation with scroll-spy for content sections. Performance is optimized with route-based code splitting and image optimizations following 2025 best practices (e.g., `fetchpriority="high"`, `loading="lazy"`).

### Backend
An Express.js application using Node.js and TypeScript, following RESTful API principles. It incorporates middleware for logging, JSON parsing, and error handling, with a service layer for data operations. Lightweight API endpoints and server-side filtering are used for performance.

### Data Storage
PostgreSQL, hosted on Neon, is the primary database. Drizzle ORM provides type-safe interactions. Zod schemas are shared for client/server validation. The database supports complex relationships for communities, posts, events, FAQs, and tour requests.

### Authentication and Authorization
Session-based authentication with `connect-pg-simple` stores sessions in PostgreSQL. Role-based authorization controls admin access.

### Content Management
A comprehensive admin interface supports CRUD operations for:
- **Community Management**: Details, amenities, care types, images, ratings, property map URLs, and active/inactive status.
  - **Community-Specific Amenity Images**: Upload custom images for four key amenities (Fitness Center, Private Dining, Beauty Salon, Courtyards & Patios) per community. These images display on both community detail pages (in row-based amenity layout) and dedicated amenity pages when accessed via `?from=<community-slug>` parameter.
- **Content Systems**: Blog, team member, event, FAQ, gallery, and testimonial management with image uploads and community associations.
- **Dynamic Content**: Management for page heroes, floor plans, community highlights, and homepage sections.
- **Lead Management**: Tour request system with email forwarding.
- **Specialized Pages**: Management for Dining, Beauty Salon, Fitness, and Courtyards pages with amenity linking.
- **Google Ads Landing Page System**: Template-based dynamic landing pages with UTM tracking and content reuse.
- **Google Ads Conversion Manager**: Admin interface for managing Google Ads conversion actions via API, including quick-create templates, syncing from Google Ads, and providing labels for GTM integration.

### Image Management
Integrated system for object storage of images with metadata in PostgreSQL. Features drag-and-drop uploads, multi-image galleries, reference protection, automatic dimension processing, and a custom hook for image ID resolution.

### Contact Information
A centralized system ensures consistent formatting for phone numbers (with `tel:` links), addresses, and emails across all community displays, with fallbacks for missing data.

### Conversion Tracking System
Comprehensive tracking for Google Ads and Meta, capturing user journey data with deduplication.
- **Primary Conversions**: ScheduleTour, PhoneCallStart.
- **Secondary Conversions**: GenerateLead, PricingRequest.
- **Architecture**: Browser-side tracking uses dataLayer with hashed PII, UTMs, and click IDs. Server-side tracking sends conversions to Google Ads Enhanced Conversions API and Meta Conversions API, using shared `event_id` for deduplication. Integrates with TalkFurther scheduling widget.

### Monitoring and Observability
- **Error Tracking**: Sentry is used for comprehensive error tracking and performance monitoring for both frontend (JavaScript errors, performance, session replay) and backend (Express.js errors, API performance).
- **Uptime Monitoring**: UptimeRobot monitors main website health, API health, and database connectivity.

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting.

### UI Component Libraries
- **Radix UI**: Headless UI components.
- **shadcn/ui**: Component library built on Radix UI.
- **Lucide React**: Icon library.

### Utility Libraries
- **date-fns**: Date manipulation.
- **clsx**: Conditional CSS class names.
- **class-variance-authority**: Type-safe variant API.
- **cmdk**: Command palette implementation.

### Email Service
- **Resend**: For automated email notifications (e.g., tour requests).

### Monitoring & Error Tracking
- **Sentry**: Application monitoring, error tracking, and performance monitoring for both frontend and backend.

### Advertising Platforms
- **Google Ads API**: For programmatic creation and management of conversion actions.
- **Google Ads**: Enhanced Conversions for Leads (ECL) integration.
- **Meta Conversions API**: Server-side conversion tracking for Facebook/Instagram ads.