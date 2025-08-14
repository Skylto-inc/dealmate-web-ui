'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Zap, 
  Clock, 
  Star, 
  TrendingUp, 
  Percent,
  ShoppingBag,
  Smartphone,
  Pizza,
  Plane,
  Tv,
  ShoppingCart,
  Tag,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CashbackOffer {
  id: string;
  merchant: string;
  category: string;
  cashbackRate: string;
  maxCashback?: number;
  validTill: string;
  isActivated: boolean;
  popularity: number;
  type: 'percentage' | 'flat' | 'upto';
  exclusiveFor?: string;
  minTransaction?: number;
  description: string;
  tags: string[];
  icon: React.ReactNode;
}

export default function ActiveCashbackOffers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('trending');

  const offers: CashbackOffer[] = [
    {
      id: '1',
      merchant: 'Amazon',
      category: 'shopping',
      cashbackRate: '5%',
      maxCashback: 150,
      validTill: '2025-02-28',
      isActivated: false,
      popularity: 95,
      type: 'upto',
      minTransaction: 1000,
      description: 'Extra 5% cashback on Amazon Pay balance load',
      tags: ['Hot', 'Popular'],
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      id: '2',
      merchant: 'Swiggy',
      category: 'food',
      cashbackRate: '₹75',
      validTill: '2025-01-31',
      isActivated: true,
      popularity: 88,
      type: 'flat',
      minTransaction: 199,
      description: 'Flat ₹75 cashback on orders above ₹199',
      tags: ['Food', 'Weekend Special'],
      icon: <Pizza className="h-5 w-5" />
    },
    {
      id: '3',
      merchant: 'MakeMyTrip',
      category: 'travel',
      cashbackRate: '12%',
      maxCashback: 2000,
      validTill: '2025-03-15',
      isActivated: false,
      popularity: 92,
      type: 'upto',
      exclusiveFor: 'Gold Members',
      minTransaction: 5000,
      description: 'Book flights and hotels with extra cashback',
      tags: ['Travel', 'Exclusive'],
      icon: <Plane className="h-5 w-5" />
    },
    {
      id: '4',
      merchant: 'Myntra',
      category: 'shopping',
      cashbackRate: '10%',
      maxCashback: 500,
      validTill: '2025-02-14',
      isActivated: false,
      popularity: 85,
      type: 'upto',
      minTransaction: 2000,
      description: 'Fashion sale with extra cashback',
      tags: ['Fashion', 'Sale'],
      icon: <ShoppingBag className="h-5 w-5" />
    },
    {
      id: '5',
      merchant: 'Mobile Recharge',
      category: 'recharge',
      cashbackRate: '2%',
      maxCashback: 20,
      validTill: '2025-12-31',
      isActivated: true,
      popularity: 78,
      type: 'upto',
      description: 'Cashback on all mobile recharges',
      tags: ['Always On', 'Utility'],
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: '6',
      merchant: 'Netflix',
      category: 'entertainment',
      cashbackRate: '₹150',
      validTill: '2025-02-28',
      isActivated: false,
      popularity: 90,
      type: 'flat',
      description: 'First month subscription cashback',
      tags: ['Entertainment', 'New User'],
      icon: <Tv className="h-5 w-5" />
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', icon: <Tag className="h-4 w-4" /> },
    { value: 'shopping', label: 'Shopping', icon: <ShoppingCart className="h-4 w-4" /> },
    { value: 'food', label: 'Food & Dining', icon: <Pizza className="h-4 w-4" /> },
    { value: 'travel', label: 'Travel', icon: <Plane className="h-4 w-4" /> },
    { value: 'recharge', label: 'Recharge & Bills', icon: <Smartphone className="h-4 w-4" /> },
    { value: 'entertainment', label: 'Entertainment', icon: <Tv className="h-4 w-4" /> }
  ];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingOffers = [...filteredOffers].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const expiringOffers = [...filteredOffers].sort((a, b) => new Date(a.validTill).getTime() - new Date(b.validTill).getTime()).slice(0, 6);

  const getCashbackDisplay = (offer: CashbackOffer) => {
    if (offer.type === 'flat') {
      return offer.cashbackRate;
    } else if (offer.type === 'upto' && offer.maxCashback) {
      return `${offer.cashbackRate} (up to ₹${offer.maxCashback})`;
    }
    return offer.cashbackRate;
  };

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Active Cashback Offers
        </CardTitle>
        <CardDescription>
          Discover and activate cashback offers from your favorite brands
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="all">All Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {offer.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{offer.merchant}</h4>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{getCashbackDisplay(offer)}</p>
                      {offer.minTransaction && (
                        <p className="text-xs text-muted-foreground">Min ₹{offer.minTransaction}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {offer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {offer.exclusiveFor && (
                        <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                          {offer.exclusiveFor}
                        </Badge>
                      )}
                    </div>
                    {offer.isActivated ? (
                      <Button size="sm" variant="secondary" disabled>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Activated
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        Activate
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{offer.popularity}% users activated</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getDaysLeft(offer.validTill)} days left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expiring" className="space-y-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800 mb-4">
              <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                These offers are expiring soon! Activate them before they're gone.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expiringOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  {getDaysLeft(offer.validTill) <= 3 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                      {getDaysLeft(offer.validTill)} days left
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {offer.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{offer.merchant}</h4>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{getCashbackDisplay(offer)}</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" variant={getDaysLeft(offer.validTill) <= 3 ? 'default' : 'outline'}>
                    Activate Now
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-3">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {offer.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{offer.merchant}</h4>
                          {offer.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-green-600">{getCashbackDisplay(offer)}</p>
                      <Button size="sm" variant="ghost" className="mt-1">
                        View Details
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pro Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Pro Tips to Maximize Cashback
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Stack cashback offers with bank card offers for double savings</li>
            <li>• Check for exclusive member offers if you have Gold/Platinum status</li>
            <li>• Activate offers before shopping to ensure cashback tracking</li>
            <li>• Compare cashback rates across different payment methods</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
