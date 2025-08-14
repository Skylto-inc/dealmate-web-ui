"use client";

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketPercent, Coins, Gift, Sparkles, Clock, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  type: 'coupon' | 'cashback' | 'voucher' | 'points' | 'exclusive' | 'jackpot';
  title: string;
  value: string;
  description: string;
  code?: string;
  expiresAt?: Date;
  isUsed?: boolean;
  source: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

// Function to load rewards from localStorage
const loadRewardsInventory = (): InventoryItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('dealmate_rewards_inventory');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        expiresAt: item.expiresAt ? new Date(item.expiresAt) : undefined,
        earnedAt: new Date(item.earnedAt)
      }));
    }
  } catch (error) {
    console.error('Error loading rewards inventory:', error);
  }
  
  return [];
};

// Function to save rewards to localStorage
const saveRewardsInventory = (inventory: InventoryItem[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('dealmate_rewards_inventory', JSON.stringify(inventory));
  } catch (error) {
    console.error('Error saving rewards inventory:', error);
  }
};

const RewardsInventory: FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Load inventory on component mount
  useEffect(() => {
    const loadedInventory = loadRewardsInventory();
    setInventory(loadedInventory);
  }, []);

  // Listen for new rewards being added
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dealmate_rewards_inventory') {
        const loadedInventory = loadRewardsInventory();
        setInventory(loadedInventory);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCopyCode = (item: InventoryItem) => {
    if (item.code) {
      navigator.clipboard.writeText(item.code);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getIcon = (type: InventoryItem['type']) => {
    switch (type) {
      case 'coupon': return TicketPercent;
      case 'cashback': return Coins;
      case 'voucher': return Gift;
      case 'points': return Sparkles;
      case 'exclusive': return Sparkles;
      case 'jackpot': return Gift;
      default: return Gift;
    }
  };

  const getDaysRemaining = (expiresAt?: Date) => {
    if (!expiresAt) return null;
    const days = Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return days;
  };

  const filterInventory = (tab: string) => {
    if (tab === 'all') return inventory;
    if (tab === 'active') return inventory.filter(item => !item.isUsed);
    if (tab === 'used') return inventory.filter(item => item.isUsed);
    return inventory.filter(item => item.type === tab);
  };

  const filteredInventory = filterInventory(activeTab);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Rewards Inventory</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="coupon" className="hidden sm:block">Coupons</TabsTrigger>
          <TabsTrigger value="cashback" className="hidden sm:block">Cashback</TabsTrigger>
          <TabsTrigger value="voucher" className="hidden sm:block">Vouchers</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-3">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No rewards found in this category
              </div>
            ) : (
              filteredInventory.map((item) => {
                const Icon = getIcon(item.type);
                const daysRemaining = getDaysRemaining(item.expiresAt);
                
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      item.isUsed && "opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-lg font-bold text-primary">{item.value}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.source}
                            </Badge>
                            {item.isUsed && (
                              <Badge variant="secondary" className="text-xs">
                                Used
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {item.code && !item.isUsed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyCode(item)}
                                className="gap-2"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    {item.code}
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {!item.isUsed && (
                              <Button size="sm" variant="default">
                                Use Now
                              </Button>
                            )}
                          </div>
                          
                          {daysRemaining !== null && !item.isUsed && (
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-3 h-3" />
                              <span className={cn(
                                daysRemaining <= 3 && "text-red-500 font-medium"
                              )}>
                                {daysRemaining === 0 ? 'Expires today' : 
                                 daysRemaining === 1 ? 'Expires tomorrow' :
                                 `${daysRemaining} days left`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{inventory.filter(i => !i.isUsed).length}</p>
          <p className="text-sm text-muted-foreground">Active Rewards</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">₹850</p>
          <p className="text-sm text-muted-foreground">Total Value</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{inventory.filter(i => i.isUsed).length}</p>
          <p className="text-sm text-muted-foreground">Used</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">
            {inventory.filter(i => {
              const days = getDaysRemaining(i.expiresAt);
              return days !== null && days <= 3 && !i.isUsed;
            }).length}
          </p>
          <p className="text-sm text-muted-foreground">Expiring Soon</p>
        </div>
      </div>
    </Card>
  );
};

export default RewardsInventory;
