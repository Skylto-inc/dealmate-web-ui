import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Heart, ShoppingCart, TrendingDown, Eye, Star } from 'lucide-react';
import { Recommendation } from '@/types/recommendations';
import { cn } from '@/lib/utils';

interface RecommendedProductCardProps extends Recommendation {
  onNotInterested?: () => void;
  onAddToWishlist?: () => void;
  onViewDetails?: () => void;
  onCompare?: () => void;
}

const recommendationIcons = {
  'recently-viewed': Eye,
  'similar-products': Star,
  'price-drop': TrendingDown,
  'category-based': Star,
  'trending': Star,
  'personalized': Star,
  'wishlist-alert': Heart,
};

export default function RecommendedProductCard({
  id,
  imageUrl = "https://placehold.co/300x200.png",
  title,
  currentPrice,
  originalPrice,
  discount,
  platform,
  reason,
  recommendationType,
  metadata,
  onNotInterested,
  onAddToWishlist,
  onViewDetails,
  onCompare,
}: RecommendedProductCardProps) {
  const Icon = recommendationIcons[recommendationType];

  return (
    <div className="group p-2 relative overflow-visible">
      <Card className="neumorphic-card w-full h-full flex flex-col transform-gpu transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:z-10 origin-center hover:-translate-y-1">
        <div className="h-full flex flex-col">
          <CardHeader className="p-0 relative flex-shrink-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={imageUrl}
                alt={title}
                width={300}
                height={200}
                className="w-full h-28 xs:h-32 sm:h-36 md:h-40 lg:h-44 object-cover"
                data-ai-hint="product e-commerce"
                priority
                sizes="(max-width: 374px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Platform Badge */}
              <div className="absolute top-1.5 xs:top-2 right-1.5 xs:right-2">
                <Badge variant="secondary" className="glass-card text-xs xs:text-sm px-1.5 xs:px-2 py-0.5 xs:py-1 font-medium backdrop-blur-md">
                  {platform}
                </Badge>
              </div>
              
              {/* Discount Badge */}
              {discount && (
                <div className="absolute top-1.5 xs:top-2 left-1.5 xs:left-2">
                  <Badge variant="destructive" className="gradient-border text-xs xs:text-sm px-1.5 xs:px-2 py-0.5 xs:py-1 shadow-lg font-bold">
                    {discount} OFF
                  </Badge>
                </div>
              )}

              {/* Price Drop Indicator */}
              {metadata?.priceDrop && (
                <div className="absolute bottom-1.5 xs:bottom-2 left-1.5 xs:left-2">
                  <Badge variant="default" className="bg-green-600 text-white text-xs xs:text-sm px-1.5 xs:px-2 py-0.5 xs:py-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    ₹{metadata.priceDrop} Drop
                  </Badge>
                </div>
              )}

              {/* Not Interested Button */}
              {onNotInterested && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNotInterested();
                  }}
                  className="absolute top-1.5 xs:top-2 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Not interested"
                >
                  <div className="glass-card p-1 rounded-full backdrop-blur-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                </button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
            {/* Recommendation Reason */}
            <div className="flex items-center gap-1.5 text-xs xs:text-sm text-muted-foreground">
              <Icon className="w-3 h-3 xs:w-4 xs:h-4" />
              <span className="line-clamp-1">{reason}</span>
            </div>

            {/* Product Title */}
            <CardTitle className="text-sm xs:text-base sm:text-lg font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200 flex-1">
              {title}
            </CardTitle>
            
            {/* Price Section */}
            <div className="flex items-baseline gap-1.5 xs:gap-2 flex-wrap mt-auto">
              <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-primary">
                {currentPrice}
              </p>
              {originalPrice && (
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground line-through">
                  {originalPrice}
                </p>
              )}
            </div>
            
            {/* Savings Calculation */}
            {originalPrice && currentPrice && (
              <div className="text-xs xs:text-sm text-green-400 font-medium">
                You save: ₹{(parseInt(originalPrice.replace(/[^₹\d]/g, '')) - parseInt(currentPrice.replace(/[^₹\d]/g, ''))).toLocaleString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {onAddToWishlist && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToWishlist();
                  }}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Wishlist
                </Button>
              )}
              {onCompare && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompare();
                  }}
                >
                  Compare
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
