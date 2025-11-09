# 🌍 Mera Pruthvi (GaiaMind)

> AI-Powered Sustainability Intelligence Platform for Cities, Organizations, and Citizens

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## 📋 Overview

**Mera Pruthvi** (also known as **GaiaMind**) is an intelligent sustainability platform that helps cities, organizations, and citizens predict, prevent, and reduce environmental impact through real-time AI-powered insights. The platform combines cutting-edge AI technology with environmental monitoring to deliver actionable recommendations for urban heat management, pollution control, waste reduction, carbon tracking, and sustainable transportation.

### 🎯 Core Mission

Empower communities to make data-driven decisions for a sustainable future by providing:
- Real-time environmental monitoring and analytics
- AI-powered recommendations for resource optimization
- Smart waste management with computer vision
- Carbon footprint tracking and reduction strategies
- Eco-friendly navigation with live carbon impact comparison
- Weather-aware irrigation scheduling for agriculture

## ✨ Key Features

### 🤖 AI-Powered Resource Monitor
- Track electricity, water, and fuel consumption
- Real-time AI analysis using **Google Gemini 2.5 Flash**
- Smart recommendations for reducing resource usage
- Color-coded efficiency ratings (Excellent, Good, Fair, Poor)
- Earn Eco-Points for sustainable practices

### ♻️ Smart Waste Classifier
- Upload waste images for instant AI classification
- Computer vision powered by **Google Gemini Vision**
- Identifies waste type, disposal method, and environmental impact
- Recycling tips and best practices
- Impact tracking (CO₂ savings, recyclability percentages)

### 🗺️ Eco-Friendly Navigation
- Interactive route planning with **Google Maps Platform**
- Real-time carbon footprint comparison across transport modes
- Multiple route options: Walking, Cycling, Public Transit, Carpooling, Solo Driving
- Live carbon emissions calculation per journey
- Reward system for choosing sustainable transport

### 🌦️ Weather-Aware Irrigation Scheduler
- Smart irrigation recommendations based on real-time weather
- Integration with **Google Weather API**
- Crop-specific water calculations
- Soil moisture level tracking
- Location-based weather forecasting
- Water conservation insights

### 📊 Dynamic Analytics Dashboard
- Real-time eco-points tracking and trends
- Resource consumption analytics with interactive charts
- Community leaderboards and rankings
- Achievement badges and milestones
- Historical data visualization

### 👤 User Profile & Gamification
- Personalized eco-profile with editable details
- Level progression system based on sustainable actions
- Eco-Points earning through platform activities
- Impact summary showing personal environmental contribution

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Wouter** for lightweight routing
- **TanStack Query** for state management and data fetching
- **Shadcn UI** with Radix UI primitives
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** (Neon Serverless) for data persistence

### AI & External Services
- **Google Gemini AI** (`gemini-2.5-flash`) - Primary AI engine for:
  - Resource consumption analysis
  - Waste classification with image recognition
  - Irrigation recommendations
  - Environmental insights
- **Google Maps Platform** - Interactive maps and navigation
- **Google Weather API** - Real-time weather data
- **OpenAI** (Optional) - Advanced NLP capabilities

