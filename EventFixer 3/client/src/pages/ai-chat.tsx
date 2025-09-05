import { useState, useEffect, useRef } from 'react';
import { useAIChat } from '@/hooks/use-ai-chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Mic, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const quickSuggestions = [
  'Fastest route',
  'Traffic updates',
  'Bus schedule',
];

export default function AIChatPage() {
  const [inputValue, setInputValue] = useState('');
  const { messages, isTyping, sendMessage, isLoading } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30 pb-24" data-testid="ai-chat-screen">
      {/* AI Header */}
      <div className="gradient-primary text-white px-6 py-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full glassmorphism flex items-center justify-center mr-4 animate-pulse-custom">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold" data-testid="ai-title">AI Travel Assistant</h1>
            <p className="text-sm opacity-90">How can I help you today?</p>
          </div>
        </div>
        
        {/* Quick Suggestions */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              size="sm"
              className="glassmorphism px-4 py-2 rounded-full text-sm whitespace-nowrap hover:bg-white/20 transition-colors text-white border-0"
              onClick={() => handleQuickSuggestion(suggestion)}
              data-testid={`suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4" data-testid="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            {message.isUser ? (
              <div className="flex items-start justify-end">
                <div className="flex-1 text-right">
                  <div className="gradient-primary text-white rounded-2xl rounded-tr-md p-4 shadow-sm inline-block max-w-xs">
                    <p>{message.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 mr-1">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center ml-3 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center mr-3 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-md p-4 shadow-sm">
                    <div 
                      className="text-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br>')
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 ml-1">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="ml-11">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="px-6 pb-6 pt-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me anything about your journey..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 bg-card border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder-muted-foreground min-h-[48px] max-h-[120px]"
              rows={1}
              data-testid="chat-input"
            />
            <Button 
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => toast({ title: "Voice Input", description: "Voice input feature coming soon!" })}
              data-testid="voice-input"
            >
              <Mic className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <Button 
            className="gradient-primary text-white p-3 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            data-testid="send-message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
