'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Gift, 
  ShoppingBag, 
  Percent, 
  Tag,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Star,
  Copy,
  Check
} from 'lucide-react';

interface BrandVoucher {
  id: string;
  brand: string;
  discount: string;
  code: string;
  validTill: string;
  minPurchase?: number;
  category: string;
  popularity: number;
  isExclusive: boolean;
  usageLimit?: number;
  usedCount?: number;
}

export default function BrandVouchers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers: BrandVoucher[] = [
    {
      id: '1',
      brand: 'Nike',
      discount: '25% OFF',
      code: 'NIKE25DEAL',
      validTill: '2025-02-28',
      minPurchase: 3000,
      category: 'fashion',
      popularity: 92,
      isExclusive: true,
      usageLimit: 1000,
      usedCount: 456
    },
    {
      id: '2',
      brand: 'Starbucks',
      discount: '₹150 OFF',
      code: 'COFFEE150',
      validTill: '2025-01-31',
      minPurchase: 500,
      category: 'food',
      popularity: 88,
      isExclusive: false
    },
    {
      id: '3',
      brand: 'Apple Store',
      discount: '₹5000 OFF',
      code: 'APPLE5K',
      validTill: '2025-03-15',
      minPurchase: 50000,
      category: 'electronics',
      popularity: 95,
      isExclusive: true,
      usageLimit: 500,
      usedCount: 123
    },
    {
      id: '4',
      brand: 'Decathlon',
      discount: '20% OFF',
      code: 'SPORTS20',
      validTill: '2025-02-14',
      minPurchase: 2000,
      category: 'sports',
      popularity: 85,
      isExclusive: false
    },
    {
      id: '5',
      brand: 'BookMyShow',
      discount: '₹200 OFF',
      code: 'MOVIE200',
      validTill: '2025-01-30',
      minPurchase: 600,
      category: 'entertainment',
      popularity: 90,
      isExclusive: true,
      usageLimit: 2000,
      usedCount: 1456
    },
    {
      id: '6',
      brand: 'Zara',
      discount: '30% OFF',
      code: 'ZARA30NEW',
      validTill: '2025-02-10',
      minPurchase: 4000,
      category: 'fashion',
      popularity: 87,
      isExclusive: false
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion', label: 'Fashion & Lifestyle' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || voucher.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-500" />
          Brand Vouchers
        </CardTitle>
        <CardDescription>
          Exclusive discount codes from premium brands
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brands or codes..."
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
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    {voucher.brand}
                    {voucher.isExclusive && (
                      <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                        Exclusive
                      </Badge>
                    )}
                  </h4>
                  <p className="text-2xl font-bold text-green-600 mt-1">{voucher.discount}</p>
                  {voucher.minPurchase && (
                    <p className="text-sm text-muted-foreground">Min. purchase ₹{voucher.minPurchase}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    <span>{getDaysLeft(voucher.validTill)} days left</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span>{voucher.popularity}% claimed</span>
                  </div>
                </div>
              </div>

              {/* Voucher Code */}
              <div className="p-3 bg-muted/50 rounded-lg mb-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono font-semibold">{voucher.code}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyCode(voucher.code)}
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Usage Limit */}
              {voucher.usageLimit && (
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Usage limit</span>
                    <span>{voucher.usedCount}/{voucher.usageLimit} used</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                      style={{ width: `${(voucher.usedCount! / voucher.usageLimit) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button className="w-full" variant="outline">
                Shop Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVouchers.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">No vouchers found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Pro Tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Voucher Pro Tips
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Exclusive vouchers often have higher discounts but limited usage</li>
            <li>• Combine vouchers with card offers for maximum savings</li>
            <li>• Check validity and minimum purchase before shopping</li>
            <li>• Save vouchers to your account to track usage</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
