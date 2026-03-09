# System Architecture

## Overview

The Lost and Found Management System (LFMS) is a full-stack web application built with Next.js that enables users to report lost items, report found items, and get automatically matched using a rule-based matching engine.

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 3** - Utility-first CSS framework
- **TypeScript** - Type safety

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Server Actions** - For form submissions

### Database
- **Turso (libSQL)** - SQLite-compatible distributed database
- **Environment-based configuration**

## Architecture Layers

### 1. Presentation Layer (`/app`)
- App Router pages organized by feature
- Route groups: `(auth)` and `(dashboard)`
- Server components for data fetching
- Client components for interactivity

### 2. API Layer (`/api`)
- RESTful API routes
- Authentication endpoints
- Item management endpoints
- Match and claim management

### 3. Service Layer (`/lib/services`)
- Business logic separation
- Database operations
- Reusable functions

### 4. Data Layer (`/lib/db`)
- Database connection management
- Schema initialization

### 5. UI Components (`/components`)
- Reusable UI primitives (`/components/ui`)
- Feature-specific components (`/components/items`, `/components/dashboard`)

## Project Structure

```
/app
  /(auth)          # Authentication pages
  /(dashboard)     # Protected dashboard pages
  /api             # API routes

/components
  /ui              # Base UI components
  /layout          # Layout components
  /items           # Item-related components
  /dashboard       # Dashboard components

/lib
  /db              # Database connection
  /services        # Business logic
  /utils           # Utility functions
  /matching-engine # Matching algorithm

/types             # TypeScript type definitions
/database          # SQL schemas
/docs              # Documentation
```

## Security Measures

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control
- Server-side authorization checks
- Input validation

## Performance Optimizations

- Server components for reduced client bundle
- Database indexes for query optimization
- Debounced search inputs
- Efficient re-rendering with React patterns
