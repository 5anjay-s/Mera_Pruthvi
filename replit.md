# Mera Pruthvi (GaiaMind) - AI-Powered Sustainability Platform

## Recent Changes (November 2025)

**Status: ✅ Major Feature Additions Completed - Ready for Authentication Integration**

Successfully implemented comprehensive enhancements to the Mera Pruthvi sustainability platform:

### **New Features Implemented:**

1. **PostgreSQL Database Migration** ✅
   - Migrated from in-memory storage (MemStorage) to PostgreSQL with DatabaseStorage
   - All user data now persists across server restarts
   - Schema pushed to database with proper foreign key relationships

2. **AI Consolidation to Gemini Only** ✅
   - Removed OpenAI dependency completely
   - Smart Waste Classifier now uses Gemini 2.0 Flash Vision API for image analysis
   - Single AI provider (Gemini) for all features: waste classification, resource optimization, irrigation, chat

3. **Enhanced Resource Monitor with Rating System** ✅
   - Good/Normal/Bad/Worst ratings based on industry benchmarks
   - Color-coded badges (green=Good, yellow=Normal, orange=Bad, red=Worst)
   - Industry benchmark comparisons showing percentage of normal usage
   - Gemini AI generates 3-4 specific enhancement points tailored to rating level
   - Bonus +10 eco-points for achieving "Good" ratings
   - Glassmorphism UI with collapsible suggestions panel

4. **Google Maps Navigation Integration** ✅
   - Real Google Directions API integration with GOOGLE_MAPS_API_KEY
   - Interactive map display with Places autocomplete for addresses
   - Real route calculations for Walking, Cycling, Transit, and Driving
   - Route polylines color-coded by transport mode (green=eco, red=high-carbon)
   - Accurate carbon emissions: walking/cycling=0g, transit=50g/km, driving=120g/km
   - Tiered credits: Walk/Cycle=20, Transit=15, Carpool=10, Solo=2
   - Glassmorphism overlay showing distance, duration, CO₂, carbon saved vs. driving

5. **Open-Meteo Weather Integration** ✅
   - Free weather API (no key required) integrated into irrigation assistant
   - Real-time weather data: temperature, humidity, precipitation, wind speed
   - Weather-aware AI irrigation recommendations from Gemini
   - Smart suggestions like "Rain detected - skip watering today"
   - Glassmorphism weather cards with Lucide icons

6. **Analytics Dashboard with Recharts** ✅
   - New Analytics tab in Dashboard with 4 interactive graphs:
     * Eco-Points Trend (LineChart) - 30-day cumulative points with gradient fill
     * Carbon Savings (AreaChart) - cumulative CO₂ saved over time
     * Resource Consumption (BarChart) - electricity/water/gas breakdown
     * Activity Breakdown (PieChart) - distribution of tracked activities
   - Summary statistics cards: total points, total CO₂ saved, most used resource
   - Responsive design with glassmorphism styling and nature-inspired gradients
   - Backend `/api/analytics` endpoint aggregates data from all tables

