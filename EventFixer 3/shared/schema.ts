import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Bus route data
export const buses = pgTable("buses", {
  id: varchar("id").primaryKey(),
  route: text("route").notNull(),
  currentLocation: text("current_location").notNull(),
  status: text("status").notNull(), // 'On Time', 'Delayed', 'Planned'
  eta: integer("eta"), // minutes, null for scheduled buses
  schedule: jsonb("schedule").$type<Array<{ time: string; stop: string }>>().notNull(),
  capacity: integer("capacity").default(0), // percentage
  lastUpdated: timestamp("last_updated").defaultNow()
});

// AI chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  isUser: integer("is_user").notNull(), // 1 for user, 0 for AI
  timestamp: timestamp("timestamp").defaultNow()
});

export const insertBusSchema = createInsertSchema(buses);
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true
});

export type Bus = typeof buses.$inferSelect;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// AI Query schema for API
export const aiQuerySchema = z.object({
  query: z.string().min(1, "Query cannot be empty")
});

export type AIQuery = z.infer<typeof aiQuerySchema>;
