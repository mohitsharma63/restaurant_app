# QR Code Menu System

## Overview

This is a QR Code Menu System built as a full-stack restaurant ordering application. Customers scan QR codes at tables to access digital menus, place orders, and make payments. Restaurant staff manage orders through a dedicated dashboard. The system supports real-time order updates and includes QR code generation capabilities for table management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React with TypeScript** - Modern React application using TypeScript for type safety and better development experience. The frontend is structured as a single-page application (SPA) with client-side routing using Wouter for lightweight navigation between customer menu, restaurant dashboard, and QR generator pages.

**Component Library** - Built on shadcn/ui component system with Radix UI primitives for accessible, customizable components. Uses Tailwind CSS for utility-first styling with a custom design system including restaurant-themed colors (orange primary, green secondary, yellow accent).

**State Management** - Uses React Query (TanStack Query) for server state management with custom hooks for cart functionality and WebSocket connections. Cart state is managed locally with React hooks, providing add/remove item functionality and total calculations.

**Real-time Updates** - WebSocket integration for live order status updates between customer and restaurant interfaces, enabling immediate notification of order changes and new orders.

### Backend Architecture

**Express.js Server** - RESTful API built with Express.js and TypeScript, providing endpoints for restaurants, menu management, table management, and order processing. Includes middleware for request logging and error handling.

**Database Layer** - PostgreSQL database with Drizzle ORM for type-safe database operations. Schema includes restaurants, menu categories, menu items, tables, orders, and order items with proper relationships and constraints.

**WebSocket Server** - Real-time communication using WebSocket server for broadcasting order updates to connected clients, supporting live dashboard updates and customer notifications.

**Storage Interface** - Abstracted storage layer with comprehensive CRUD operations for all entities, supporting complex queries for order management and menu filtering.

### Data Storage

**PostgreSQL Database** - Primary data store using Neon serverless PostgreSQL for scalability and performance. Database schema designed with proper normalization and relationships between entities.

**Drizzle ORM** - Type-safe database operations with schema validation using Drizzle with Zod for runtime type checking. Supports migrations and development-friendly database management.

**Sample Data Initialization** - Automatic sample data generation for development and testing, including demo restaurants, menu items, and tables.

### External Dependencies

**Neon Database** - Serverless PostgreSQL hosting with connection pooling and automatic scaling
**Radix UI** - Accessible component primitives for building the user interface
**TanStack Query** - Server state management and caching for efficient data fetching
**Tailwind CSS** - Utility-first CSS framework for responsive design
**WebSocket (ws)** - Real-time bidirectional communication
**QR Code API** - External QR code generation service for table codes
**Vite** - Modern build tool for fast development and optimized production builds
**Wouter** - Lightweight client-side routing library