**Technical Implementation:**
- DatabaseStorage class with proper Drizzle ORM queries (eq, desc operators)
- Gemini 2.0 Flash Vision API for waste classification with inline image data
- Google Maps JavaScript API with @googlemaps/js-api-loader
- Open-Meteo forecast API integration (https://api.open-meteo.com/v1/forecast)
- Recharts graphs with ResponsiveContainer, gradients, and theme-aware colors
- All data properly invalidates cache for real-time UI updates

**Current Status:**
- Database: PostgreSQL (Neon) with all tables migrated ✅
- AI: Gemini only (OpenAI removed) ✅
- Storage: DatabaseStorage (persistent) ✅
- Maps: Google Maps integrated with real routes ✅
- Weather: Open-Meteo integrated ✅
- Analytics: Recharts graphs functional ✅
- Authentication: Simple username/password with bcrypt ✅

**Latest Changes - November 8, 2025:**

7. **Simple Username/Password Authentication** ✅
   - Replaced Replit Auth OIDC with simple username/password authentication
   - Database schema updated with `username` (unique) and `password` columns
   - Password hashing with bcrypt (10 salt rounds) - NEVER stores plain text passwords
   - Session-based authentication using express-session
   - Login page (client/src/pages/Login.tsx) with form validation
   - Signup page (client/src/pages/Signup.tsx) with username, password, email, name fields
   - All API routes protected with `requireAuth` middleware
   - Secure password comparison using bcrypt.compare()
   - Passwords never sent to client (filtered in responses)
   - Session cleanup on user not found (handles deleted accounts)

## Overview

Mera Pruthvi (also known as GaiaMind) is an AI-powered sustainability intelligence platform designed to help cities, organizations, and citizens predict, prevent, and reduce environmental impact. The platform provides real-time insights on urban heat, pollution, waste management, and carbon emissions through four core modules:

1. **AI Climate Dashboard** - Real-time environmental monitoring and forecasting
2. **Smart Waste Management** - Computer vision-based waste classification and route optimization
3. **Carbon Tracker** - Personal and organizational carbon footprint monitoring
4. **Citizen Engagement (GreenPulse)** - Community-driven environmental issue reporting and gamification

The platform serves two primary audiences:
- Government officials and organizations requiring comprehensive environmental data analytics
- Citizens who can report issues, track personal impact, and earn rewards through gamification

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite for fast development and optimized production builds
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state management
- **UI Framework:** shadcn/ui components built on Radix UI primitives
- **Styling:** Tailwind CSS with custom design system

**Design System:**
- Hybrid Material Design approach with environmental focus
- Typography: Inter for UI, JetBrains Mono for metrics/data
- Custom color palette with nature-inspired gradients
- Responsive spacing system using Tailwind units (2, 4, 8, 12, 16)
- Light/dark mode support with theme toggle functionality

**Key Frontend Patterns:**
- Component-based architecture with reusable UI components
- Custom hooks for cross-cutting concerns (mobile detection, toast notifications)
- Form handling with React Hook Form and Zod validation
- Optimistic UI updates for better user experience

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript with ES modules
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL (configured for Neon serverless)
- **AI Integration:** Google Gemini AI and OpenAI APIs

**API Design:**
- RESTful API structure with `/api` prefix
- JSON-based request/response format
- Session-based authentication (configured with connect-pg-simple)
- Centralized error handling middleware

**Data Layer:**
- Schema-first approach using Drizzle ORM
- Type-safe database queries with TypeScript inference
- Migration-based schema evolution
- Currently uses in-memory storage (MemStorage) for development with interface for database implementation

### Database Schema

**Core Tables:**
1. **users** - User accounts with gamification metrics (eco_points, level, carbon_footprint)
2. **resource_entries** - Industry resource tracking (electricity, water, gas consumption)
3. **navigation_routes** - Eco-friendly route planning with carbon impact calculation
4. **environmental_issues** - Citizen-reported environmental problems with status tracking
5. **waste_classifications** - AI-powered waste categorization results
6. **irrigation_schedules** - Smart water management for agriculture

**Data Relationships:**
- All feature tables reference users via foreign key relationships
- UUID-based primary keys for scalability
- Timestamp tracking for temporal analysis
- JSONB fields for flexible metadata storage

### AI/ML Integration

**Google Gemini AI:**
- Resource optimization suggestions based on consumption patterns
- Environmental issue analysis and recommendations
- Conversational AI copilot for sustainability guidance
- Model: gemini-2.5-flash for fast, cost-effective responses

**OpenAI Integration:**
- Structured for waste classification and image analysis
- Natural language processing for citizen reports
- Advanced analytics and prediction capabilities

**AI Features:**
1. Resource consumption analysis and optimization recommendations
2. Waste classification from uploaded images
3. Irrigation scheduling based on crop type and soil conditions
4. Eco-friendly route optimization with carbon impact
5. Environmental issue categorization and priority assignment

### Gamification System

**Reward Mechanics:**
- Eco-Points earned for sustainable actions
- Level progression system (starts at level 1)
- Credits awarded for resource tracking and waste classification
- Transportation mode rewards (walking/cycling: 20 credits, public transport: 15 credits, carpooling: 10 credits)

**Social Features:**
- Community leaderboard with top eco-warriors
- Achievement badges (First Report, Eco Warrior, Champion)
- Public environmental issue status tracking

### Authentication & Security

**Current Implementation:**
- Mock user ID for development (`demo-user-123`)
- Session management infrastructure in place
- Prepared for production authentication system
- CORS and credential handling configured

**Planned Security:**
- User registration and login system
- Password hashing with industry standards
- Role-based access control for government vs. citizen features
- API rate limiting and request validation

## External Dependencies

### Third-Party Services

**AI/ML Services:**
- **Google Gemini AI** - Primary AI engine for recommendations and analysis (requires `GEMINI_API_KEY`)
- **OpenAI** - Advanced NLP and vision capabilities (requires `OPENAI_API_KEY`)

**Database:**
- **Neon Serverless PostgreSQL** - Production database hosting
- Connection via `@neondatabase/serverless` driver
- Requires `DATABASE_URL` environment variable

**Maps & Geolocation:**
- Google Maps integration (referenced in design guidelines)
- Used for environmental monitoring map and route planning

### Key NPM Packages

**Core Framework:**
- `react`, `react-dom` - UI framework
- `express` - Backend server
- `vite` - Build tool and dev server
- `drizzle-orm` - Database ORM
- `@tanstack/react-query` - Data fetching and caching

**UI Components:**
- `@radix-ui/*` - Accessible component primitives (20+ packages)
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `class-variance-authority` - Component variant management
- `cmdk` - Command palette component

**Form & Validation:**
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation integration
- `drizzle-zod` - Database schema to Zod conversion

**Development:**
- `typescript` - Type safety
- `tsx` - TypeScript execution
- `esbuild` - Fast bundler for production
- Replit-specific plugins for development environment

**Utilities:**
- `date-fns` - Date manipulation
- `clsx`, `tailwind-merge` - Conditional class names
- `nanoid` - Unique ID generation
- `wouter` - Lightweight routing

### Environment Variables Required

```
DATABASE_URL - PostgreSQL connection string
GEMINI_API_KEY - Google Gemini AI API key
OPENAI_API_KEY - OpenAI API key
NODE_ENV - Environment mode (development/production)
```

### Asset Management

- Static assets stored in `attached_assets/generated_images/`
- Hero images for landing page sections
- Dashboard mockups and environmental imagery
- Vite alias configuration for `@assets` imports