# Restaurant QR Code Ordering System

## Overview

This is a modern restaurant ordering system that enables customers to scan QR codes at tables to view menus and place orders directly from their phones. The system provides a comprehensive platform for restaurants to manage their digital presence, menus, orders, and table service through QR code technology.

The application features a customer-facing menu interface accessed via QR codes, real-time order tracking, and an administrative dashboard for restaurant management. Built with a modern React frontend and Express backend, it uses PostgreSQL for data persistence and implements secure authentication and session management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern component patterns
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management, caching, and background synchronization
- **Shadcn/ui** component library built on Radix UI primitives for consistent, accessible design
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Vite** as the build tool for fast development and optimized production builds

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **Passport.js** with local strategy for authentication and session management
- **Session-based authentication** using connect-pg-simple for PostgreSQL session storage
- **RESTful API design** with consistent error handling and logging middleware
- **Custom storage layer** abstracting database operations from route handlers

### Database Schema Design
- **PostgreSQL** as the primary database with UUID primary keys for security
- **Drizzle ORM** for type-safe database operations and schema management
- **Relational data model** connecting users, restaurants, tables, categories, menu items, and orders
- **QR code integration** through unique codes linked to restaurant tables
- **Order tracking system** with status management (pending, confirmed, preparing, ready, served)

### Authentication & Authorization
- **Password hashing** using Node.js crypto with scrypt and salt
- **Session management** with secure cookies and PostgreSQL session store
- **Role-based access control** supporting customer, staff, and admin roles
- **Protected routes** with middleware for authenticated and role-specific access

### QR Code Integration
- **Table-specific QR codes** that encode unique identifiers
- **Mobile-first menu experience** optimized for smartphone scanning
- **Fallback manual entry** for accessibility when camera scanning isn't available
- **Demo QR simulation** for development and testing environments

### Real-time Features
- **Polling-based order updates** using TanStack Query's refetch intervals
- **Live order status tracking** for both customers and restaurant staff
- **Cart persistence** in local component state with checkout flow
- **Toast notifications** for user feedback and order confirmations

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver for database connectivity
- **drizzle-orm** and **drizzle-zod** - Type-safe ORM with Zod schema validation
- **@tanstack/react-query** - Server state management and caching
- **wouter** - Lightweight routing library for React applications

### UI and Design System
- **@radix-ui/* components** - Accessible, unstyled UI primitives (40+ components)
- **tailwindcss** - Utility-first CSS framework with custom configuration
- **class-variance-authority** and **clsx** - Conditional CSS class utilities
- **lucide-react** - Icon library for consistent iconography

### Authentication and Security
- **passport** and **passport-local** - Authentication middleware and strategy
- **express-session** and **connect-pg-simple** - Session management with PostgreSQL
- **@hookform/resolvers** and **react-hook-form** - Form handling and validation

### Development and Build Tools
- **vite** and **@vitejs/plugin-react** - Build tooling and React integration
- **typescript** - Static type checking across the entire codebase
- **esbuild** - Fast JavaScript bundler for server-side code
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay

### Utility Libraries
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation for sessions and resources
- **zod** - Runtime type validation and schema definition