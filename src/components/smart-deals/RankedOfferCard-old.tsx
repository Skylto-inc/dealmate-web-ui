'use client';

import type { RankedOffer, UserPointsState } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Info, Sparkles, MessageCircleQuestion, Tag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [isExplainDialogOpen, setIsExplainDialogOpen] = useState(false);
  const [currentUserPointsState, setCurrentUserPointsState] = useState<UserPointsState | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserContext = async () => {
        const result = await handleGetUserPointsState();
        if (!result.error && result.data) {
            setCurrentUserPointsState(result.data);
        }
    };
    // fetchUserContext(); 
  }, []);


  const fetchAiExplanation = async () => {
    if (!offer) return;
    setIsExplanationLoading(true);
    setAiExplanation(null);
    const formData = new FormData();
    formData.append('offerDetails', JSON.stringify(offer));
    if (currentUserPointsState) { 
        formData.append('userContext', JSON.stringify(currentUserPointsState));
    }

    const result = await handleExplainDealRank(formData);
    if (result.error) {
      toast({ title: "Explanation Error", description: result.error, variant: "destructive" });
      setAiExplanation("Sorry, I couldn't generate an explanation right now.");
    } else {
      setAiExplanation(result.data?.explanation || "No detailed explanation available from AI.");
    }
    setIsExplanationLoading(false);
  };

  const effectivePrice = offer.effectivePrice;

  return (
    <Card className="overflow-hidden shadow-xl ring-1 ring-border/30 hover:ring-primary/50 transition-all duration-300 group bg-card hover:bg-card/95 neumorphic-card">
      <CardHeader className="p-0 relative">
        {offer.productImageUrl && (
          <Image
            src={offer.productImageUrl}
            alt={offer.productName}
            width={375}
            height={180} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
            data-ai-hint="product e-commerce"
          />
        )}
        <Badge variant="default" className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg text-sm px-3 py-1">
          Score: {offer.compositeScore.toFixed(0)}
        </Badge>
        {offer.tags && offer.tags.length > 0 && (
             <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {offer.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant={tag === 'Best Combo' ? 'destructive' : tag === 'Reward Unlock' ? 'accent' : 'secondary'} className="text-xs shadow-md">
                        {tag === 'Reward Unlock' && <Sparkles className="h-3 w-3 mr-1" />}
                        {tag}
                    </Badge>
                ))}
            </div>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Badge variant="secondary" className="mb-2 text-xs">{offer.platform}</Badge>
        <CardTitle className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">{offer.productName}</CardTitle>
        
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-3xl font-bold text-primary">
            ₹{effectivePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {offer.basePrice > offer.finalPrice && ( 
            <p className="text-md text-muted-foreground line-through">₹{offer.basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          )}
        </div>
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full text-left">
                    <p className="text-xs text-muted-foreground cursor-help flex items-center">
                        Effective price after all discounts & cashback.
                        <Info className="inline h-3 w-3 ml-1" />
                    </p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Base: ₹{offer.basePrice.toFixed(2)} | After Coupon: ₹{offer.finalPrice.toFixed(2)}</p>
                    <p>Minus Cashback: ₹{offer.totalCashbackValue.toFixed(2)} | Minus Card Bonus: ₹{offer.cardBonusValue.toFixed(2)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>


        {offer.achievedPerkDescription && (
          <Badge variant="accent" className="text-sm py-1 px-2.5 shadow-sm">
            <Sparkles className="h-4 w-4 mr-1.5" /> {offer.achievedPerkDescription}
          </Badge>
        )}

        <Accordion type="single" collapsible className="w-full text-sm mt-2">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="text-xs hover:no-underline py-2 text-muted-foreground hover:text-primary transition-colors [&[data-state=open]>svg]:text-primary">
              Show value breakdown & ranking reasons
            </AccordionTrigger>
            <AccordionContent className="space-y-1.5 text-muted-foreground pt-2 text-xs bg-secondary/20 p-3 rounded-md">
              {offer.totalDiscountValue > 0 && <p>Coupon/Direct Discount: <span className="font-medium text-foreground">- ₹{offer.totalDiscountValue.toFixed(2)}</span></p>}
              {offer.totalCashbackValue > 0 && <p>Cashback Value: <span className="font-medium text-foreground">- ₹{offer.totalCashbackValue.toFixed(2)}</span></p>}
              {offer.cardBonusValue > 0 && <p>Card Bonus/Value: <span className="font-medium text-foreground">- ₹{offer.cardBonusValue.toFixed(2)}</span></p>}
              {offer.potentialPerkValue > 0 && <p>Future Perk Value (in score): <span className="font-medium text-foreground">+ ₹{offer.potentialPerkValue.toFixed(2)}</span></p>}
              <hr className="my-1 border-border/50"/>
              <p className="font-semibold text-foreground">Base Price: ₹{offer.basePrice.toFixed(2)}</p>
              <p className="font-semibold text-foreground">Price After Coupon: ₹{offer.finalPrice.toFixed(2)}</p>
              <p className="font-bold text-primary">Effective Price: ₹{effectivePrice.toFixed(2)}</p>
               <hr className="my-1 border-border/50"/>
              <p className="italic text-foreground/90">Ranking Explanation:</p>
              <ul className="list-disc list-inside pl-2 space-y-0.5">
                {offer.rankingExplanation.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-border/30">
        <Dialog open={isExplainDialogOpen} onOpenChange={setIsExplainDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={fetchAiExplanation} disabled={isExplanationLoading} className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px">
              <MessageCircleQuestion className="mr-2 h-4 w-4" />
              {isExplanationLoading ? "Thinking..." : "Why this rank?"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary">AI Deal Rank Explanation</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Here's why DealMate ranked this deal for {offer.productName}:
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-2">
            <div className="py-4 space-y-3 text-sm text-foreground/90">
              {isExplanationLoading && <p className="animate-pulse">Generating explanation...</p>}
              {aiExplanation && <p className="whitespace-pre-wrap">{aiExplanation}</p>}
            </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transform transition-all duration-150 ease-in-out hover:scale-105 active:translate-y-px">
          <a href={offer.productUrl} target="_blank" rel="noopener noreferrer">
            View Deal <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
