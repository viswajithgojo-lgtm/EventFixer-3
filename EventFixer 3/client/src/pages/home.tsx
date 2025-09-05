import { useState } from 'react';
import { Link } from 'wouter';
import { useBuses } from '@/hooks/use-bus-data';
import { Search, Bus, Route, Bell, Bot, Check, Clock, Calendar, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const quickActions = [
  { id: 'track-bus', icon: Bus, title: 'Track Bus', description: 'Real-time location', gradient: 'gradient-primary', path: '/map' },
  { id: 'plan-trip', icon: Route, title: 'Plan Trip', description: 'Find best routes', gradient: 'gradient-emerald', path: '/ai' },
  { id: 'notifications', icon: Bell, title: 'Alerts', description: 'Service updates', gradient: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  { id: 'ai-assist', icon: Bot, title: 'AI Assistant', description: 'Smart help', gradient: 'bg-gradient-to-br from-purple-500 to-pink-600', path: '/ai' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: buses, isLoading } = useBuses();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time': return Check;
      case 'Delayed': return Clock;
      case 'Planned': return Calendar;
      default: return Bus;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'text-emerald-600';
      case 'Delayed': return 'text-amber-600';
      case 'Planned': return 'text-blue-600';
      default: return 'text-foreground';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'On Time': return 'gradient-emerald';
      case 'Delayed': return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'Planned': return 'bg-gradient-to-br from-blue-500 to-purple-600';
      default: return 'gradient-primary';
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="pb-24 screen-transition" data-testid="home-screen">
      {/* Hero Section */}
      <div className="gradient-primary text-white px-6 py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="animate-float absolute top-4 right-4 w-8 h-8 rounded-full bg-white"></div>
          <div className="animate-float absolute top-16 left-8 w-4 h-4 rounded-full bg-white" style={{ animationDelay: '1s' }}></div>
          <div className="animate-float absolute bottom-8 right-12 w-6 h-6 rounded-full bg-white" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2" data-testid="greeting">
            {greeting()}
          </h1>
          <div className="flex items-center text-sm opacity-90 mb-6">
            <CloudSun className="w-4 h-4 mr-2" />
            <span data-testid="weather">72°F • Partly Cloudy</span>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Where would you like to go?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl glassmorphism text-white placeholder-white/80 border-0 focus:outline-none focus:ring-2 focus:ring-white/30 bg-transparent"
              data-testid="search-input"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-semibold mb-4 text-deep-sapphire" data-testid="quick-actions-title">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            
            const cardContent = (
              <div 
                className="bg-card border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                data-testid={`quick-action-${action.id}`}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", action.gradient)}>
                  <ActionIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            );
            
            if (action.path) {
              return (
                <Link key={action.id} to={action.path}>
                  {cardContent}
                </Link>
              );
            } else {
              return (
                <div 
                  key={action.id} 
                  onClick={action.id === 'notifications' ? () => alert('Notifications feature coming soon!') : undefined}
                >
                  {cardContent}
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Live Updates */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-deep-sapphire" data-testid="live-updates-title">
            Live Updates
          </h2>
          <div className="flex items-center text-emerald-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-custom mr-2"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-muted mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="w-12 h-8 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {buses?.map((bus) => {
              const StatusIcon = getStatusIcon(bus.status);
              return (
                <Link key={bus.id} href="/map">
                  <div 
                    className="bg-card border border-border rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                    data-testid={`bus-update-${bus.id}`}
                  >
                    <div className="flex items-center">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mr-4", getStatusGradient(bus.status))}>
                        <StatusIcon className="text-white text-lg w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          Bus {bus.id} - {bus.status}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {bus.status === 'Delayed' ? 'Heavy traffic delays' : 
                           bus.status === 'Planned' ? `Departs at ${bus.schedule[0]?.time}` :
                           `Arriving in ${bus.eta} minutes at ${bus.currentLocation}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-sm font-medium", getStatusColor(bus.status))}>
                          {bus.eta ? `${bus.eta} min` : bus.schedule[0]?.time || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {bus.eta ? 'ETA' : 'Scheduled'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
