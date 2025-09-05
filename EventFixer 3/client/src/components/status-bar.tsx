import { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div 
      className="flex justify-between items-center px-6 py-3 text-pearl"
      style={{ background: 'var(--deep-sapphire)' }}
      data-testid="status-bar"
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold" data-testid="current-time">
          {timeString}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Signal className="h-4 w-4" data-testid="signal-icon" />
        <Wifi className="h-4 w-4" data-testid="wifi-icon" />
        <Battery className="h-4 w-4" data-testid="battery-icon" />
      </div>
    </div>
  );
}
