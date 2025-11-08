# Mera Pruthvi (GaiaMind) - AI-Powered Sustainability Platform

## Overview

Mera Pruthvi (also known as GaiaMind) is an AI-powered sustainability intelligence platform designed to help cities, organizations, and citizens predict, prevent, and reduce environmental impact. It offers real-time insights on urban heat, pollution, waste management, and carbon emissions through four core modules: AI Climate Dashboard, Smart Waste Management, Carbon Tracker, and Citizen Engagement (GreenPulse).

The platform serves government officials, organizations requiring comprehensive environmental data analytics, and citizens who can report issues, track personal impact, and earn rewards through gamification.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for fast development. It leverages Wouter for routing, TanStack Query for state management, and `shadcn/ui` components based on Radix UI primitives. Styling is managed with Tailwind CSS, following a hybrid Material Design approach with a nature-inspired color palette and responsive design, supporting both light and dark modes.

### Backend Architecture

The backend uses Node.js with Express.js and TypeScript. Drizzle ORM is used for database interaction with PostgreSQL (configured for Neon serverless). The API is RESTful, JSON-based, and includes centralized error handling.

### Database Schema

The core database tables include `users`, `resource_entries`, `navigation_routes`, `environmental_issues`, `waste_classifications`, and `irrigation_schedules`. All tables are linked to users via foreign keys and use UUID-based primary keys.

### AI/ML Integration

The platform primarily integrates **Google Gemini AI** (using `gemini-2.5-flash`) for resource optimization, environmental analysis, conversational AI, and waste classification. It also integrates **OpenAI** for advanced NLP and vision capabilities.

AI features include:
- Resource consumption analysis and optimization.
- Waste classification from uploaded images.
- Irrigation scheduling based on weather data and crop/soil conditions.
- Eco-friendly route optimization with carbon impact calculation.
- Environmental issue categorization and priority assignment.

### Gamification System

Users earn Eco-Points for sustainable actions, contributing to a level progression system. Credits are awarded for resource tracking, waste classification, and choosing sustainable transportation modes (e.g., walking/cycling: 20 credits, public transport: 15 credits, carpooling: 10 credits). The system includes community leaderboards and achievement badges.

### UI/UX Decisions

The platform features a glassmorphism UI, color-coded badges for resource ratings, interactive maps with real-time route calculations, and dynamic analytics dashboards using Recharts. Key UI enhancements include a simplified landing page, an editable profile page, and an impact summary on the dashboard.

### Current Access Method

The application uses a demo user approach (`demo-user-123`) for direct access without login/signup. This demo user is automatically created on startup.

## External Dependencies

### Third-Party Services

-   **Google Gemini AI**: Primary AI engine for recommendations and analysis.
-   **OpenAI**: Used for advanced NLP and vision capabilities.
-   **Neon Serverless PostgreSQL**: Production database hosting.
-   **Google Maps Platform**: For interactive maps, Places autocomplete, and real route calculations.
-   **Google Weather API**: Provides real-time weather data for irrigation recommendations.

### Key NPM Packages

-   **Frontend**: `react`, `react-dom`, `vite`, `wouter`, `@tanstack/react-query`, `shadcn/ui`, `tailwindcss`, `@radix-ui/*`, `lucide-react`, `react-hook-form`, `zod`.
-   **Backend**: `express`, `drizzle-orm`, `@neondatabase/serverless`.
-   **AI**: `@google/generative-ai`.
-   **Utilities**: `date-fns`, `clsx`, `nanoid`.

### Environment Variables Required

-   `DATABASE_URL` (PostgreSQL connection string)
-   `GEMINI_API_KEY` (Google Gemini AI API key)
-   `OPENAI_API_KEY` (OpenAI API key)
-   `NODE_ENV` (Environment mode)
-   `GOOGLE_MAPS_API_KEY` (Google Maps Platform API key)
-   `WEATHER_API` (Google Weather API key)