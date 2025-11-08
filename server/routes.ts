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
import OpenAI from "openai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  
  //todo: remove mock functionality - mock user ID for development
  const MOCK_USER_ID = "demo-user-123";
  
  // Resource Entries
  app.post("/api/resources", async (req, res) => {
    try {
      const data = insertResourceEntrySchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      
      const entry = await storage.createResourceEntry(data);
      
      // Get AI suggestions using Gemini
      const prompt = `Analyze this resource usage: ${data.resourceType} - ${data.amount} ${data.unit}. Provide 2-3 specific optimization suggestions to reduce consumption and improve efficiency. Be concise and actionable.`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const suggestions = result.text || "Unable to generate suggestions";
      
      res.json({ entry, suggestions });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/resources", async (req, res) => {
    try {
      const entries = await storage.getResourceEntriesByUser(MOCK_USER_ID);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Navigation Routes
  app.post("/api/navigation", async (req, res) => {
    try {
      const data = insertNavigationRouteSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      
      const route = await storage.createNavigationRoute(data);
      res.json(route);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/navigation", async (req, res) => {
    try {
      const routes = await storage.getNavigationRoutesByUser(MOCK_USER_ID);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Environmental Issues
  app.post("/api/issues", async (req, res) => {
    try {
      const data = insertEnvironmentalIssueSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      
      const issue = await storage.createEnvironmentalIssue(data);
      res.json(issue);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/issues", async (req, res) => {
    try {
      const issues = await storage.getEnvironmentalIssuesByUser(MOCK_USER_ID);
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

  // Waste Classification with OpenAI Vision
  app.post("/api/waste/classify", async (req, res) => {
    try {
      const { imageData } = req.body;
      
      // Use OpenAI Vision to classify waste
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analyze this waste item image. Identify the category (e.g., Plastic Bottle, Paper, Glass, Metal Can, Organic Waste, Electronic Waste), determine if it's recyclable (yes/no), and provide a specific recycling or upcycling suggestion. Format: Category: [name], Recyclable: [yes/no], Confidence: [0-100]%, Suggestion: [detailed suggestion]"
              },
              {
                type: "image_url",
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 300
      });

      const result = response.choices[0].message.content || "";
      
      // Parse the response
      const categoryMatch = result.match(/Category:\s*(.+?)(?:,|$)/i);
      const recyclableMatch = result.match(/Recyclable:\s*(yes|no)/i);
      const confidenceMatch = result.match(/Confidence:\s*(\d+)/);
      const suggestionMatch = result.match(/Suggestion:\s*(.+?)$/i);
      
      const category = categoryMatch ? categoryMatch[1].trim() : "Unknown";
      const recyclable = recyclableMatch ? recyclableMatch[1].toLowerCase() === "yes" : false;
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
      const suggestion = suggestionMatch ? suggestionMatch[1].trim() : "Dispose properly in designated bin.";

      const classification = await storage.createWasteClassification({
        userId: MOCK_USER_ID,
        category,
        recyclable: recyclable ? 1 : 0,
        confidence,
        imageUrl: null,
        suggestion
      });

      res.json({ classification, fullAnalysis: result });
    } catch (error: any) {
      console.error("Waste classification error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/waste", async (req, res) => {
    try {
      const classifications = await storage.getWasteClassificationsByUser(MOCK_USER_ID);
      res.json(classifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Irrigation Schedules with Weather Integration
  app.post("/api/irrigation", async (req, res) => {
    try {
      const { cropType, location, soilMoisture } = req.body;
      
      // Use Gemini to generate irrigation recommendations
      const prompt = `Generate irrigation schedule for: Crop: ${cropType}, Location: ${location}, Soil Moisture: ${soilMoisture}. Provide: 1) Recommended water amount in liters, 2) Optimal watering times, 3) Frequency, 4) Weather considerations. Be concise and specific.`;
      
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const recommendation = result.text || "Unable to generate recommendations";
      
      // Extract water amount (simple parsing)
      const waterMatch = recommendation.match(/(\d+(?:\.\d+)?)\s*(?:liters|L)/i);
      const waterAmount = waterMatch ? parseFloat(waterMatch[1]) : 50.0;
      
      const schedule = await storage.createIrrigationSchedule({
        userId: MOCK_USER_ID,
        cropType,
        location,
        soilMoisture,
        weatherForecast: { temp: 25, humidity: 60, precipitation: 10 }, // Mock weather
        recommendation,
        waterAmount
      });

      res.json(schedule);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/irrigation", async (req, res) => {
    try {
      const schedules = await storage.getIrrigationSchedulesByUser(MOCK_USER_ID);
      res.json(schedules);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User stats
  app.get("/api/user/stats", async (req, res) => {
    try {
      //todo: remove mock functionality - Replace with actual user from session
      let user = await storage.getUserByUsername("demo");
      
      if (!user) {
        user = await storage.createUser({
          username: "demo",
          password: "demo123"
        });
      }
      
      const resourceEntries = await storage.getResourceEntriesByUser(MOCK_USER_ID);
      const navigationRoutes = await storage.getNavigationRoutesByUser(MOCK_USER_ID);
      const issues = await storage.getEnvironmentalIssuesByUser(MOCK_USER_ID);
      
      const totalCarbonSaved = navigationRoutes.reduce((sum, route) => sum + (10 - route.carbonEmission), 0);
      
      // Calculate total eco-points from all activities
      const resourceCredits = resourceEntries.reduce((sum, entry) => sum + (entry.credits || 0), 0);
      const navigationCredits = navigationRoutes.reduce((sum, route) => sum + (route.credits || 0), 0);
      const totalEcoPoints = resourceCredits + navigationCredits;
      
      res.json({
        user: {
          ...user,
          ecoPoints: totalEcoPoints
        },
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
        contents: prompt,
      });
      const response = result.text || "Unable to provide assistance";
      
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
