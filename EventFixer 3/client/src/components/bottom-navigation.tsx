import { Link, useLocation } from 'wouter';
import { Home, Map, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/map', icon: Map, label: 'Map' },
  { path: '/ai', icon: Bot, label: 'AI' },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <nav className="glassmorphism rounded-2xl shadow-2xl border border-border/50" data-testid="bottom-navigation">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} href={path}>
              <button 
                className={cn(
                  "nav-item flex flex-col items-center p-3 rounded-xl transition-all duration-300",
                  location === path && "active"
                )}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