### Key Libraries
- `@google/genai` - Google Gemini AI integration
- `@googlemaps/js-api-loader` - Google Maps integration
- `drizzle-orm` & `drizzle-zod` - Database ORM and validation
- `react-hook-form` & `zod` - Form handling and validation
- `lucide-react` - Icon library

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** package manager
- **PostgreSQL** database (or use Neon Serverless)
- **Google Gemini API Key** ([Get it here](https://ai.google.dev/))
- **Google Maps API Key** with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Directions API
  - Weather API

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mera-pruthvi.git
   cd mera-pruthvi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # Required API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   
   # Optional
   OPENAI_API_KEY=your_openai_api_key_here
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5000`

## 🔑 API Keys Setup Guide

### Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy and add to `.env` as `GEMINI_API_KEY`

**Free tier includes**: 15 requests per minute, 1 million tokens per minute

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - **Weather API** (Important!)
4. Go to "Credentials" and create an API key
5. Copy and add to `.env` as `GOOGLE_MAPS_API_KEY`

**Important**: Make sure to enable **Weather API** in your Google Cloud Console for irrigation features to work.

### OpenAI API Key (Optional)

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and add to `.env` as `OPENAI_API_KEY`

## 📖 Usage Guide

### For Citizens

1. **Track Your Impact**
   - Log daily resource consumption (electricity, water, fuel)
   - Upload waste images for smart classification
   - View your eco-profile and accumulated Eco-Points

2. **Plan Sustainable Journeys**
   - Use Eco-Navigation to compare carbon footprints
   - Choose greener transport options
   - Earn credits for sustainable choices

3. **Optimize Resource Use**
   - Get AI-powered recommendations
   - Track consumption trends
   - Improve efficiency ratings

### For Farmers/Gardeners

1. **Smart Irrigation**
   - Select crop type and location
   - Get weather-aware watering recommendations
   - Track irrigation history
   - Save water based on real-time conditions

### For Organizations

1. **Monitor Environmental Impact**
   - Track organizational resource usage
   - View analytics and trends
   - Get AI recommendations for optimization
   - Monitor waste management effectiveness

## 🌐 Deployment

### Deploy to Production

This application is ready to deploy to platforms like:
- **Replit** (Recommended for ease of use)
- **Vercel**
- **Railway**
- **Render**
- **Heroku**

### Important: Production Environment Variables

When deploying, ensure these environment variables are set:

**Critical (Required):**
- `GEMINI_API_KEY` - Powers all AI features
- `GOOGLE_MAPS_API_KEY` - Powers navigation and weather features
- `DATABASE_URL` - PostgreSQL connection string

**Optional:**
- `OPENAI_API_KEY` - For advanced NLP features
- `SESSION_SECRET` - For session management
- `NODE_ENV` - Set to `production`

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run (`npm run db:push`)
- [ ] Weather API enabled in Google Cloud Console
- [ ] Maps APIs enabled (Maps JavaScript, Places, Directions, Weather)
- [ ] API keys have proper restrictions/quotas set
- [ ] Build command: `npm run build` (if applicable)
- [ ] Start command: `npm run dev` or `npm start`

## 🔧 Troubleshooting

### Weather API Returns 404 Error

**Problem**: Weather data shows default values or API returns 404.

**Solution**:
1. Ensure `GOOGLE_MAPS_API_KEY` is set in environment variables
2. Enable **Weather API** in Google Cloud Console:
   - Go to Google Cloud Console
   - Navigate to **APIs & Services** > **Library**
   - Search for "Weather API"
   - Click **Enable**
3. Restart the application

### AI Features Show Generic Data

**Problem**: Resource analyzer or waste classifier returns predefined values.

**Solution**:
1. Verify `GEMINI_API_KEY` is correctly set
2. Check API key has sufficient quota
3. Review server logs for API errors
4. Restart the application after adding the key

### Database Connection Errors

**Problem**: Application fails to connect to database.

**Solution**:
1. Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
2. Ensure database server is running
3. Check network connectivity
4. Run `npm run db:push` to sync schema

### Maps Not Loading

**Problem**: Navigation page shows errors or blank map.

**Solution**:
1. Verify `GOOGLE_MAPS_API_KEY` is set
2. Enable required APIs in Google Cloud Console
3. Check browser console for specific errors
4. Ensure API key restrictions allow your domain

## 📝 Environment Variable Validation

The server automatically validates required environment variables on startup:

✅ **Success**: All required environment variables are configured  
⚠️ **Warning**: Lists missing variables and affected features

Check server logs after deployment to confirm proper configuration.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powerful environmental analysis
- Google Maps Platform for navigation capabilities
- OpenAI for advanced NLP features
- Shadcn UI for beautiful component library
- All contributors and users making sustainability accessible

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/mera-pruthvi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/mera-pruthvi/discussions)

---

**Built with 💚 for a sustainable future**

*Mera Pruthvi - Empowering communities to create positive environmental impact through AI and data-driven insights.*
