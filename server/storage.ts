import { 
  type User, 
  type UpsertUser,
  type UpdateUserProfile,
  type ResourceEntry,
  type InsertResourceEntry,
  type NavigationRoute,
  type InsertNavigationRoute,
  type EnvironmentalIssue,
  type InsertEnvironmentalIssue,
  type WasteClassification,
  type InsertWasteClassification,
  type IrrigationSchedule,
  type InsertIrrigationSchedule,
  users, 
  resourceEntries, 
  navigationRoutes, 
  environmentalIssues, 
  wasteClassifications, 
  irrigationSchedules
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUserProfile): Promise<User | undefined>;
  updateUserPoints(id: string, points: number): Promise<User | undefined>;
  updateUserLevel(id: string, level: number): Promise<User | undefined>;
  
  // Resource entries
  createResourceEntry(entry: InsertResourceEntry): Promise<ResourceEntry>;
  getResourceEntriesByUser(userId: string): Promise<ResourceEntry[]>;
  
  // Navigation routes
  createNavigationRoute(route: InsertNavigationRoute): Promise<NavigationRoute>;
  getNavigationRoutesByUser(userId: string): Promise<NavigationRoute[]>;
  
  // Environmental issues
  createEnvironmentalIssue(issue: InsertEnvironmentalIssue): Promise<EnvironmentalIssue>;
  getEnvironmentalIssuesByUser(userId: string): Promise<EnvironmentalIssue[]>;
  getAllEnvironmentalIssues(): Promise<EnvironmentalIssue[]>;
  updateIssueStatus(id: string, status: string): Promise<EnvironmentalIssue | undefined>;
  
  // Waste classifications
  createWasteClassification(classification: InsertWasteClassification): Promise<WasteClassification>;
  getWasteClassificationsByUser(userId: string): Promise<WasteClassification[]>;
  
  // Irrigation schedules
  createIrrigationSchedule(schedule: InsertIrrigationSchedule): Promise<IrrigationSchedule>;
  getIrrigationSchedulesByUser(userId: string): Promise<IrrigationSchedule[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resourceEntries: Map<string, ResourceEntry>;
  private navigationRoutes: Map<string, NavigationRoute>;
  private environmentalIssues: Map<string, EnvironmentalIssue>;
  private wasteClassifications: Map<string, WasteClassification>;
  private irrigationSchedules: Map<string, IrrigationSchedule>;

  constructor() {
    this.users = new Map();
    this.resourceEntries = new Map();
    this.navigationRoutes = new Map();
    this.environmentalIssues = new Map();
    this.wasteClassifications = new Map();
    this.irrigationSchedules = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || randomUUID(),
      username: userData.username,
      password: userData.password,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      ecoPoints: 0,
      level: 1,
      carbonFootprint: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? this.users.get(userData.id) : undefined;
    
    const user: User = {
      id: userData.id || randomUUID(),
      username: userData.username,
      password: userData.password,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      ecoPoints: existingUser?.ecoPoints ?? 0,
      level: existingUser?.level ?? 1,
      carbonFootprint: existingUser?.carbonFootprint ?? 0,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(user.id, user);
    return user;
  }

  async updateUserPoints(id: string, points: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    user.ecoPoints += points;
    const newLevel = Math.floor(user.ecoPoints / 500) + 1;
    user.level = newLevel;
    
    this.users.set(id, user);
    return user;
  }

  async updateUserLevel(id: string, level: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    user.level = level;
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: UpdateUserProfile): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.firstName !== undefined) user.firstName = updates.firstName;
    if (updates.lastName !== undefined) user.lastName = updates.lastName;
    user.updatedAt = new Date();
    
    this.users.set(id, user);
    return user;
  }

  // Resource entries
  async createResourceEntry(insertEntry: InsertResourceEntry): Promise<ResourceEntry> {
    const id = randomUUID();
    
    // Calculate credits based on resource efficiency
    const baseCredits = 5;
    const efficiencyBonus = Math.floor(Math.random() * 10);
    const credits = baseCredits + efficiencyBonus;
    
    const entry: ResourceEntry = {
      ...insertEntry,
      id,
      credits,
      date: new Date()
    };
    
    this.resourceEntries.set(id, entry);
    await this.updateUserPoints(insertEntry.userId, credits);
    
    return entry;
  }

  async getResourceEntriesByUser(userId: string): Promise<ResourceEntry[]> {
    return Array.from(this.resourceEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Navigation routes
  async createNavigationRoute(insertRoute: InsertNavigationRoute): Promise<NavigationRoute> {
    const id = randomUUID();
    
    const route: NavigationRoute = {
      ...insertRoute,
      id,
      date: new Date()
    };
    
    this.navigationRoutes.set(id, route);
    await this.updateUserPoints(insertRoute.userId, insertRoute.credits);
    
    return route;
  }

  async getNavigationRoutesByUser(userId: string): Promise<NavigationRoute[]> {
    return Array.from(this.navigationRoutes.values())
      .filter(route => route.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Environmental issues
  async createEnvironmentalIssue(insertIssue: InsertEnvironmentalIssue): Promise<EnvironmentalIssue> {
    const id = randomUUID();
    
    const issue: EnvironmentalIssue = {
      ...insertIssue,
      id,
      status: "pending",
      credits: 10,
      createdAt: new Date(),
      imageUrl: insertIssue.imageUrl ?? null
    };
    
    this.environmentalIssues.set(id, issue);
    await this.updateUserPoints(insertIssue.userId, 10);
    
    return issue;
  }

  async getEnvironmentalIssuesByUser(userId: string): Promise<EnvironmentalIssue[]> {
    return Array.from(this.environmentalIssues.values())
      .filter(issue => issue.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllEnvironmentalIssues(): Promise<EnvironmentalIssue[]> {
    return Array.from(this.environmentalIssues.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateIssueStatus(id: string, status: string): Promise<EnvironmentalIssue | undefined> {
    const issue = this.environmentalIssues.get(id);
    if (!issue) return undefined;
    
    issue.status = status;
    this.environmentalIssues.set(id, issue);
    
    return issue;
  }

  // Waste classifications
  async createWasteClassification(insertClassification: InsertWasteClassification): Promise<WasteClassification> {
    const id = randomUUID();
    
    const classification: WasteClassification = {
      ...insertClassification,
      id,
      createdAt: new Date(),
      imageUrl: insertClassification.imageUrl ?? null
    };
    
    this.wasteClassifications.set(id, classification);
    
    // Award points for classifying waste
    await this.updateUserPoints(insertClassification.userId, 5);
    
    return classification;
  }

  async getWasteClassificationsByUser(userId: string): Promise<WasteClassification[]> {
    return Array.from(this.wasteClassifications.values())
      .filter(classification => classification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Irrigation schedules
  async createIrrigationSchedule(insertSchedule: InsertIrrigationSchedule): Promise<IrrigationSchedule> {
    const id = randomUUID();
    
    const schedule: IrrigationSchedule = {
      ...insertSchedule,
      id,
      createdAt: new Date()
    };
    
    this.irrigationSchedules.set(id, schedule);
    
    return schedule;
  }

  async getIrrigationSchedulesByUser(userId: string): Promise<IrrigationSchedule[]> {
    return Array.from(this.irrigationSchedules.values())
      .filter(schedule => schedule.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPoints(id: string, points: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const newPoints = user.ecoPoints + points;
    const newLevel = Math.floor(newPoints / 500) + 1;
    
    const [updatedUser] = await db.update(users)
      .set({ ecoPoints: newPoints, level: newLevel })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async updateUserLevel(id: string, level: number): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({ level })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }

  async updateUser(id: string, updates: UpdateUserProfile): Promise<User | undefined> {
    const updateData: Partial<User> = {};
    
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.firstName !== undefined) updateData.firstName = updates.firstName;
    if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
    
    const [updatedUser] = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser || undefined;
  }

  // Resource entries
  async createResourceEntry(insertEntry: InsertResourceEntry): Promise<ResourceEntry> {
    const baseCredits = 5;
    const efficiencyBonus = Math.floor(Math.random() * 10);
    const credits = baseCredits + efficiencyBonus;
    
    const [entry] = await db.insert(resourceEntries)
      .values({ ...insertEntry, credits })
      .returning();
    
    await this.updateUserPoints(insertEntry.userId, credits);
    
    return entry;
  }

  async getResourceEntriesByUser(userId: string): Promise<ResourceEntry[]> {
    return await db.select().from(resourceEntries)
      .where(eq(resourceEntries.userId, userId))
      .orderBy(desc(resourceEntries.date));
  }

  // Navigation routes
  async createNavigationRoute(insertRoute: InsertNavigationRoute): Promise<NavigationRoute> {
    const [route] = await db.insert(navigationRoutes)
      .values(insertRoute)
      .returning();
    
    await this.updateUserPoints(insertRoute.userId, insertRoute.credits);
    
    return route;
  }

  async getNavigationRoutesByUser(userId: string): Promise<NavigationRoute[]> {
    return await db.select().from(navigationRoutes)
      .where(eq(navigationRoutes.userId, userId))
      .orderBy(desc(navigationRoutes.date));
  }

  // Environmental issues
  async createEnvironmentalIssue(insertIssue: InsertEnvironmentalIssue): Promise<EnvironmentalIssue> {
    const [issue] = await db.insert(environmentalIssues)
      .values(insertIssue)
      .returning();
    
    await this.updateUserPoints(insertIssue.userId, 10);
    
    return issue;
  }

  async getEnvironmentalIssuesByUser(userId: string): Promise<EnvironmentalIssue[]> {
    return await db.select().from(environmentalIssues)
      .where(eq(environmentalIssues.userId, userId))
      .orderBy(desc(environmentalIssues.createdAt));
  }

  async getAllEnvironmentalIssues(): Promise<EnvironmentalIssue[]> {
    return await db.select().from(environmentalIssues)
      .orderBy(desc(environmentalIssues.createdAt));
  }

  async updateIssueStatus(id: string, status: string): Promise<EnvironmentalIssue | undefined> {
    const [updatedIssue] = await db.update(environmentalIssues)
      .set({ status })
      .where(eq(environmentalIssues.id, id))
      .returning();
    
    return updatedIssue || undefined;
  }

  // Waste classifications
  async createWasteClassification(insertClassification: InsertWasteClassification): Promise<WasteClassification> {
    const [classification] = await db.insert(wasteClassifications)
      .values(insertClassification)
      .returning();
    
    await this.updateUserPoints(insertClassification.userId, 5);
    
    return classification;
  }

  async getWasteClassificationsByUser(userId: string): Promise<WasteClassification[]> {
    return await db.select().from(wasteClassifications)
      .where(eq(wasteClassifications.userId, userId))
      .orderBy(desc(wasteClassifications.createdAt));
  }

  // Irrigation schedules
  async createIrrigationSchedule(insertSchedule: InsertIrrigationSchedule): Promise<IrrigationSchedule> {
    const [schedule] = await db.insert(irrigationSchedules)
      .values(insertSchedule)
      .returning();
    
    return schedule;
  }

  async getIrrigationSchedulesByUser(userId: string): Promise<IrrigationSchedule[]> {
    return await db.select().from(irrigationSchedules)
      .where(eq(irrigationSchedules.userId, userId))
      .orderBy(desc(irrigationSchedules.createdAt));
  }
}

export const storage = new DatabaseStorage();
