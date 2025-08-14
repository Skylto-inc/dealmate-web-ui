
'use client';

import type { UserCard } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard as CreditCardIcon } from 'lucide-react'; // Renamed to avoid conflict

interface CreditCardListProps {
  cards: UserCard[];
  onRemoveCard: (cardId: string) => void;
  // onEditCard: (card: UserCard) => void; // Future: Pass function to open form with card data
}

export default function CreditCardList({ cards, onRemoveCard }: CreditCardListProps) {
  if (cards.length === 0) {
    return (
      <Alert className="bg-card-foreground/5 border-card-foreground/10">
        <CreditCardIcon className="h-5 w-5 text-primary" />
        <AlertTitle className="text-lg text-foreground">No Cards Yet!</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Add your credit cards to get personalized deal rankings and track rewards.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id} className="bg-card shadow-xl ring-1 ring-border/50 transition-all hover:shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg flex items-center text-primary-foreground">
                        <CreditCardIcon className="mr-3 h-6 w-6 text-primary" />
                        {card.bank} - {card.cardType}
                    </CardTitle>
                    {card.last4Digits && <CardDescription className="text-muted-foreground ml-9">Ending in **** {card.last4Digits}</CardDescription>}
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemoveCard(card.id)} 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transform transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95"
                    aria-label={`Remove ${card.bank} ${card.cardType} card`}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground/90 pt-0">
            {(card.rewards_per_rupee || card.reward_value_inr) ? (
                <div className="flex items-center p-2 bg-secondary/30 rounded-md">
                    <Award className="h-5 w-5 mr-3 text-accent shrink-0" />
                    <div>
                        <span className="font-medium">Rewards: </span>
                        {card.rewards_per_rupee ? `${card.rewards_per_rupee} ${card.reward_value_inr ? 'pts':'value'}/₹ spent. ` : ''}
                        {card.reward_value_inr ? `Value: ₹${card.reward_value_inr.toFixed(2)}/pt.` : ''}
                        {!card.rewards_per_rupee && card.reward_value_inr ? `Direct Value: ₹${card.reward_value_inr.toFixed(2)}/₹ spent (e.g. ${card.reward_value_inr*100}%)` : ''}
                    </div>
                </div>
            ): null}
            
            {(card.current_points !== undefined || (card.next_reward_threshold && card.next_reward_value)) ? (
                <div className="flex items-center p-2 bg-secondary/30 rounded-md">
                    <TrendingUp className="h-5 w-5 mr-3 text-primary shrink-0" />
                    <div>
                       <span className="font-medium">Milestones: </span>
                       Current: {card.current_points === undefined ? 'N/A' : card.current_points.toLocaleString() } pts. 
                       {card.next_reward_threshold && card.next_reward_value && 
                        ` Next Perk: ₹${card.next_reward_value.toLocaleString()} at ${card.next_reward_threshold.toLocaleString()} pts.`}
                    </div>
                </div>
            ) : null}

             {!(card.rewards_per_rupee || card.reward_value_inr || card.current_points !== undefined || card.next_reward_threshold) && (
                <div className="flex items-center p-2 bg-muted/50 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-3 text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground">No specific reward or milestone details provided for this card.</p>
                </div>
            )}
          </CardContent>
          {/* 
          <CardFooter className="border-t pt-4 mt-2 flex justify-end">
             <Button variant="outline" size="sm" disabled className="transform transition-transform duration-150 ease-in-out hover:scale-105 active:translate-y-px"> 
              <Edit3 className="mr-2 h-4 w-4" /> Edit Card
            </Button> 
          </CardFooter>
          */}
        </Card>
      ))}
    </div>
  );
}

