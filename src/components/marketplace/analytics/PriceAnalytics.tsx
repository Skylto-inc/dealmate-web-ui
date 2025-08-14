'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { marketplaceApi } from '@/lib/marketplace/api';
import { ListingWithSeller } from '@/lib/marketplace/types';

interface PriceAnalyticsProps {
  category: string;
  currentPrice: number;
  originalValue?: number;
}

interface PriceStats {
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  medianPrice: number;
  pricePercentile: number;
  recommendation: 'too_low' | 'competitive' | 'too_high';
  similarListingsCount: number;
}

export default function PriceAnalytics({
  category,
  currentPrice,
  originalValue,
}: PriceAnalyticsProps) {
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category && currentPrice > 0) {
      fetchPriceStats();
    }
  }, [category, currentPrice]);

  const fetchPriceStats = async () => {
    setLoading(true);
    try {
      // Fetch similar listings in the same category
      const listings = await marketplaceApi.getListings({
        category,
        status: 'active',
        limit: 100,
      });

      if (listings.length === 0) {
        setStats(null);
        return;
      }

      // Calculate statistics
      const prices = listings.map(l => Number(l.selling_price));
      prices.sort((a, b) => a - b);

      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      const minPrice = prices[0];
      const maxPrice = prices[prices.length - 1];
      const medianPrice = prices[Math.floor(prices.length / 2)];

      // Calculate percentile of current price
      const belowCount = prices.filter(p => p < currentPrice).length;
      const pricePercentile = (belowCount / prices.length) * 100;

      // Determine recommendation
      let recommendation: 'too_low' | 'competitive' | 'too_high';
      if (pricePercentile < 20) {
        recommendation = 'too_low';
      } else if (pricePercentile > 80) {
        recommendation = 'too_high';
      } else {
        recommendation = 'competitive';
      }

      setStats({
        avgPrice,
        minPrice,
        maxPrice,
        medianPrice,
        pricePercentile,
        recommendation,
        similarListingsCount: listings.length,
      });
    } catch (error) {
      console.error('Failed to fetch price statistics:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'too_low':
        return 'text-blue-600';
      case 'competitive':
        return 'text-green-600';
      case 'too_high':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'too_low':
        return <TrendingDown className="h-4 w-4" />;
      case 'competitive':
        return <Minus className="h-4 w-4" />;
      case 'too_high':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'too_low':
        return 'Your price is below market average. Consider increasing it.';
      case 'competitive':
        return 'Your price is competitive with similar listings.';
      case 'too_high':
        return 'Your price is above market average. Consider lowering it.';
      default:
        return '';
    }
  };

  if (loading || !stats) {
    return null;
  }

  const discountPercentage = originalValue
    ? Math.round(((originalValue - currentPrice) / originalValue) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          Price Analytics
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Based on {stats.similarListingsCount} similar listings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Position */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Price Position</span>
            <span className={getRecommendationColor(stats.recommendation)}>
              {Math.round(stats.pricePercentile)}th percentile
            </span>
          </div>
          <Progress value={stats.pricePercentile} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>${stats.minPrice.toFixed(2)}</span>
            <span>Avg: ${stats.avgPrice.toFixed(2)}</span>
            <span>${stats.maxPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`p-3 rounded-lg bg-muted/50 ${getRecommendationColor(stats.recommendation)}`}>
          <div className="flex items-center gap-2 mb-1">
            {getRecommendationIcon(stats.recommendation)}
            <span className="font-medium text-sm">
              {stats.recommendation === 'too_low' && 'Below Market'}
              {stats.recommendation === 'competitive' && 'Competitive'}
              {stats.recommendation === 'too_high' && 'Above Market'}
            </span>
          </div>
          <p className="text-xs opacity-80">
            {getRecommendationText(stats.recommendation)}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Market Average</span>
            <p className="font-medium">${stats.avgPrice.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Median Price</span>
            <p className="font-medium">${stats.medianPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Discount Info */}
        {originalValue && discountPercentage > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Discount</span>
              <Badge variant="secondary">{discountPercentage}% OFF</Badge>
            </div>
            {discountPercentage > 50 && (
              <p className="text-xs text-green-600 mt-1">
                Great discount! This should attract buyers.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
