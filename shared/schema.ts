import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  ecoPoints: integer("eco_points").notNull().default(0),
  level: integer("level").notNull().default(1),
  carbonFootprint: real("carbon_footprint").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Industry Resource Tracking
export const resourceEntries = pgTable("resource_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  resourceType: text("resource_type").notNull(), // electricity, water, gas, etc.
  amount: real("amount").notNull(),
  unit: text("unit").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  credits: integer("credits").notNull().default(0),
});

export const insertResourceEntrySchema = createInsertSchema(resourceEntries).omit({
  id: true,
  credits: true,
  date: true,
});

export type InsertResourceEntry = z.infer<typeof insertResourceEntrySchema>;
export type ResourceEntry = typeof resourceEntries.$inferSelect;

// Navigation Routes
export const navigationRoutes = pgTable("navigation_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  startLocation: text("start_location").notNull(),
  endLocation: text("end_location").notNull(),
  transportMode: text("transport_mode").notNull(), // walk, cycle, bus, carpool, car, metro
  distance: real("distance").notNull(), // in km
  carbonEmission: real("carbon_emission").notNull(), // in kg CO2
  credits: integer("credits").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertNavigationRouteSchema = createInsertSchema(navigationRoutes).omit({
  id: true,
  date: true,
});

export type InsertNavigationRoute = z.infer<typeof insertNavigationRouteSchema>;
export type NavigationRoute = typeof navigationRoutes.$inferSelect;

// Environmental Issues
export const environmentalIssues = pgTable("environmental_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("pending"), // pending, in-progress, resolved
  credits: integer("credits").notNull().default(10),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEnvironmentalIssueSchema = createInsertSchema(environmentalIssues).omit({
  id: true,
  status: true,
  credits: true,
  createdAt: true,
});

export type InsertEnvironmentalIssue = z.infer<typeof insertEnvironmentalIssueSchema>;
export type EnvironmentalIssue = typeof environmentalIssues.$inferSelect;

// Waste Classifications
export const wasteClassifications = pgTable("waste_classifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  recyclable: integer("recyclable").notNull(), // 1 or 0 as boolean
  confidence: real("confidence").notNull(),
  imageUrl: text("image_url"),
  suggestion: text("suggestion").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWasteClassificationSchema = createInsertSchema(wasteClassifications).omit({
  id: true,
  createdAt: true,
});

export type InsertWasteClassification = z.infer<typeof insertWasteClassificationSchema>;
export type WasteClassification = typeof wasteClassifications.$inferSelect;

// Irrigation Schedules
export const irrigationSchedules = pgTable("irrigation_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cropType: text("crop_type").notNull(),
  location: text("location").notNull(),
  soilMoisture: text("soil_moisture").notNull(), // dry, moist, wet
  weatherForecast: jsonb("weather_forecast").notNull(),
  recommendation: text("recommendation").notNull(),
  waterAmount: real("water_amount").notNull(), // in liters
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertIrrigationScheduleSchema = createInsertSchema(irrigationSchedules).omit({
  id: true,
  createdAt: true,
});

export type InsertIrrigationSchedule = z.infer<typeof insertIrrigationScheduleSchema>;
export type IrrigationSchedule = typeof irrigationSchedules.$inferSelect;
