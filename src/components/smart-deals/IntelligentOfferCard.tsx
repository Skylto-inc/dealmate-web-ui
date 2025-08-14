'use client';

import { RankedOffer } from '@/types/offer-ranking';
import { offerRankingService } from '@/services/offer-ranking';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Info, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Zap,
  Star,
  Layers,
  MapPin
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface IntelligentOfferCardProps {
  offer: RankedOffer;
  rank?: number;
}

export default function IntelligentOfferCard({ offer, rank = 1 }: IntelligentOfferCardProps) {
  const totalSavings = offerRankingService.calculateTotalSavings(
    offer.original_price,
    offer.discounted_price,
    offer.cashback_rate
  );

  const finalPrice = offer.discounted_price || offer.original_price;
  const discountPercent = offer.discount_percentage 
    ? parseFloat(offer.discount_percentage) 
    : ((parseFloat(offer.original_price) - parseFloat(finalPrice)) / parseFloat(offer.original_price) * 100);

  return (
    <Card className="group overflow-hidden neumorphic-card hover:shadow-2xl transition-all duration-300 w-full h-full flex flex-col">
      <CardHeader className="p-0 relative">
        {offer.image_url && (
          <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={offer.image_url}
              alt={offer.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        {/* Rank Badge */}
        <Badge 
          variant="default" 
          className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg text-xs sm:text-sm px-2 py-1"
        >
          #{rank}
        </Badge>
        
        {/* Score Indicator */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white">
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span className="font-bold">{Math.round(offer.ranking_score * 100)}%</span>
          </div>
          <div className="text-[10px] opacity-80">Match Score</div>
        </div>

        {/* Tags */}
        {offer.tags && offer.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {offer.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs shadow-md bg-white/90">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        {/* Merchant & Category */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">{offer.merchant}</Badge>
          {offer.category && (
            <span className="text-xs text-muted-foreground">{offer.category}</span>
          )}
        </div>
        
        {/* Product Title */}
        <CardTitle className="text-sm sm:text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {offer.title}
        </CardTitle>
        
        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              {offerRankingService.formatSavings(finalPrice)}
            </p>
            {offer.discounted_price && (
              <p className="text-sm sm:text-md text-muted-foreground line-through">
                {offerRankingService.formatSavings(offer.original_price)}
              </p>
            )}
            {discountPercent > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercent.toFixed(0)}%
              </Badge>
            )}
          </div>
          
          {/* Total Savings */}
          {totalSavings > 0 && (
            <p className="text-xs text-green-600 font-medium">
              Save {offerRankingService.formatSavings(totalSavings)} total
            </p>
          )}
        </div>

        {/* Ranking Components Visualization */}
        <div className="space-y-2 bg-secondary/20 p-2 rounded-md">
          {/* Top 3 scoring components */}
          {Object.entries(offer.ranking_components)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([component, score]) => (
              <div key={component} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  {getComponentIcon(component)}
                  <span className="capitalize">
                    {component.replace(/_/g, ' ').replace('score', '')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Progress value={score * 100} className="w-12 h-2" />
                  <span className={`font-medium ${offerRankingService.getScoreColor(score)}`}>
                    {offerRankingService.formatPercentage(score)}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Special Features */}
        <div className="flex flex-wrap gap-1">
          {offer.coupon_code && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs cursor-help">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Coupon
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Code: {offer.coupon_code}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {offer.cashback_rate && (
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {offer.cashback_rate}% CB
            </Badge>
          )}
          
          {offer.stacking_opportunities.length > 0 && (
            <Badge variant="default" className="text-xs bg-purple-600">
              <Layers className="h-3 w-3 mr-1" />
              Stackable
            </Badge>
          )}
        </div>

        {/* Urgency Indicator */}
        {offer.ranking_components.urgency_score > 0.6 && (
          <div className="flex items-center gap-1 text-xs text-orange-600">
            <Clock className="h-3 w-3" />
            <span className="font-medium">
              {offerRankingService.getUrgencyMessage(offer.ranking_components.urgency_score)}
            </span>
          </div>
        )}

        {/* Cashback Realization */}
        {offer.cashback_rate && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Info className="h-3 w-3" />
            <span>
              {offerRankingService.getCashbackMessage(
                offer.ranking_components.cashback_realization_score
              )}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <div className="flex gap-2 w-full">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            asChild
          >
            <a href={offer.product_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <span>Shop Now</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
          
          {/* Personalization Score Indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={`p-2 rounded-md ${offerRankingService.getScoreBadgeColor(offer.ranking_components.personal_preference_score)}`}>
                  <Star className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {offerRankingService.formatPercentage(offer.ranking_components.personal_preference_score)} 
                  {' '}match to your preferences
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}

function getComponentIcon(component: string) {
  switch (component) {
    case 'net_savings_score':
      return <TrendingUp className="h-3 w-3 text-green-600" />;
    case 'cashback_realization_score':
      return <Zap className="h-3 w-3 text-blue-600" />;
    case 'urgency_score':
      return <Clock className="h-3 w-3 text-orange-600" />;
    case 'personal_preference_score':
      return <Star className="h-3 w-3 text-purple-600" />;
    case 'stacking_potential_score':
      return <Layers className="h-3 w-3 text-indigo-600" />;
    default:
      return <Info className="h-3 w-3 text-gray-600" />;
  }
}
