import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RecommendedProductCard from './RecommendedProductCard';
import { RecommendationSection as RecommendationSectionType } from '@/types/recommendations';

interface RecommendationSectionProps {
  section: RecommendationSectionType;
  onNotInterested: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  onCompare: (productId: string) => void;
  onViewMore?: () => void;
  loading?: boolean;
}

export default function RecommendationSection({
  section,
  onNotInterested,
  onAddToWishlist,
  onViewDetails,
  onCompare,
  onViewMore,
  loading = false,
}: RecommendationSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`section-${section.type}`);
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  if (loading) {
    return (
      <div className="mb-8 xs:mb-12">
        <div className="flex items-center justify-between mb-4 xs:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{section.icon}</span>
            <h2 className="text-xl xs:text-2xl font-semibold">{section.title}</h2>
          </div>
        </div>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!section.recommendations.length) {
    return null;
  }

  return (
    <div className="mb-8 xs:mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 xs:mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{section.icon}</span>
          <h2 className="text-xl xs:text-2xl font-semibold">{section.title}</h2>
        </div>
        
        {section.showViewMore && onViewMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewMore}
            className="text-primary hover:text-primary/80"
          >
            View More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Products Container */}
      <div className="relative group">
        {/* Scroll Buttons - Desktop Only */}
        <button
          onClick={() => handleScroll('left')}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10",
            "hidden lg:flex items-center justify-center",
            "w-10 h-10 rounded-full glass-card shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "hover:bg-primary/10",
            scrollPosition === 0 && "invisible"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => handleScroll('right')}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10",
            "hidden lg:flex items-center justify-center",
            "w-10 h-10 rounded-full glass-card shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "hover:bg-primary/10"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Products Grid/Scroll Container */}
        <div
          id={`section-${section.type}`}
          className={cn(
            "overflow-x-auto scrollbar-thin",
            "grid grid-flow-col auto-cols-[minmax(280px,1fr)] sm:auto-cols-[minmax(300px,1fr)] lg:auto-cols-[minmax(320px,1fr)]",
            "gap-2 xs:gap-4",
            "pb-6 px-4 pt-2", // Extra padding for hover scaling and better spacing
            "overflow-y-visible", // Allow cards to scale without clipping
            "min-h-[400px]" // Ensure consistent height to prevent layout shifts
          )}
        >
          {section.recommendations.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <RecommendedProductCard
                {...product}
                onNotInterested={() => onNotInterested(product.id)}
                onAddToWishlist={() => onAddToWishlist(product.id)}
                onViewDetails={() => onViewDetails(product.id)}
                onCompare={() => onCompare(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
