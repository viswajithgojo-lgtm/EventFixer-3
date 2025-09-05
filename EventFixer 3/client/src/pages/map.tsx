import { useState } from 'react';
import { useBuses } from '@/hooks/use-bus-data';
import { BusInfoPopup } from '@/components/bus-info-popup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Camera, MapPin, Navigation } from 'lucide-react';
import { type Bus } from '@shared/schema';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const { data: buses, isLoading } = useBuses();
  const { toast } = useToast();

  const getBusPosition = (busId: string) => {
    // Mock positions for demonstration
    const positions: Record<string, { top: string; left: string }> = {
      '38': { top: '25%', left: '25%' },
      '14': { top: '50%', left: '50%' },
      '22': { top: '75%', left: '33%' },
    };
    return positions[busId] || { top: '50%', left: '50%' };
  };

  const getBusStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-emerald-500';
      case 'Delayed': return 'bg-amber-500';
      case 'Planned': return 'bg-blue-500';
      default: return 'bg-primary';
    }
  };

  const handleBusMarkerClick = (bus: Bus) => {
    setSelectedBus(bus);
  };

  const handleTrackBus = (busId: string) => {
    toast({
      title: "Tracking Started",
      description: `Now tracking Bus ${busId}. You'll receive real-time updates.`,
    });
    setSelectedBus(null);
  };

  const handleSetAlert = (busId: string) => {
    toast({
      title: "Alert Set",
      description: `You'll be notified when Bus ${busId} arrives at your stop.`,
    });
    setSelectedBus(null);
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden pb-24" data-testid="map-screen">
      {/* Map Overlay Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="glassmorphism rounded-2xl p-4 shadow-lg">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder-muted-foreground focus:ring-0"
              data-testid="map-search"
            />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => toast({ title: "Map Filters", description: "Filter options coming soon!" })}
              data-testid="map-filters"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bus Markers */}
      {buses?.map((bus) => {
        const position = getBusPosition(bus.id);
        const statusColor = getBusStatusColor(bus.status);
        
        return (
          <div
            key={bus.id}
            className="absolute bus-marker cursor-pointer z-10"
            style={{ top: position.top, left: position.left }}
            onClick={() => handleBusMarkerClick(bus)}
            data-testid={`bus-marker-${bus.id}`}
          >
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <span className="text-white font-bold text-sm">{bus.id}</span>
            </div>
            <div className={cn("absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white animate-pulse-custom", statusColor)}></div>
          </div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute bottom-32 right-4 flex flex-col space-y-3 z-20">
        <Button
          size="lg"
          className="w-14 h-14 glassmorphism rounded-full shadow-lg hover:scale-105 transition-transform bg-transparent border-0"
          onClick={() => toast({ title: "AR Mode", description: "Augmented Reality feature coming soon!" })}
          data-testid="toggle-ar"
        >
          <Camera className="w-6 h-6 text-primary" />
        </Button>
        
        <Button
          size="lg"
          className="w-14 h-14 glassmorphism rounded-full shadow-lg hover:scale-105 transition-transform bg-transparent border-0"
          onClick={() => toast({ title: "Location", description: "Centering map on your location..." })}
          data-testid="center-map"
        >
          <Navigation className="w-6 h-6 text-primary" />
        </Button>
        
        <Button
          size="lg"
          className="w-14 h-14 glassmorphism rounded-full shadow-lg hover:scale-105 transition-transform bg-transparent border-0"
          onClick={() => toast({ title: "Traffic", description: "Traffic layer toggled" })}
          data-testid="toggle-traffic"
        >
          <MapPin className="w-6 h-6 text-primary" />
        </Button>
      </div>

      {/* Bus Info Popup */}
      <BusInfoPopup
        bus={selectedBus}
        isOpen={!!selectedBus}
        onClose={() => setSelectedBus(null)}
        onTrack={handleTrackBus}
        onAlert={handleSetAlert}
      />

      {/* Loading overlay for buses */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm z-30">
          <div className="text-center text-white">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-custom">
              <Search className="w-8 h-8" />
            </div>
            <p className="font-medium">Loading bus locations...</p>
          </div>
        </div>
      )}
    </div>
  );
}
