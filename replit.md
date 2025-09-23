# Senior Living Community Platform

## Overview

This is a comprehensive senior living community platform built for Stage Senior, a Colorado-based senior living management company. The application serves as both a public-facing website and content management system for showcasing four flagship communities: The Gardens at Columbine, The Gardens on Quail, Golden Pond, and Stonebridge Senior. The platform supports multiple care types including Assisted Living, Memory Care, and Independent Living, with features for community discovery, event management, blog content, and tour request handling.

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

- **Community Management**: CRUD operations for community information, amenities, and care types
- **Blog System**: Full blog management with categories, tags, and featured content
- **Event Management**: Calendar-based event system with RSVP functionality
- **FAQ System**: Categorized frequently asked questions with search capabilities
- **Gallery Management**: Image galleries with lightbox functionality
- **Tour Requests**: Lead management system for potential residents

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