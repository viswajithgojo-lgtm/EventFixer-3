import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiQuerySchema } from "@shared/schema";
import { generateAIResponse } from "./ai-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all buses
  app.get('/api/buses', async (req, res) => {
    try {
      const buses = await storage.getBuses();
      res.json(buses);
    } catch (error) {
      console.error('Error fetching buses:', error);
      res.status(500).json({ error: 'Failed to fetch buses' });
    }
  });

  // Get single bus by ID
  app.get('/api/buses/:id', async (req, res) => {
    try {
      const bus = await storage.getBusById(req.params.id);
      if (!bus) {
        return res.status(404).json({ error: 'Bus not found' });
      }
      res.json(bus);
    } catch (error) {
      console.error('Error fetching bus:', error);
      res.status(500).json({ error: 'Failed to fetch bus' });
    }
  });

  // AI Query endpoint with OpenAI integration
  app.post('/api/ai/query', async (req, res) => {
    try {
      const { query } = aiQuerySchema.parse(req.body);
      
      // Store user message
      await storage.addChatMessage({
        content: query,
        isUser: 1
      });

      // Get current bus data for AI context
      const buses = await storage.getBuses();
      
      // Generate AI response using OpenAI
      const responseText = await generateAIResponse({
        buses,
        userQuery: query
      });

      // Store AI response
      await storage.addChatMessage({
        content: responseText,
        isUser: 0
      });

      res.json({ text: responseText });
    } catch (error) {
      console.error('Error processing AI query:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid query format' });
      } else {
        res.status(500).json({ error: 'Failed to process AI query' });
      }
    }
  });

  // Get chat messages
  app.get('/api/chat/messages', async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
