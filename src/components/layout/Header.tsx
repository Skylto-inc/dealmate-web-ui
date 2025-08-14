import { ShoppingBag } from 'lucide-react';
import UserProfile from '@/components/auth/UserProfile';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 safe-area-inset-top">
      <div className="flex items-center gap-2 xs:gap-3">
        <ShoppingBag className="h-7 w-7 xs:h-8 xs:w-8 sm:h-9 sm:w-9 text-primary flex-shrink-0" />
        <h1 className="text-lg xs:text-xl sm:text-2xl font-headline font-semibold text-primary truncate">
          DealMate
        </h1>
      </div>
      
      {/* Status indicator for mobile */}
      <div className="flex items-center gap-2">
        <div className="hidden xs:flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="hidden sm:inline">Online</span>
        </div>
        <UserProfile />
      </div>
    </header>
  );
}
