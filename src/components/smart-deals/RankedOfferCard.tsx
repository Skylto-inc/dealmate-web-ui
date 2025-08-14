'use client';

import type { RankedOffer, UserPointsState } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { handleExplainDealRank, handleGetUserPointsState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RankedOfferCardProps {
  offer: RankedOffer;
}

export default function RankedOfferCard({ offer }: RankedOfferCardProps) {
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserPointsState | null>(null);
  const { toast } = useToast();

  const effectivePrice = offer.effectivePrice;

  useEffect(() => {
    const loadUserState = async () => {
      const result = await handleGetUserPointsState();
      if (!result.error && result.data) {
        setUserState(result.data);
      }
    };
    loadUserState();
  }, []);

  const handleGetExplanation = async () => {
    if (aiExplanation) {
      setAiExplanation(null);
      return;
    }

    if (!userState) {
      toast({ title: "Error", description: "User state not loaded", variant: "destructive" });
      return;
    }

    setIsExplanationLoading(true);
    try {
      const formData = new FormData();
      formData.append('offerDetails', JSON.stringify(offer));
      formData.append('userContext', JSON.stringify(userState));
      
      const result = await handleExplainDealRank(formData);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else if (result.data) {
        setAiExplanation(result.data.explanation || 'No explanation available');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to get AI explanation", variant: "destructive" });
    } finally {
      setIsExplanationLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden neumorphic-card hover:shadow-2xl transition-all duration-300 w-full h-full flex flex-col">
      <CardHeader className="p-0 relative">
        {offer.productImageUrl && (
          <Image
            src={offer.productImageUrl}
            alt={offer.productName}
            width={300}
            height={200} 
            className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
            data-ai-hint="product e-commerce"
          />
        )}
        
        {/* Rank Badge - Responsive */}
        <Badge variant="default" className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg text-xs sm:text-sm px-2 py-1">
          #{offer.rank}
        </Badge>
        
        {/* Tags - Mobile Optimized */}
        {offer.tags && offer.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[60%]">
            {offer.tags.slice(0, 1).map(tag => (
              <Badge key={tag} variant={tag === 'Best Combo' ? 'destructive' : tag === 'Reward Unlock' ? 'default' : 'secondary'} className="text-xs shadow-md">
                {tag === 'Reward Unlock' && <Sparkles className="h-3 w-3 mr-1" />}
                <span className="hidden sm:inline">{tag}</span>
                <span className="sm:hidden">{tag.substring(0, 3)}</span>
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        {/* Platform Badge */}
        <Badge variant="secondary" className="text-xs w-fit">{offer.platform}</Badge>
        
        {/* Product Title - Responsive */}
        <CardTitle className="text-sm sm:text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {offer.productName}
        </CardTitle>
        
        {/* Price Section - Mobile Optimized */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
            ₹{effectivePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          {offer.basePrice > offer.finalPrice && ( 
            <p className="text-sm sm:text-md text-muted-foreground line-through">
              ₹{offer.basePrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          )}
        </div>
        
        {/* Effective Price Tooltip - Mobile Friendly */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full text-left">
              <p className="text-xs text-muted-foreground cursor-help flex items-center">
                <span className="hidden sm:inline">Effective price after all discounts & cashback.</span>
                <span className="sm:hidden">After all discounts</span>
                <Info className="inline h-3 w-3 ml-1" />
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Base: ₹{offer.basePrice.toFixed(0)} | After Coupon: ₹{offer.finalPrice.toFixed(0)}</p>
              <p>Cashback: -₹{offer.totalCashbackValue.toFixed(0)} | Card Bonus: -₹{offer.cardBonusValue.toFixed(0)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Achievement Badge */}
        {offer.achievedPerkDescription && (
          <Badge variant="default" className="text-xs py-1 px-2 shadow-sm">
            <Sparkles className="h-3 w-3 mr-1" /> 
            <span className="hidden sm:inline">{offer.achievedPerkDescription}</span>
            <span className="sm:hidden">Perk Unlocked</span>
          </Badge>
        )}

        {/* Savings Summary - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/20 p-2 rounded-md">
          <div className="text-center">
            <div className="font-semibold text-green-400">₹{offer.totalDiscountValue.toFixed(0)}</div>
            <div className="text-muted-foreground">Discount</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-400">₹{(offer.totalCashbackValue + offer.cardBonusValue).toFixed(0)}</div>
            <div className="text-muted-foreground">Cashback</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto">
        <div className="flex gap-2 w-full flex-col sm:flex-row">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            asChild
          >
            <a href={offer.productUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <span className="hidden sm:inline">View Product</span>
              <span className="sm:hidden">View</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
          
          {/* AI Explanation - Desktop Only */}
          <div className="hidden lg:block">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleGetExplanation} disabled={isExplanationLoading}>
                  {isExplanationLoading ? (
                    <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <MessageCircleQuestion className="h-3 w-3" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg">AI Deal Analysis</DialogTitle>
                  <DialogDescription className="text-sm">
                    Why this deal ranked #{offer.rank}
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto text-sm">
                  {aiExplanation ? (
                    <div className="whitespace-pre-wrap">{aiExplanation}</div>
                  ) : (
                    <div className="space-y-2">
                      {offer.rankingExplanation.map((reason, idx) => (
                        <p key={idx} className="text-muted-foreground">• {reason}</p>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
