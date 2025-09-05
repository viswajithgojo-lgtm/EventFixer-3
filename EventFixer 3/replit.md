# Overview

This is a luxury AI bus tracking application built as a full-stack web application. The app provides real-time bus tracking, AI-powered assistance, and an elegant mobile-first interface for transit users. It features a React frontend with a Node.js/Express backend, utilizing PostgreSQL for data storage and implementing a modern tech stack with TypeScript throughout.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: In-memory storage with interface for database integration
- **Middleware**: Custom logging, JSON parsing, and error handling

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Two main tables - buses (tracking data) and chatMessages (AI chat history)
- **Migration**: Drizzle Kit for schema management and migrations
- **Connection**: Neon Database serverless PostgreSQL

## Mobile-First Design
- **Responsive**: Mobile-optimized with max-width container (414px)
- **Navigation**: Bottom navigation bar with glassmorphism effects
- **Status Bar**: Custom mobile status bar simulation
- **Touch-Friendly**: Large touch targets and swipe-friendly interactions

## AI Integration
- **Chat Interface**: Real-time chat with typing indicators
- **Smart Responses**: Keyword-based AI responses for transit queries
- **Message Storage**: Persistent chat history in database
- **Quick Actions**: Pre-defined suggestion buttons for common queries

## Development Workflow
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reload**: Vite development server with Express middleware integration
- **Type Safety**: Strict TypeScript configuration with shared types
- **Path Aliases**: Organized imports with @ and @shared prefixes

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **Routing**: Wouter for lightweight client-side routing
- **Database**: Drizzle ORM with Neon Database PostgreSQL adapter
- **Validation**: Zod for runtime type validation and schema definition

## UI Component Libraries
- **Design System**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Carousel**: Embla Carousel for touch-friendly slideable content
- **Styling**: Tailwind CSS with class-variance-authority for component variants

## Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **CSS Processing**: PostCSS with Tailwind and Autoprefixer
- **Error Handling**: Replit-specific error overlay and development tools
- **Code Quality**: ESLint with TypeScript and React-specific rules

## Backend Services
- **Database**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling and deployment