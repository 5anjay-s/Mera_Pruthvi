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
import bcrypt from "bcrypt";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const SALT_ROUNDS = 10;

// Simple session-based authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes (username/password)
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { username, password, email, firstName, lastName } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Hash password with bcrypt (NEVER store plain text passwords!)
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        ecoPoints: 0,
        level: 1,
        carbonFootprint: 0,
      });
      
      // Set session
      (req.session as any).userId = user.id;
      res.json({ user: { ...user, password: undefined } }); // Never send password to client
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.message?.includes('unique')) {
        res.status(400).json({ message: "Username already exists" });
      } else {
        res.status(500).json({ message: "Failed to create account" });
      }
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Compare password with bcrypt hash
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      (req.session as any).userId = user.id;
      res.json({ user: { ...user, password: undefined } }); // Never send password to client
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  app.get('/api/auth/user', requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      res.json({ ...user, password: undefined }); // Never send password to client
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Resource Entries
  app.post("/api/resources", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const data = insertResourceEntrySchema.parse({
        ...req.body,
        userId
      });
      
      const entry = await storage.createResourceEntry(data);
      
      // Calculate rating based on industry benchmarks
      const benchmarks: Record<string, { good: number; normal: number; bad: number; unit: string }> = {
        electricity: { good: 50, normal: 100, bad: 200, unit: "kWh" },
        water: { good: 100, normal: 200, bad: 400, unit: "L" },
        gas: { good: 20, normal: 50, bad: 100, unit: "m³" }
      };
      
      const benchmark = benchmarks[data.resourceType.toLowerCase()] || benchmarks.electricity;
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
      
      // Get AI suggestions using Gemini with rating context
      const prompt = `Analyze this ${rating.toUpperCase()} rated resource usage: ${data.resourceType} - ${data.amount} ${data.unit} (Industry benchmark: ${benchmark.good} ${benchmark.unit} is good, ${benchmark.normal} ${benchmark.unit} is normal). 
      
      Provide 3-4 specific, actionable enhancement points to improve this ${rating} rating:
      1. Immediate action to reduce consumption
      2. Long-term strategy for efficiency
      3. Technology or equipment recommendations
      4. Behavioral changes
      
      Be specific, practical, and tailored to the current ${rating} rating level.`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const suggestions = result.response?.text() || "Unable to generate suggestions";
      
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

  app.get("/api/resources", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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
  app.post("/api/navigation", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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

  app.get("/api/navigation", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const routes = await storage.getNavigationRoutesByUser(userId);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Environmental Issues
  app.post("/api/issues", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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

  app.get("/api/issues", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const issues = await storage.getEnvironmentalIssuesByUser(userId);
      res.json(issues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/issues/all", requireAuth, async (req, res) => {
    try {
      const issues = await storage.getAllEnvironmentalIssues();
      res.json(issues);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Waste Classification with Gemini Vision
  app.post("/api/waste/classify", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { imageData } = req.body;
      
      // Use Gemini Vision to classify waste  
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { text: "Analyze this waste item image. Identify the category (e.g., Plastic Bottle, Paper, Glass, Metal Can, Organic Waste, Electronic Waste), determine if it's recyclable (yes/no), and provide a specific recycling or upcycling suggestion. Format: Category: [name], Recyclable: [yes/no], Confidence: [0-100]%, Suggestion: [detailed suggestion]" },
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

      const analysisText = result.response?.text() || "";
      
      // Parse the response
      const categoryMatch = analysisText.match(/Category:\s*(.+?)(?:,|$)/i);
      const recyclableMatch = analysisText.match(/Recyclable:\s*(yes|no)/i);
      const confidenceMatch = analysisText.match(/Confidence:\s*(\d+)/);
      const suggestionMatch = analysisText.match(/Suggestion:\s*(.+?)$/i);
      
      const category = categoryMatch ? categoryMatch[1].trim() : "Unknown";
      const recyclable = recyclableMatch ? recyclableMatch[1].toLowerCase() === "yes" : false;
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
      const suggestion = suggestionMatch ? suggestionMatch[1].trim() : "Dispose properly in designated bin.";

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

  app.get("/api/waste", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const classifications = await storage.getWasteClassificationsByUser(userId);
      res.json(classifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Weather API - Fetch real weather data from Open-Meteo
  app.get("/api/weather", async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Missing required parameters: latitude, longitude" });
      }

      const params = new URLSearchParams({
        latitude: latitude as string,
        longitude: longitude as string,
        current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code",
      });

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?${params}`;
      const response = await fetch(weatherUrl);
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      const current = data.current;

      // Map weather codes to conditions
      const weatherCode = current.weather_code;
      let condition = "Clear";
      let icon = "Sun";
      
      if (weatherCode === 0) {
        condition = "Clear";
        icon = "Sun";
      } else if (weatherCode >= 1 && weatherCode <= 3) {
        condition = "Partly Cloudy";
        icon = "Cloud";
      } else if (weatherCode >= 45 && weatherCode <= 48) {
        condition = "Fog";
        icon = "Cloud";
      } else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99)) {
        condition = "Rain";
        icon = "CloudRain";
      } else if (weatherCode >= 71 && weatherCode <= 77) {
        condition = "Snow";
        icon = "CloudRain";
      }

      res.json({
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        precipitation: current.precipitation,
        windSpeed: current.wind_speed_10m,
        condition,
        icon,
        weatherCode
      });
    } catch (error: any) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Irrigation Schedules with Weather Integration
  app.post("/api/irrigation", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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
      const recommendation = result.response?.text() || "Unable to generate recommendations";
      
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

  app.get("/api/irrigation", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const schedules = await storage.getIrrigationSchedulesByUser(userId);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User stats
  app.get("/api/user/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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
  app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { message } = req.body;
      
      const prompt = `You are an AI sustainability assistant for Mera Pruthvi platform. User asks: "${message}". Provide helpful, actionable advice about environmental sustainability, carbon reduction, waste management, or resource optimization. Be concise (2-3 sentences).`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const response = result.response?.text() || "Unable to provide assistance";
      
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics endpoint
  app.get("/api/analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session.userId;
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

  const httpServer = createServer(app);
  return httpServer;
}
