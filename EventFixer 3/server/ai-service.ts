import OpenAI from "openai";
import type { Bus } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIContext {
  buses: Bus[];
  userQuery: string;
}

export async function generateAIResponse(context: AIContext): Promise<string> {
  try {
    const { buses, userQuery } = context;
    
    // Prepare bus data for AI context
    const busInfo = buses.map(bus => ({
      id: bus.id,
      route: bus.route,
      status: bus.status,
      currentLocation: bus.currentLocation,
      eta: bus.eta,
      capacity: bus.capacity
    }));

    const systemPrompt = `You are a helpful AI travel assistant for a luxury bus tracking application. You have access to real-time bus data and can help users with:

- Real-time bus tracking and locations
- Route planning and recommendations
- Traffic updates and delays
- Schedule information
- Capacity and crowding information

Current bus data: ${JSON.stringify(busInfo, null, 2)}

Guidelines:
- Be conversational and helpful
- Provide specific, actionable information when possible
- Use emojis sparingly and only when they enhance the message
- If asked about buses not in the data, explain what information is available
- Format responses in a mobile-friendly way with clear sections
- Keep responses concise but informative
- Always prioritize user safety and accurate travel information`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request right now. Please try again.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to keyword-based responses if OpenAI fails
    return generateFallbackResponse(context);
  }
}

function generateFallbackResponse(context: AIContext): string {
  const { buses, userQuery } = context;
  const lowerCaseQuery = userQuery.toLowerCase();

  if (lowerCaseQuery.includes('fastest') || lowerCaseQuery.includes('quick')) {
    const onTimeBuses = buses.filter(bus => bus.status === 'On Time');
    if (onTimeBuses.length > 0) {
      const fastestBus = onTimeBuses.sort((a, b) => (a.eta || 999) - (b.eta || 999))[0];
      return `The fastest route is currently **${fastestBus.route}** (Bus ${fastestBus.id}). It's ${fastestBus.status.toLowerCase()} with an ETA of ${fastestBus.eta} minutes. The bus is currently at ${fastestBus.currentLocation}.`;
    } else {
      return 'All buses are currently experiencing delays. Please check the live updates for the latest information.';
    }
  } else if (lowerCaseQuery.includes('traffic') || lowerCaseQuery.includes('delay')) {
    const delayedBuses = buses.filter(bus => bus.status === 'Delayed');
    if (delayedBuses.length > 0) {
      return `There are currently ${delayedBuses.length} bus(es) experiencing delays: ${delayedBuses.map(bus => `Bus ${bus.id} (${bus.route})`).join(', ')}. Average delay is 5 minutes due to heavy traffic.`;
    } else {
      return 'Great news! All buses are currently running on time with no major traffic delays reported.';
    }
  } else if (lowerCaseQuery.includes('schedule') || lowerCaseQuery.includes('time')) {
    return 'Here are the current schedules for all active routes:\n\n**Bus 38 - Downtown Express**: Departing every 15 minutes\n**Bus 14 - Mission to Bay**: Departing every 20 minutes\n**Bus 22 - Castro Circuit**: Departing hourly starting at 1:30 PM';
  } else if (lowerCaseQuery.includes('capacity') || lowerCaseQuery.includes('crowded')) {
    const activeBuses = buses.filter(bus => bus.capacity && bus.capacity > 0);
    if (activeBuses.length > 0) {
      const capacityInfo = activeBuses.map(bus => `Bus ${bus.id}: ${bus.capacity}% full`).join('\n');
      return `Current bus capacity levels:\n\n${capacityInfo}`;
    } else {
      return 'Capacity information is not available for any buses at the moment.';
    }
  } else {
    return "I'm here to help with your travel needs! I can assist with real-time bus tracking, route planning, traffic updates, schedules, and capacity information. What would you like to know?";
  }
}