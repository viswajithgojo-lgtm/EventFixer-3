import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your AI travel assistant. I can help you with real-time bus tracking, route planning, traffic updates, and more. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('POST', '/api/ai/query', { query });
      return response.json();
    },
    onMutate: (query) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: query,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
    },
    onSuccess: (data) => {
      // Add AI response
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_ai',
        content: data.text,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Invalidate bus data as AI response might indicate updates
      queryClient.invalidateQueries({ queryKey: ['/api/buses'] });
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    },
  });

  const sendMessage = (query: string) => {
    if (query.trim()) {
      sendMessageMutation.mutate(query.trim());
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
  };
}
