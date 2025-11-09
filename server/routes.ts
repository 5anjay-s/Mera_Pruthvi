import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertResourceEntrySchema,
  insertNavigationRouteSchema,
  insertEnvironmentalIssueSchema,
  insertWasteClassificationSchema,
  insertIrrigationScheduleSchema
} from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Helper function to check if Gemini API is available
function isGeminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

// Demo user ID for simplified access without authentication
const DEMO_USER_ID = "demo-user-123";

// Ensure demo user exists in database
async function ensureDemoUser() {
  try {
    const existingUser = await storage.getUser(DEMO_USER_ID);
    if (!existingUser) {
      console.log("Creating demo user...");
      await storage.createUser({
        id: DEMO_USER_ID,
        username: "demo",
        password: "",
        email: "demo@merapruthvi.com",
        firstName: "Demo",
        lastName: "User",
        ecoPoints: 0,
        level: 1,
        carbonFootprint: 0,
      });
      console.log("Demo user created successfully");
    }
  } catch (error) {
    console.error("Error ensuring demo user:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure demo user exists on startup
  await ensureDemoUser();
  
  // Resource Entries
  app.post("/api/resources", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const { industrySize, ...rest } = req.body;
      
      const data = insertResourceEntrySchema.parse({
        ...rest,
        userId
      });
      
      // Industry size multipliers
      const sizeMultipliers: Record<string, number> = {
        small: 0.5,
        medium: 1.0,
        large: 2.5,
        enterprise: 5.0
      };
      
      const sizeKey = typeof industrySize === 'string' && industrySize in sizeMultipliers ? industrySize : "medium";
      const multiplier = sizeMultipliers[sizeKey];
      
      // Base benchmarks for medium-sized companies
      const baseBenchmarks: Record<string, { good: number; normal: number; bad: number; unit: string }> = {
        electricity: { good: 50, normal: 100, bad: 200, unit: "kWh" },
        water: { good: 100, normal: 200, bad: 400, unit: "L" },
        gas: { good: 20, normal: 50, bad: 100, unit: "m³" }
      };
      
      const baseBenchmark = baseBenchmarks[data.resourceType.toLowerCase()] || baseBenchmarks.electricity;
      
      // Adjust benchmarks based on industry size
      const benchmark = {
        good: baseBenchmark.good * multiplier,
        normal: baseBenchmark.normal * multiplier,
        bad: baseBenchmark.bad * multiplier,
        unit: baseBenchmark.unit
      };
      
      let rating = "Normal";
      let ratingColor = "yellow";
      
      if (data.amount <= benchmark.good) {
        rating = "Good";
        ratingColor = "green";
      } else if (data.amount <= benchmark.normal) {
        rating = "Normal";
        ratingColor = "yellow";
      } else if (data.amount <= benchmark.bad) {
        rating = "Bad";
        ratingColor = "orange";
      } else {
        rating = "Worst";
        ratingColor = "red";
      }
      
      const entry = await storage.createResourceEntry(data);
      
      // Get AI suggestions using Gemini with rating context and industry size
      let suggestions = "AI suggestions currently unavailable. Please configure GEMINI_API_KEY.";
      
      if (!isGeminiAvailable()) {
        console.warn("⚠️  GEMINI_API_KEY not configured - using fallback suggestions");
      } else {
        try {
          const sizeName = sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1);
          const prompt = `Analyze this ${rating.toUpperCase()} rated resource usage for a ${sizeName} business: ${data.resourceType} - ${data.amount} ${data.unit} (Industry benchmark for ${sizeName}: ${benchmark.good.toFixed(1)} ${benchmark.unit} is good, ${benchmark.normal.toFixed(1)} ${benchmark.unit} is normal). 
          
          Provide 3-4 specific, actionable enhancement points to improve this ${rating} rating:
          1. Immediate action to reduce consumption
          2. Long-term strategy for efficiency
          3. Technology or equipment recommendations
          4. Behavioral changes for a ${sizeName} operation
          
          Be specific, practical, and tailored to the current ${rating} rating level and ${sizeName} business size.`;
          
          const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          });
          suggestions = result.text || "Unable to generate suggestions";
        } catch (error: any) {
          console.error("❌ Gemini AI error:", error.message);
          suggestions = "Unable to generate AI suggestions at this time.";
        }
      }
      
      res.json({ 
        entry, 
        rating: {
          level: rating,
          color: ratingColor,
          benchmark: benchmark,
          percentage: Math.round((data.amount / benchmark.normal) * 100)
        },
        suggestions 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/resources", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const entries = await storage.getResourceEntriesByUser(userId);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Google Maps Directions API
  app.post("/api/navigation/directions", async (req, res) => {
    try {
      const { start, destination, travelMode } = req.body;
      
      if (!start || !destination || !travelMode) {
        return res.status(400).json({ message: "Missing required fields: start, destination, travelMode" });
      }

      const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!googleMapsApiKey) {
        return res.status(500).json({ message: "Google Maps API key not configured" });
      }

      // Map our travel modes to Google's travel modes
      const googleTravelMode = travelMode.toUpperCase();
      
      // Build Google Directions API request
      const params = new URLSearchParams({
        origin: start,
        destination: destination,
        mode: googleTravelMode,
        key: googleMapsApiKey,
      });

      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
      
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.status !== "OK") {
        return res.status(400).json({ 
          message: `Directions API error: ${data.status}`,
          error: data.error_message 
        });
      }

      const route = data.routes[0];
      const leg = route.legs[0];

      // Extract route details
      const polyline = route.overview_polyline.points;
      const distanceMeters = leg.distance.value;
      const durationSeconds = leg.duration.value;
      const steps = leg.steps.map((step: any) => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text,
      }));

      // Calculate carbon emissions based on travel mode
      // walking/bicycling = 0g, transit = 50g/km, driving = 120g/km
      const distanceKm = distanceMeters / 1000;
      let carbonEmissionGrams = 0;
      
      if (travelMode === "TRANSIT") {
        carbonEmissionGrams = distanceKm * 50;
      } else if (travelMode === "DRIVING") {
        carbonEmissionGrams = distanceKm * 120;
      }
      // WALKING and BICYCLING remain 0

      res.json({
        polyline,
        distance: distanceMeters,
        duration: durationSeconds,
        steps,
        carbonEmission: carbonEmissionGrams,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
      });
    } catch (error: any) {
      console.error("Google Directions API error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Navigation Routes
  app.post("/api/navigation", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const data = insertNavigationRouteSchema.parse({
        ...req.body,
        userId
      });
      
      const route = await storage.createNavigationRoute(data);
      res.json(route);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/navigation", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const routes = await storage.getNavigationRoutesByUser(userId);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Environmental Issues
  app.post("/api/issues", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const data = insertEnvironmentalIssueSchema.parse({
        ...req.body,
        userId
      });
      
      const issue = await storage.createEnvironmentalIssue(data);
      res.json(issue);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/issues", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const issues = await storage.getEnvironmentalIssuesByUser(userId);
      res.json(issues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/issues/all", async (req, res) => {
    try {
      const issues = await storage.getAllEnvironmentalIssues();
      res.json(issues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Waste Classification with Gemini Vision
  app.post("/api/waste/classify", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const { imageData } = req.body;
      
      if (!isGeminiAvailable()) {
        console.warn("⚠️  GEMINI_API_KEY not configured - cannot classify waste");
        return res.status(500).json({ 
          message: "AI waste classification unavailable. Please configure GEMINI_API_KEY in deployment settings." 
        });
      }
      
      // Use Gemini Vision to classify waste  
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { 
                text: `Analyze this waste item image carefully and provide a detailed classification.

IMPORTANT: Look at the actual item in the image and identify what it is specifically.

Respond in this exact format:
Category: [specific item name like "Plastic Water Bottle", "Cardboard Box", "Aluminum Can", "Food Waste", "Paper", "Glass Bottle", etc.]
Recyclable: [yes or no]
Confidence: [number from 0-100]%
Suggestion: [specific disposal or recycling instructions for this item]

Be specific about the category - identify the actual item type, not just "waste" or "unknown".` 
              },
              {
                inlineData: {
                  mimeType: imageData.split(';')[0].split(':')[1],
                  data: imageData.split(',')[1]
                }
              }
            ]
          }
        ]
      });

      const analysisText = result.text || "";
      console.log("Gemini Vision Analysis:", analysisText);
      
      // Parse the response with more flexible regex
      const categoryMatch = analysisText.match(/Category:\s*([^\n,]+)/i);
      const recyclableMatch = analysisText.match(/Recyclable:\s*(yes|no)/i);
      const confidenceMatch = analysisText.match(/Confidence:\s*(\d+)/);
      const suggestionMatch = analysisText.match(/Suggestion:\s*(.+?)(?:\n|$)/i);
      
      const category = categoryMatch ? categoryMatch[1].trim() : "Unknown Item";
      const recyclable = recyclableMatch ? recyclableMatch[1].toLowerCase() === "yes" : false;
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;
      const suggestion = suggestionMatch ? suggestionMatch[1].trim() : "Please dispose of this item in the appropriate waste bin.";

      console.log("Parsed values:", { category, recyclable, confidence, suggestion: suggestion.substring(0, 100) });

      const classification = await storage.createWasteClassification({
        userId,
        category,
        recyclable: recyclable ? 1 : 0,
        confidence,
        imageUrl: null,
        suggestion
      });

      res.json({ classification, fullAnalysis: analysisText });
    } catch (error: any) {
      console.error("Waste classification error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/waste", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const classifications = await storage.getWasteClassificationsByUser(userId);
      res.json(classifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Weather API - Fetch real weather data from Google Weather API
  app.get("/api/weather", async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Missing required parameters: latitude, longitude" });
      }

      const googleWeatherApiKey = process.env.WEATHER_API;
      
      if (!googleWeatherApiKey) {
        console.warn("⚠️  WEATHER_API key not configured - cannot fetch weather data");
        return res.status(500).json({ message: "Weather API unavailable. Please configure WEATHER_API in deployment settings." });
      }
      
      // Google Weather API endpoint (using geocoding to get location info)
      const weatherUrl = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${googleWeatherApiKey}&location.latitude=${latitude}&location.longitude=${longitude}`;
      
      const response = await fetch(weatherUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Weather API error:", errorText);
        throw new Error("Failed to fetch weather data from Google Weather API");
      }

      const data = await response.json();
      console.log("Google Weather API response:", JSON.stringify(data, null, 2));

      // Extract weather data from Google Weather API response (correct structure)
      const temperature = data.temperature?.degrees || 25; // Celsius
      const humidity = data.relativeHumidity || 60; // Percentage
      const windSpeed = data.wind?.speed?.value || 0; // km/h
      
      // Google Weather API doesn't provide precipitation last hour in current conditions
      // Use precipitation probability as a proxy
      const precipitationProbability = data.precipitation?.probability?.percent || 0;
      const precipitation = precipitationProbability > 50 ? 5 : 0; // Estimate mm based on probability
      
      // Map Google Weather condition types to our conditions
      const weatherType = data.weatherCondition?.type || "CLEAR";
      const weatherDescription = data.weatherCondition?.description?.text || "";
      let condition = "Clear";
      let icon = "Sun";
      
      if (weatherType === "CLEAR" || weatherType === "SUNNY") {
        condition = "Clear";
        icon = "Sun";
      } else if (weatherType === "CLOUDY" || weatherType === "PARTLY_CLOUDY" || weatherType === "OVERCAST") {
        condition = "Partly Cloudy";
        icon = "Cloud";
      } else if (weatherType === "RAINY" || weatherType === "RAIN" || weatherType === "DRIZZLE") {
        condition = "Rain";
        icon = "CloudRain";
      } else if (weatherType === "SNOWY" || weatherType === "SNOW") {
        condition = "Snow";
        icon = "CloudRain";
      } else if (weatherType === "FOGGY" || weatherType === "FOG" || weatherType === "MIST") {
        condition = "Fog";
        icon = "Cloud";
      } else if (weatherType === "THUNDERSTORM" || weatherType === "STORMY") {
        condition = "Thunderstorm";
        icon = "CloudRain";
      }

      res.json({
        temperature,
        humidity,
        precipitation,
        windSpeed,
        condition,
        icon,
        description: weatherDescription || condition
      });
    } catch (error: any) {
      console.error("Google Weather API error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Irrigation Schedules with Weather Integration
  app.post("/api/irrigation", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const { cropType, location, soilMoisture, weatherData } = req.body;
      
      // Build enhanced prompt with real weather data
      let weatherContext = "";
      if (weatherData) {
        weatherContext = `Current Weather: Temperature ${weatherData.temperature}°C, Humidity ${weatherData.humidity}%, Precipitation ${weatherData.precipitation}mm, Wind Speed ${weatherData.windSpeed} km/h, Condition: ${weatherData.condition}. `;
      }
      
      const prompt = `${weatherContext}Generate irrigation schedule for: Crop: ${cropType}, Location: ${location}, Soil Moisture: ${soilMoisture}. 
      
      Based on the weather conditions, provide:
      1) Should watering happen today? (Consider if rain is present or expected)
      2) Recommended water amount in liters
      3) Optimal watering times
      4) Frequency
      5) Specific weather-based advice (e.g., "Rain detected - skip watering", "Hot and dry - increase watering")
      
      Be concise, practical, and weather-aware.`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const recommendation = result.text || "Unable to generate recommendations";
      
      // Extract water amount (simple parsing)
      const waterMatch = recommendation.match(/(\d+(?:\.\d+)?)\s*(?:liters|L)/i);
      const waterAmount = waterMatch ? parseFloat(waterMatch[1]) : 50.0;
      
      const schedule = await storage.createIrrigationSchedule({
        userId,
        cropType,
        location,
        soilMoisture,
        weatherForecast: weatherData || { temp: 25, humidity: 60, precipitation: 0 },
        recommendation,
        waterAmount
      });

      res.json(schedule);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/irrigation", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const schedules = await storage.getIrrigationSchedulesByUser(userId);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User stats
  app.get("/api/user/stats", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const resourceEntries = await storage.getResourceEntriesByUser(userId);
      const navigationRoutes = await storage.getNavigationRoutesByUser(userId);
      const issues = await storage.getEnvironmentalIssuesByUser(userId);
      
      const totalCarbonSaved = navigationRoutes.reduce((sum, route) => sum + (10 - route.carbonEmission), 0);
      
      res.json({
        user,
        stats: {
          totalResources: resourceEntries.length,
          totalRoutes: navigationRoutes.length,
          totalIssues: issues.length,
          carbonSaved: Math.max(0, totalCarbonSaved)
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Copilot Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      const prompt = `You are an AI sustainability assistant for Mera Pruthvi platform. User asks: "${message}". Provide helpful, actionable advice about environmental sustainability, carbon reduction, waste management, or resource optimization. Be concise (2-3 sentences).`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const response = result.text || "Unable to provide assistance";
      
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const resourceEntries = await storage.getResourceEntriesByUser(userId);
      const navigationRoutes = await storage.getNavigationRoutesByUser(userId);
      const wasteClassifications = await storage.getWasteClassificationsByUser(userId);
      const irrigationSchedules = await storage.getIrrigationSchedulesByUser(userId);

      // Calculate date range for last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      // Initialize daily data structure for last 30 days
      const dailyData = new Map<string, { points: number; carbonSaved: number; wasteCount: number }>();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];
        dailyData.set(dateStr, { points: 0, carbonSaved: 0, wasteCount: 0 });
      }

      // Aggregate resource entries by date
      resourceEntries.forEach(entry => {
        const dateStr = new Date(entry.date).toISOString().split('T')[0];
        if (dailyData.has(dateStr)) {
          const day = dailyData.get(dateStr)!;
          day.points += entry.credits || 0;
        }
      });

      // Aggregate navigation routes by date
      navigationRoutes.forEach(route => {
        const dateStr = new Date(route.date).toISOString().split('T')[0];
        if (dailyData.has(dateStr)) {
          const day = dailyData.get(dateStr)!;
          day.points += route.credits || 0;
          // Carbon saved = baseline (10kg for car) - actual emission
          day.carbonSaved += Math.max(0, 10 - route.carbonEmission);
        }
      });

      // Add waste classification credits and count
      wasteClassifications.forEach(classification => {
        const dateStr = new Date(classification.createdAt).toISOString().split('T')[0];
        if (dailyData.has(dateStr)) {
          const day = dailyData.get(dateStr)!;
          day.points += 5; // 5 points per waste classification
          day.wasteCount += 1;
        }
      });

      // Convert to cumulative arrays
      let cumulativePoints = 0;
      let cumulativeCarbonSaved = 0;
      const ecoPointsHistory = Array.from(dailyData.entries()).map(([date, data]) => {
        cumulativePoints += data.points;
        return { date, points: cumulativePoints };
      });

      const carbonSavingsHistory = Array.from(dailyData.entries()).map(([date, data]) => {
        cumulativeCarbonSaved += data.carbonSaved;
        return { date, carbonSaved: parseFloat(cumulativeCarbonSaved.toFixed(2)) };
      });

      // Waste classification history
      let cumulativeWasteCount = 0;
      const wasteClassificationHistory = Array.from(dailyData.entries()).map(([date, data]) => {
        cumulativeWasteCount += data.wasteCount;
        return { date, count: cumulativeWasteCount };
      });

      // Resource breakdown by type
      const resourceMap = new Map<string, { totalAmount: number; count: number }>();
      resourceEntries.forEach(entry => {
        const type = entry.resourceType;
        if (!resourceMap.has(type)) {
          resourceMap.set(type, { totalAmount: 0, count: 0 });
        }
        const resource = resourceMap.get(type)!;
        resource.totalAmount += entry.amount;
        resource.count += 1;
      });

      const resourceBreakdown = Array.from(resourceMap.entries()).map(([resourceType, data]) => ({
        resourceType,
        totalAmount: parseFloat(data.totalAmount.toFixed(2)),
        count: data.count
      }));

      // Activity breakdown
      const activityBreakdown = [
        { category: "Resources", count: resourceEntries.length },
        { category: "Routes", count: navigationRoutes.length },
        { category: "Waste", count: wasteClassifications.length },
        { category: "Irrigation", count: irrigationSchedules.length }
      ];

      res.json({
        ecoPointsHistory,
        carbonSavingsHistory,
        wasteClassificationHistory,
        resourceBreakdown,
        activityBreakdown
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user profile
  app.patch("/api/user/profile", async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const { email, firstName, lastName } = req.body;

      // Validate input
      const { updateUserProfileSchema } = await import("@shared/schema");
      const validatedData = updateUserProfileSchema.parse({ email, firstName, lastName });

      // Get current user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user in database
      const updatedUser = await storage.updateUser(userId, validatedData);

      res.json({ user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
