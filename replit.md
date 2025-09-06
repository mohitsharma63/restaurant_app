# QR Code Digital Menu System

## Overview

A contactless restaurant ordering system built with React and Node.js that allows customers to scan QR codes placed on tables to access digital menus and place orders. The system includes a customer-facing menu interface and a restaurant dashboard for managing orders in real-time.

The application enables restaurants to provide a seamless dining experience where customers can browse menus, customize orders, and pay directly from their mobile devices without physical contact. Restaurant staff can manage incoming orders, update order statuses, and track real-time order flow through the dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing with clean URL structure
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack React Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Real-time Communication**: WebSocket server using 'ws' library for live order updates
- **Data Storage**: In-memory storage with interface-based design allowing easy database migration
- **Schema Validation**: Drizzle-zod for runtime type validation and schema definitions

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect configured for future database integration
- **Schema Structure**: 
  - Users (customers, restaurant staff, admins with role-based access)
  - Restaurants (establishment information and operational status)
  - Menu Items (products with categories, pricing, and availability)
  - Orders (customer orders with items, status tracking, and payment info)
  - QR Codes (table-specific codes linking to restaurant menus)
- **Migration System**: Drizzle Kit for database schema migrations and management

### Real-time Features
- **WebSocket Integration**: Live order status updates between customer and restaurant interfaces
- **Event Broadcasting**: Real-time notifications for new orders and status changes
- **Connection Management**: Automatic client connection handling with reconnection support

### Payment & Order Flow
- **Order Types**: Support for dine-in, takeaway, and delivery orders
- **Payment Methods**: Cash, card, and UPI payment options with status tracking
- **Order States**: Comprehensive status flow from pending to completed with restaurant control
- **Cart Management**: Local storage-based cart with item quantity management

### Development Environment
- **Hot Reload**: Vite dev server with HMR for rapid development cycles
- **Error Handling**: Runtime error overlays and comprehensive error boundaries
- **Path Aliases**: Clean import paths with @ aliases for organized code structure
- **TypeScript Configuration**: Strict type checking with modern ES features

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and data fetching with caching
- **wouter**: Lightweight routing library for single-page application navigation
- **drizzle-orm**: TypeScript ORM for database operations and query building
- **drizzle-kit**: Database migration and schema management tools

### UI and Styling
- **@radix-ui/**: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework with custom design system
- **class-variance-authority**: Type-safe variant styling for component libraries
- **lucide-react**: Consistent icon library with React components

### Database and Storage
- **@neondatabase/serverless**: PostgreSQL serverless database driver (configured but not active)
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Development Tools
- **vite**: Fast build tool with hot module replacement and optimization
- **typescript**: Static type checking and modern JavaScript features
- **@replit/vite-plugin-runtime-error-modal**: Development error handling overlay
- **@replit/vite-plugin-cartographer**: Replit-specific development tools

### Real-time Communication
- **ws**: WebSocket implementation for real-time order updates and notifications
- **express**: Web application framework for REST API and middleware

### Form Handling and Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers for various schema libraries
- **zod**: Runtime type validation and schema definition (via drizzle-zod)