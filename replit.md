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

### Data Storage Solutions
PostgreSQL is the primary database, hosted on Neon for serverless capabilities. Drizzle ORM is used for type-safe database interactions and schema management. Zod schemas are shared between client and server for consistent data validation. The database schema supports complex relationships across various content types like communities, posts, events, FAQs, and tour requests.

### Authentication and Authorization
The system uses session-based authentication with `connect-pg-simple` for PostgreSQL session storage. Authorization is role-based, controlling access to admin functionalities.

### Content Management
A comprehensive admin interface provides CRUD operations for:
- **Community Management**: Includes details, amenities, care types, image uploads, `rating` fields, and active/inactive status. Supports cascade deletion for associated data.
- **Content Systems**: Blog, team member, event, FAQ, gallery, and testimonial management with image uploads and community associations.
- **Dynamic Content**: Management for page heroes, floor plans, community highlights, "Experience the Difference" features, and homepage sections.
- **Lead Management**: Tour request system with automated email forwarding via Resend.
- **Data Utilities**: Database sync system for exporting/importing data.
- **Specialized Pages**: Management for Dining, Beauty Salon & Barber, Fitness & Therapy Center, and Courtyards & Patios pages, with smart amenity linking.
- **Google Ads Landing Page System**: Template-based dynamic landing pages with UTM tracking, content reuse, and an admin interface for template management.

### Image Management System
An integrated image management system stores images in object storage with metadata in PostgreSQL. It supports drag-and-drop uploads, multi-image galleries, and reference protection. Images are automatically processed for dimensions, and a custom `useResolveImageUrl` hook handles image ID resolution. Communities can have various image types (hero, logo, contact card, brochure card).

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