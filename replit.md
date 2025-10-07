# Stage Senior Community Platform

## Overview

This is a comprehensive senior living community platform built for Stage Senior, a locally owned Colorado-based senior living management company founded in 2016. The application serves as the unified platform for showcasing Stage Senior's four flagship communities across Colorado. Stage Senior's mission is "Locally Owned, Resident-Focused," prioritizing dignity, comfort, and joy for residents through personalized care plans and exceptional team care.

**Important Note**: This project focuses exclusively on the communities and their offerings. Marketing pages like About, Company Information, etc. are handled on the main Stage Senior Webflow marketing site. This platform is dedicated to community details, floor plans, care types, events, and resident services.

## Stage Senior Communities

### Four Flagship Communities:

1. **The Gardens at Columbine** (Littleton, CO)
   - AL + MC (~124 units)
   - Known for expansive 2+ acre gardens, serene courtyards, thoughtful MC design
   - Starting: ~$5,245/mo for AL

2. **The Gardens on Quail** (Arvada, CO) 
   - IL Plus + AL + MC continuum
   - Upscale, custom-designed with bistro, theater, library, courtyards
   - Starting: ~$4,695/mo for AL, ~$8,150+ for MC

3. **Golden Pond** (Golden, CO)
   - IL + AL + MC (~114 units)
   - 20+ years locally owned, 98%+ resident satisfaction
   - Range: ~$3,855–$8,285/mo by unit & care level

4. **Stonebridge Senior** (Arvada, CO)
   - AL + MC (formerly Ralston Creek)
   - "Your Story First" care philosophy with family story sessions
   - Starting: ~$5,935/mo for AL

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React 18 and TypeScript, utilizing modern development patterns:

- **UI Framework**: React with functional components and hooks
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds
- **Team Page**: Comprehensive team directory organized by tags (Stage Management, Communities, Departments) with community-specific filtering when accessed from community pages
- **Team Member Profiles**: Individual profile pages for each team member at /team/:slug with bio, contact info, and community associations
- **Community Contact Cards**: Dynamic team member cards on community detail pages showing primary contact
- **Team Carousel**: Dynamic carousel on About Us page showcasing leadership team with links to individual profiles
- **Community-Filtered Team View**: When clicking "Meet the Team" from a community page, the team directory automatically filters to show only that community's staff members

The frontend follows a component-based architecture with reusable UI components, page-level components, and custom hooks for shared logic. The application supports responsive design and includes accessibility features.

### Backend Architecture
The server-side is built with Express.js following RESTful API principles:

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Middleware**: Custom logging, JSON parsing, and error handling middleware
- **Development**: Hot reloading with Vite integration for seamless development experience

The backend implements a service layer pattern with dedicated storage interfaces for data operations, ensuring separation of concerns and testability.

### Data Storage Solutions
The application uses PostgreSQL as the primary database with modern ORM tooling:

- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection Pooling**: Neon serverless pools for efficient connection management
- **Data Validation**: Zod schemas shared between client and server for consistent validation

The database schema supports complex relationships between communities, posts, events, FAQs, galleries, and tour requests, with proper indexing and constraints.

### Authentication and Authorization
The current implementation appears to use session-based authentication:

- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Security**: Credential-based requests with CORS support
- **Authorization**: Role-based access control for admin functionality

### Content Management
The platform includes a comprehensive admin interface for content management:

- **Community Management**: CRUD operations for community information, amenities, and care types with integrated image uploads. Includes metadata fields for rating (4.8 default), review count, license status ("Licensed & Insured"), and trust indicators (same-day tours, no obligation) - all displayed dynamically in CommunityCard components
- **Blog System**: Full blog management with categories, tags, featured content, hero image uploads, and team member author integration
- **Team Member Management**: Complete team member profiles with avatar images, roles, departments, bio/blurb text area, social links, and blog post author connections
- **Event Management**: Calendar-based event system with RSVP functionality and event image uploads
- **FAQ System**: Categorized frequently asked questions with search capabilities and HTML answer support
- **Gallery Management**: Image galleries with multi-image upload support (up to 20 images) and drag-and-drop functionality
- **Tour Requests**: Lead management system for potential residents
- **Page Heroes**: Dynamic hero sections with background image uploads for all major pages manageable through admin dashboard
- **Floor Plans**: Complete floor plan management with image uploads, pricing, and availability tracking
- **Testimonials**: Customer testimonials with community associations
- **Community Highlights**: Dynamic highlight cards for each community with customizable titles, descriptions, and images, replacing hardcoded content
- **Experience the Difference Features**: Customizable feature sections for each community with eyebrow text, titles, descriptions, images, CTAs, and layout options, fully manageable through admin dashboard
- **Homepage Sections**: Dynamic homepage content management system for editing homepage feature sections (e.g., "Safety with Dignity") with title, subtitle, body, CTA, image support, and visibility controls through admin dashboard
- **Email Forwarding System**: Automated email notification system for tour request submissions with admin-configurable recipient management. Tour requests are automatically forwarded to all active recipients via Resend email service.
- **Dining Page**: Dedicated dining services page showcasing Restaurant-Style Dining and Private Family Dining Room amenities with weekly menu samples
- **Beauty Salon & Barber Page**: Comprehensive beauty services page featuring salon services for women, barber services for men, and on-site convenience benefits
- **Fitness & Therapy Center Page**: Comprehensive fitness and therapy services page featuring state-of-the-art fitness equipment, physical therapy, occupational therapy, and speech therapy services
- **Courtyards & Patios Page**: Outdoor spaces and amenities page showcasing secure courtyards, walking paths, garden areas, covered patios, outdoor dining areas, and seasonal activities
- **Smart Amenity Linking**: Amenities on community pages automatically link to their respective service pages with blue text and arrow indicators for seamless navigation:
  - Dining amenities → /dining page
  - Beauty/barber amenities → /beauty-salon page
  - Fitness/therapy amenities → /fitness-therapy page
  - Outdoor/garden/courtyard amenities → /courtyards-patios page

### Image Management System
The platform features a comprehensive image management system integrated with Replit's object storage:

- **Database-Backed Storage**: All images stored in object storage with metadata tracked in PostgreSQL
- **Upload Capabilities**: Drag-and-drop file uploads with progress tracking and preview
- **Multi-Image Support**: Galleries support up to 20 images with reordering capabilities
- **Reference Protection**: Images cannot be deleted while referenced by content
- **Automatic Processing**: Dimension extraction and validation for all uploaded images
- **Community Associations**: All content types can be associated with specific communities for better organization
- **Image Resolution System**: Custom `useResolveImageUrl` hook that automatically handles both UUID image IDs and direct URLs, resolving IDs to actual URLs via API
- **Community Image Fields**: Communities support multiple image types - hero, logo, contact card, and brochure card images, all manageable through admin
- **Community Logo Display**: Logo images display in community detail pages (hero overlay and sticky nav) with proper fallback support for legacy logo fields
- **Carousel Image Support**: Homepage carousel properly displays community hero images with automatic resolution of stored image IDs

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and automatic scaling

### UI Component Libraries
- **Radix UI**: Headless UI components for accessibility and behavior
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Replit**: Platform-specific plugins for development environment integration
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class name utility
- **class-variance-authority**: Type-safe variant API for component styling
- **cmdk**: Command palette implementation for enhanced UX

### Image Hosting
- **Unsplash**: External image service for placeholder and hero images (configured as fallbacks)

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between concerns. The use of shared schemas between client and server ensures data consistency, while the modern toolchain provides fast development cycles and optimized production builds.