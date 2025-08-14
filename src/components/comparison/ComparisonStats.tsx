'use client';

import { useEffect, useState } from 'react';
import { Product, ComparisonStats as StatsType } from '@/types/comparison';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingDown, 
  Star, 
  Award, 
  Zap, 
  Clock,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComparisonStatsProps {
  products: Product[];
}

export function ComparisonStats({ products }: ComparisonStatsProps) {
  const [stats, setStats] = useState<StatsType | null>(null);

  useEffect(() => {
    if (products.length === 0) return;

    const bestPrice = products.reduce((min, product) => 
      product.price < min.price ? product : min
    );
    
    const highestRated = products.reduce((max, product) => 
      product.rating > max.rating ? product : max
    );
    
    const bestValue = products.reduce((best, product) => {
      const valueScore = product.rating / product.price;
      const bestScore = best.rating / best.price;
      return valueScore > bestScore ? product : best;
    });
    
    const biggestDiscount = products.reduce((max, product) => 
      (product.discount || 0) > (max.discount || 0) ? product : max
    );
    
    const fastestDelivery = products.reduce((fastest, product) => {
      if (!product.deliveryTime || !fastest.deliveryTime) return fastest;
      const productDays = parseDeliveryDays(product.deliveryTime);
      const fastestDays = parseDeliveryDays(fastest.deliveryTime);
      return productDays < fastestDays ? product : fastest;
    });

    setStats({
      bestPrice,
      highestRated,
      bestValue,
      biggestDiscount,
      fastestDelivery
    });
  }, [products]);

  const parseDeliveryDays = (deliveryTime: string): number => {
    const match = deliveryTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 999;
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const priceRange = {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  };

  const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  const totalSavings = stats ? (priceRange.max - stats.bestPrice.price) : 0;

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Best Price */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
            <DollarSign className="h-4 w-4" />
            Best Price
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(stats.bestPrice.price)}
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.bestPrice.vendor}
          </div>
          {totalSavings > 0 && (
            <Badge variant="secondary" className="text-xs">
              Save ${totalSavings.toFixed(2)}
            </Badge>
          )}
          <Button 
            size="sm" 
            className="w-full mt-2"
            onClick={() => window.open(stats.bestPrice.url, '_blank')}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Buy Now
          </Button>
        </CardContent>
      </Card>

      {/* Highest Rated */}
      <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            Highest Rated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-yellow-600">
              {stats.highestRated.rating.toFixed(1)}
            </span>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.highestRated.vendor}
          </div>
          <div className="text-sm font-medium">
            {formatPrice(stats.highestRated.price)}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full mt-2"
            onClick={() => window.open(stats.highestRated.url, '_blank')}
          >
            View Details
          </Button>
        </CardContent>
      </Card>

      {/* Best Value */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Award className="h-4 w-4" />
            Best Value
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">
              {stats.bestValue.rating.toFixed(1)}★
            </span>
            <span className="text-sm text-muted-foreground">for</span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(stats.bestValue.price)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.bestValue.vendor}
          </div>
          <Badge variant="secondary" className="text-xs">
            Great balance
          </Badge>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full mt-2"
            onClick={() => window.open(stats.bestValue.url, '_blank')}
          >
            View Details
          </Button>
        </CardContent>
      </Card>

      {/* Biggest Discount */}
      <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700 dark:text-red-400">
            <TrendingDown className="h-4 w-4" />
            Biggest Discount
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-2xl font-bold text-red-600">
            {stats.biggestDiscount.discount || 0}% OFF
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.biggestDiscount.vendor}
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              {formatPrice(stats.biggestDiscount.price)}
            </div>
            {stats.biggestDiscount.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(stats.biggestDiscount.originalPrice)}
              </div>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            className="w-full mt-2"
            onClick={() => window.open(stats.biggestDiscount.url, '_blank')}
          >
            View Deal
          </Button>
        </CardContent>
      </Card>

      {/* Market Summary */}
      <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <Zap className="h-4 w-4" />
            Market Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Price:</span>
              <span className="font-medium">{formatPrice(avgPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Rating:</span>
              <span className="font-medium">{avgRating.toFixed(1)}★</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Range:</span>
              <span className="font-medium text-xs">
                {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground pt-2 border-t">
            {products.length} vendors compared
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
