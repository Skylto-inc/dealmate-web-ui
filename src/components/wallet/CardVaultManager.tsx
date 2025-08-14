'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard, Shield, Trash2, Star, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cardsApi } from '@/lib/api/cards';
import { CardVault, CardTemplate, getCardDisplayName } from '@/types/card-vault';
import CardVaultForm from '@/components/wallet/CardVaultForm';
import CardTemplateSelector from '@/components/wallet/CardTemplateSelector';
import { toast } from 'sonner';

export default function CardVaultManager() {
  const [cards, setCards] = useState<CardVault[]>([]);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardVault | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    loadCards();
    loadTemplates();
  }, []);

  const loadCards = async () => {
    try {
      const data = await cardsApi.getUserCards();
      setCards(data);
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await cardsApi.getCardTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates', error);
      toast.error('Failed to load card templates');
    }
  };

  const handleAddCard = async (data: any) => {
    try {
      const newCard = await cardsApi.createCard(data);
      setCards([...cards, newCard]);
      setShowAddCard(false);
      toast.success('Card added successfully');
    } catch (error) {
      toast.error('Failed to add card');
    }
  };

  const handleUpdateCard = async (cardId: string, data: any) => {
    try {
      const updatedCard = await cardsApi.updateCard(cardId, data);
      setCards(cards.map(c => c.id === cardId ? updatedCard : c));
      toast.success('Card updated');
    } catch (error) {
      toast.error('Failed to update card');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card?')) return;
    
    try {
      await cardsApi.deleteCard(cardId);
      setCards(cards.filter(c => c.id !== cardId));
      toast.success('Card removed');
    } catch (error) {
      toast.error('Failed to remove card');
    }
  };

  const setPrimaryCard = async (cardId: string) => {
    try {
      await cardsApi.setPrimaryCard(cardId);
      setCards(cards.map(c => ({
        ...c,
        isPrimary: c.id === cardId
      })));
      toast.success('Primary card updated');
    } catch (error) {
      toast.error('Failed to update primary card');
    }
  };

  return (
    <div className="space-y-6">
      {/* RBI Compliance Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <Shield className="h-4 w-4" />
        <AlertTitle>RBI Compliant & Secure</AlertTitle>
        <AlertDescription>
          We follow RBI guidelines and do not store any sensitive card information. 
          Only card metadata is saved to help you track rewards and find the best deals.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Card Vault</h2>
          <p className="text-muted-foreground">
            Manage your cards to unlock personalized deal recommendations
          </p>
        </div>
        <Button onClick={() => setShowAddCard(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading cards...</div>
      ) : cards.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cards added yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your cards to get personalized deal recommendations
            </p>
            <Button onClick={() => setShowAddCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className={card.isPrimary ? 'border-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {getCardDisplayName(card)}
                    </CardTitle>
                    <CardDescription>
                      {card.cardNetwork && <span>{card.cardNetwork} • </span>}
                      {card.rewardType === 'cashback' 
                        ? `${card.baseRewardRate}% Cashback`
                        : `${card.baseRewardRate} pts/₹`
                      }
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {card.isPrimary && (
                      <Badge variant="secondary" className="text-xs">
                        Primary
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Category Rewards */}
                {Object.keys(card.categoryRewards).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Category Bonuses:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(card.categoryRewards).map(([cat, rate]) => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {cat}: {rate}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Points */}
                {card.currentPoints > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Points:</span>
                    <span className="font-medium">{card.currentPoints.toLocaleString()}</span>
                  </div>
                )}

                {/* Milestone Progress */}
                {card.milestoneConfig.length > 0 && (
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Next Milestone:</p>
                    {card.milestoneConfig
                      .filter(m => m.threshold > card.currentPoints)
                      .slice(0, 1)
                      .map(milestone => (
                        <div key={milestone.threshold} className="flex justify-between">
                          <span>{milestone.threshold.toLocaleString()} pts</span>
                          <span className="font-medium">₹{milestone.rewardValue}</span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {!card.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPrimaryCard(card.id)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      Set Primary
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Info className="mr-1 h-3 w-3" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{getCardDisplayName(card)}</DialogTitle>
                        <DialogDescription>
                          Complete card details and reward structure
                        </DialogDescription>
                      </DialogHeader>
                      <CardDetails card={card} onUpdate={handleUpdateCard} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
              Add your card details to get personalized deal recommendations
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="manual">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="templates">Popular Cards</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <CardVaultForm onSubmit={handleAddCard} />
            </TabsContent>
            <TabsContent value="templates">
              <CardTemplateSelector 
                templates={templates}
                onSelectTemplate={(template: CardTemplate) => {
                  handleAddCard(template);
                }}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Card Details Component
function CardDetails({ card, onUpdate }: { card: CardVault; onUpdate: (id: string, data: any) => void }) {
  const [currentPoints, setCurrentPoints] = useState(card.currentPoints);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Bank</label>
          <p className="text-lg">{card.bankName}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Card Type</label>
          <p className="text-lg">{card.cardType}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Network</label>
          <p className="text-lg">{card.cardNetwork || 'Not specified'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Annual Fee</label>
          <p className="text-lg">₹{card.annualFee}</p>
        </div>
      </div>

      {/* Update Points */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium">Current Points Balance</label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            className="flex-1 px-3 py-2 border rounded-md"
            value={currentPoints}
            onChange={(e) => setCurrentPoints(parseInt(e.target.value) || 0)}
          />
          <Button 
            onClick={() => onUpdate(card.id, { currentPoints })}
            disabled={currentPoints === card.currentPoints}
          >
            Update Points
          </Button>
        </div>
      </div>

      {/* Features */}
      {Object.keys(card.features).length > 0 && (
        <div className="border-t pt-4">
          <label className="text-sm font-medium mb-2 block">Card Features</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(card.features).map(([feature, enabled]) => (
              enabled && (
                <Badge key={feature} variant="secondary">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
