import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Bus } from '@shared/schema';
import { cn } from '@/lib/utils';

interface BusInfoPopupProps {
  bus: Bus | null;
  isOpen: boolean;
  onClose: () => void;
  onTrack: (busId: string) => void;
  onAlert: (busId: string) => void;
}

export function BusInfoPopup({ bus, isOpen, onClose, onTrack, onAlert }: BusInfoPopupProps) {
  if (!bus) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'gradient-emerald';
      case 'Delayed': return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'Planned': return 'bg-gradient-to-br from-blue-500 to-purple-600';
      default: return 'gradient-primary';
    }
  };

  return (
    <div 
      className={cn(
        "absolute bottom-24 left-4 right-4 glassmorphism rounded-2xl p-4 shadow-xl z-30 transition-transform duration-300",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
      data-testid="bus-info-popup"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3", getStatusColor(bus.status))}>
            <span className="text-white font-bold text-sm" data-testid="bus-id">
              {bus.id}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground" data-testid="bus-route">
              {bus.route}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="bus-status">
              {bus.status}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          data-testid="close-popup"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground" data-testid="bus-eta">
            {bus.eta ? `${bus.eta} min` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">ETA</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground" data-testid="bus-capacity">
            {bus.capacity}%
          </div>
          <div className="text-xs text-muted-foreground">Capacity</div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          className="flex-1 gradient-primary text-white hover:opacity-90" 
          onClick={() => onTrack(bus.id)}
          data-testid="track-bus"
        >
          Track Bus
        </Button>
        <Button 
          variant="secondary"
          className="flex-1" 
          onClick={() => onAlert(bus.id)}
          data-testid="set-alert"
        >
          Set Alert
        </Button>
      </div>
    </div>
  );
}
