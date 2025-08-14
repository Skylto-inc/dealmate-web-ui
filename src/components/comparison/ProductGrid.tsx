'use client';

import { Product } from '@/types/comparison';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ExternalLink, Heart, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const getBestPrice = () => {
    return Math.min(...products.map(p => p.price));
  };

  const handleBuyNow = (product: Product) => {
    window.open(product.url, '_blank');
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        )} 
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const isBestPrice = product.price === getBestPrice();
        
        return (
          <Card 
            key={product.id} 
            className={cn(
              'relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
              isBestPrice && 'ring-2 ring-green-500 shadow-green-500/25'
            )}
          >
            {/* Best Price Badge */}
            {isBestPrice && (
              <Badge className="absolute top-2 left-2 z-10 bg-green-500 hover:bg-green-600">
                Best Price
              </Badge>
            )}

            {/* Discount Badge */}
            {product.discount && product.discount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2 z-10"
              >
                {product.discount}% OFF
              </Badge>
            )}

            <CardContent className="p-0">
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
                
                {/* Wishlist Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to wishlist logic
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                {/* Vendor */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.vendor}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice, product.currency)}
                      </span>
                    )}
                  </div>
                  
                  {product.cashbackRate && product.cashbackRate > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      {product.cashbackRate.toFixed(1)}% Cashback
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{product.features.length - 2} more
                      </Badge>
                    )}
                  </div>

                  {/* Delivery Time */}
                  {product.deliveryTime && (
                    <div className="text-xs text-muted-foreground">
                      Delivery: {product.deliveryTime}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button 
                    className="w-full" 
                    disabled={!product.availability || !product.inStock}
                    onClick={() => handleBuyNow(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {!product.availability 
                      ? 'Unavailable' 
                      : !product.inStock 
                        ? 'Out of Stock' 
                        : 'Buy Now'
                    }
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
