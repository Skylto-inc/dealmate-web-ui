'use client';

import { Product } from '@/types/comparison';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, ExternalLink, Heart, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const getBestPrice = () => {
    return Math.min(...products.map(p => p.price));
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
    <div className="space-y-4">
      {products.map((product) => {
        const isBestPrice = product.price === getBestPrice();
        
        return (
          <Card 
            key={product.id} 
            className={cn(
              'transition-all duration-200 hover:shadow-lg',
              isBestPrice && 'ring-2 ring-green-500 shadow-green-500/25'
            )}
          >
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="relative flex-shrink-0">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                    loading="lazy"
                  />
                  
                  {/* Best Price Badge */}
                  {isBestPrice && (
                    <Badge className="absolute -top-2 -left-2 bg-green-500 hover:bg-green-600">
                      Best Price
                    </Badge>
                  )}
                  
                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {product.vendor}
                        </Badge>
                        <Badge 
                          variant={product.inStock ? "default" : "secondary"}
                          className={cn(
                            !product.inStock && "text-muted-foreground"
                          )}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist logic
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {product.features.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{product.features.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                      <span className="text-sm font-medium ml-1">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.reviewCount.toLocaleString()} reviews
                    </span>
                    
                    {product.deliveryTime && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {product.deliveryTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col items-end justify-between flex-shrink-0 min-h-32">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-muted-foreground line-through mb-1">
                        {formatPrice(product.originalPrice, product.currency)}
                      </div>
                    )}
                    
                    {product.cashbackRate && product.cashbackRate > 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                        <TrendingUp className="h-3 w-3" />
                        {product.cashbackRate.toFixed(1)}% Cashback
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 w-full max-w-32">
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={!product.availability || !product.inStock}
                      onClick={() => window.open(product.url, '_blank')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(product.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
