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
-   `GEMINI_API_KEY` (Google Gemini AI API key) - **CRITICAL for production**
-   `OPENAI_API_KEY` (OpenAI API key)
-   `NODE_ENV` (Environment mode)
-   `GOOGLE_MAPS_API_KEY` (Google Maps Platform API key with Weather API enabled) - **CRITICAL for production**

## Production Deployment

### Required Environment Variables for Published Apps

When deploying to production (published link), the following environment variables **must** be configured in your deployment settings:

#### Critical API Keys (Required)
1. **GEMINI_API_KEY** - Powers all AI features:
   - Resource consumption analysis and suggestions
   - Waste classification with image recognition
   - Irrigation scheduling recommendations
   - Environmental issue analysis

2. **GOOGLE_MAPS_API_KEY** - Powers navigation and weather features:
   - Interactive maps and route calculation
   - Places autocomplete
   - Eco-friendly navigation with carbon comparison
   - Real-time weather data for irrigation scheduling (requires Weather API to be enabled)
   - API endpoint: `https://weather.googleapis.com/v1/currentConditions:lookup`

#### Optional API Keys
- `OPENAI_API_KEY` - For advanced NLP features (currently optional)

### Troubleshooting Production Issues

#### Symptom: AI Features Show Predefined Values

**Problem**: Resource Analyzer, Waste Classifier, or Weather API returning fallback/predefined data instead of real AI-generated content.

**Cause**: Missing API keys in production environment (GEMINI_API_KEY or GOOGLE_MAPS_API_KEY) or Weather API not enabled.

**Solution**:
1. Check deployment logs for warning messages:
   - `⚠️ WARNING: Missing environment variables: GEMINI_API_KEY, GOOGLE_MAPS_API_KEY`
   - `⚠️ Some AI features will fall back to predefined values.`

2. Configure missing environment variables in deployment settings:
   - Navigate to your deployment/published app settings
   - Add the missing API keys as secrets
   - Redeploy the application

3. Verify environment variables are set:
   - Server startup should show: `✅ All required environment variables are configured`

#### Symptom: Resource Analyzer Returns Generic Suggestions

**Problem**: Resource entries are created but AI suggestions are generic or say "AI suggestions currently unavailable."

**Cause**: GEMINI_API_KEY not configured in production.

**Solution**: Add GEMINI_API_KEY to deployment secrets and redeploy.

#### Symptom: Waste Classifier Returns Error

**Problem**: Image upload fails with message "AI waste classification unavailable."

**Cause**: GEMINI_API_KEY not configured in production.

**Solution**: Add GEMINI_API_KEY to deployment secrets and redeploy.

#### Symptom: Weather Data Shows Default Values or 404 Error

**Problem**: Weather API returns hardcoded values (e.g., 25°C, 60% humidity) or 404 error.

**Cause**: Either GOOGLE_MAPS_API_KEY not configured, or Weather API not enabled in Google Cloud Console.

**Solution**:
1. Ensure GOOGLE_MAPS_API_KEY is configured in deployment secrets
2. Enable Weather API in Google Cloud Console:
   - Go to Google Cloud Console (https://console.cloud.google.com/)
   - Navigate to **APIs & Services** > **Library**
   - Search for **"Weather API"**
   - Click **Weather API** and click **Enable**
3. Redeploy the application

### Environment Variable Validation

The server performs automatic validation on startup:
- ✅ Success: All required environment variables are configured
- ⚠️ Warning: Lists missing variables and explains which features will be affected

Check server logs after deployment to confirm all variables are properly set.