'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ShoppingCart, 
  TrendingUp, 
  Zap, 
  Clock, 
  Star, 
  AlertCircle,
  ExternalLink,
  Heart,
  Bell
} from 'lucide-react';
import { realTimeDealsApi, RealTimeDeal, GetDealsParams } from '@/lib/deals/real-time-api';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export default function RealTimeDeals() {
  const [deals, setDeals] = useState<RealTimeDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GetDealsParams>({
    limit: 20,
    offset: 0,
    include_bank_offers: true,
    include_coupons: true,
  });
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadDeals();
  }, [filters, activeTab]);

  const loadDeals = async () => {
    setLoading(true);
    try {
      let response;
      
      switch (activeTab) {
        case 'trending':
          response = await realTimeDealsApi.getTrendingDeals();
          break;
        case 'flash':
          response = await realTimeDealsApi.getFlashSales();
          break;
        default:
          response = await realTimeDealsApi.getDeals(filters);
      }
      
      setDeals(response.deals);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load deals. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (deal: RealTimeDeal) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to create price alerts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await realTimeDealsApi.createAlert({
        user_id: user.id,
        product_name: deal.product_name,
        target_price: parseFloat(deal.current_price) * 0.9, // Alert at 10% lower price
        platforms: [deal.platform],
        alert_type: 'price_drop',
      });
      
      toast({
        title: 'Alert created',
        description: 'You will be notified when the price drops.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create alert.',
        variant: 'destructive',
      });
    }
  };

  const DealCard = ({ deal }: { deal: RealTimeDeal }) => {
    const savings = parseFloat(deal.total_savings);
    const finalPrice = parseFloat(deal.final_price);
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {deal.flash_sale && (
            <Badge className="absolute top-2 right-2 z-10 bg-red-500">
              <Zap className="w-3 h-3 mr-1" />
              Flash Sale
            </Badge>
          )}
          {deal.image_url && (
            <img 
              src={deal.image_url} 
              alt={deal.product_name}
              className="w-full h-48 object-cover"
            />
          )}
        </div>
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">
                {deal.product_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>{deal.platform}</span>
                {deal.rating && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1">{deal.rating}</span>
                    </div>
                  </>
                )}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-2">
              {deal.discount_percentage.toFixed(0)}% OFF
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {formatCurrency(finalPrice)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(parseFloat(deal.original_price))}
              </span>
            </div>
            
            {savings > 0 && (
              <div className="text-sm text-green-600">
                Total savings: {formatCurrency(savings)}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {deal.bank_offers.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {deal.bank_offers.length} Bank Offer{deal.bank_offers.length > 1 ? 's' : ''}
                </Badge>
              )}
              {deal.coupon_codes.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {deal.coupon_codes.length} Coupon{deal.coupon_codes.length > 1 ? 's' : ''}
                </Badge>
              )}
              {deal.cashback_offers.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Cashback Available
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1" 
                onClick={() => window.open(deal.url, '_blank')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Deal
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCreateAlert(deal)}
              >
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Real-Time Deals</h2>
        <Button variant="outline" onClick={loadDeals}>
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Deals</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="flash">
            <Zap className="w-4 h-4 mr-2" />
            Flash Sales
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={filters.platforms}
                    onValueChange={(value) => 
                      setFilters({ ...filters, platforms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All platforms</SelectItem>
                      <SelectItem value="Amazon">Amazon</SelectItem>
                      <SelectItem value="Flipkart">Flipkart</SelectItem>
                      <SelectItem value="Myntra">Myntra</SelectItem>
                      <SelectItem value="AJIO">AJIO</SelectItem>
                      <SelectItem value="Nykaa">Nykaa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Min Discount %</Label>
                  <Slider
                    value={[filters.min_discount || 0]}
                    onValueChange={(value) => 
                      setFilters({ ...filters, min_discount: value[0] })
                    }
                    max={90}
                    step={5}
                  />
                  <span className="text-sm text-muted-foreground">
                    {filters.min_discount || 0}% or more
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Label>Max Price</Label>
                  <Slider
                    value={[filters.max_price || 50000]}
                    onValueChange={(value) => 
                      setFilters({ ...filters, max_price: value[0] })
                    }
                    max={50000}
                    step={1000}
                  />
                  <span className="text-sm text-muted-foreground">
                    Up to {formatCurrency(filters.max_price || 50000)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bank-offers"
                    checked={filters.include_bank_offers}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, include_bank_offers: checked })
                    }
                  />
                  <Label htmlFor="bank-offers">Include Bank Offers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="coupons"
                    checked={filters.include_coupons}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, include_coupons: checked })
                    }
                  />
                  <Label htmlFor="coupons">Include Coupons</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flash-sales"
                    checked={filters.flash_sales_only}
                    onCheckedChange={(checked) => 
                      setFilters({ ...filters, flash_sales_only: checked })
                    }
                  />
                  <Label htmlFor="flash-sales">Flash Sales Only</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-96 animate-pulse">
              <div className="h-48 bg-gray-200" />
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No deals found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
