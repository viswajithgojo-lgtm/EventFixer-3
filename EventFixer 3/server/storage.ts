import { type Bus, type InsertBus, type ChatMessage, type InsertChatMessage, buses, chatMessages } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Bus methods
  getBuses(): Promise<Bus[]>;
  getBusById(id: string): Promise<Bus | undefined>;
  updateBus(id: string, bus: Partial<InsertBus>): Promise<Bus | undefined>;
  
  // Chat methods
  getChatMessages(): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  async getBuses(): Promise<Bus[]> {
    return await db.select().from(buses);
  }

  async getBusById(id: string): Promise<Bus | undefined> {
    const [bus] = await db.select().from(buses).where(eq(buses.id, id));
    return bus || undefined;
  }

  async updateBus(id: string, bus: Partial<InsertBus>): Promise<Bus | undefined> {
    // Exclude undefined fields and ensure schedule is properly formatted
    const updateData: any = { lastUpdated: new Date() };
    if (bus.route !== undefined) updateData.route = bus.route;
    if (bus.currentLocation !== undefined) updateData.currentLocation = bus.currentLocation;
    if (bus.status !== undefined) updateData.status = bus.status;
    if (bus.eta !== undefined) updateData.eta = bus.eta;
    if (bus.capacity !== undefined) updateData.capacity = bus.capacity;
    if (bus.schedule !== undefined) updateData.schedule = bus.schedule;

    const [updatedBus] = await db
      .update(buses)
      .set(updateData)
      .where(eq(buses.id, id))
      .returning();
    return updatedBus || undefined;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).orderBy(desc(chatMessages.timestamp));
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return chatMessage;
  }
}

export const storage = new DatabaseStorage();
