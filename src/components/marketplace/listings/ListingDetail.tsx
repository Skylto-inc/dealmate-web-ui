'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  ShoppingCart, 
  Tag, 
  User,
  AlertCircle,
  CheckCircle,
  Shield,
  TrendingUp,
  Star,
  Copy,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ListingWithSeller, Transaction } from '@/lib/marketplace/types';
import { marketplaceApi } from '@/lib/marketplace/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import BlurredCouponCode from './BlurredCouponCode';

interface ListingDetailProps {
  listing: ListingWithSeller;
  currentUserId?: string;
}

export default function ListingDetail({ listing, currentUserId }: ListingDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [purchasing, setPurchasing] = useState(false);
  const [listing_data, setListingData] = useState(listing);
  const [userTransaction, setUserTransaction] = useState<Transaction | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isOwner = currentUserId === listing.seller.id;
  const isPurchased = !!userTransaction;
  const hasExpired = listing.expiration_date && new Date(listing.expiration_date) < new Date();
  const discountPercentage = listing.discount_percentage || 
    (listing.original_value && listing.selling_price 
      ? Math.round(((listing.original_value - listing.selling_price) / listing.original_value) * 100)
      : 0);

  useEffect(() => {
    // Check if user has already purchased this listing
    const checkPurchaseStatus = async () => {
      if (currentUserId) {
        try {
          const transactions = await marketplaceApi.getUserTransactions();
          const existingTransaction = transactions.find(t => t.listing_id === listing.id);
          if (existingTransaction) {
            setUserTransaction(existingTransaction);
            // Fetch coupon code if purchased
            const code = await marketplaceApi.getRevealedCoupon(listing.id);
            setCouponCode(code);
          }
        } catch (error) {
          console.error('Failed to check purchase status:', error);
        }
      }
    };

    checkPurchaseStatus();
  }, [listing.id, currentUserId]);

  const handlePurchase = async () => {
    if (!currentUserId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to purchase this deal',
        variant: 'destructive',
      });
      return;
    }

    setPurchasing(true);
    try {
      const transaction = await marketplaceApi.createTransaction({
        listing_id: listing.id,
        payment_method: 'wallet' // Default to wallet payment
      });
      setUserTransaction(transaction);
      
      // Fetch the revealed coupon code
      const code = await marketplaceApi.getRevealedCoupon(listing.id);
      setCouponCode(code);
      
      toast({
        title: 'Purchase successful!',
        description: 'You can now view the coupon code',
      });

      // Update listing data (increment purchase count)
      setListingData(prev => ({
        ...prev,
        purchase_count: prev.purchase_count + 1
      }));
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: 'Purchase failed',
        description: 'Please try again or contact support',
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handleCopyCode = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Coupon code copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this deal: ${listing.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Share link copied to clipboard',
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{listing.seller.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Listed {formatDistanceToNow(new Date(listing.created_at))} ago</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{listing.category}</Badge>
              {listing.brand_name && (
                <Badge variant="outline">{listing.brand_name}</Badge>
              )}
              {listing.listing_type === 'discount_code' && (
                <Badge variant="default">
                  <Tag className="w-3 h-3 mr-1" />
                  Coupon Code
                </Badge>
              )}
              {hasExpired && (
                <Badge variant="destructive">Expired</Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {listing.description || 'No description provided'}
              </p>
            </div>

            {/* Coupon Code Display */}
            {listing.listing_type === 'discount_code' && (
              <div>
                <h3 className="font-semibold mb-3">Coupon Code</h3>
                <BlurredCouponCode
                  code={couponCode || undefined}
                  isPurchased={isPurchased}
                  onPurchase={handlePurchase}
                  purchasing={purchasing}
                />
              </div>
            )}

            {/* Additional Details */}
            {listing.tags && listing.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trust & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Transaction</p>
                  <p className="text-sm text-muted-foreground">
                    All payments are processed securely through our platform
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Verified Seller</p>
                  <p className="text-sm text-muted-foreground">
                    {listing.seller.username} has {listing.seller.total_sales || 0} successful sales
                  </p>
                </div>
              </div>
              {listing.seller.average_rating && (
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Seller Rating</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.seller.average_rating.toFixed(1)} out of 5 stars
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Price Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Price Info */}
            <div className="space-y-3">
              {listing.original_value && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Original Value</span>
                  <span className="line-through text-muted-foreground">
                    ${listing.original_value.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-medium">Selling Price</span>
                <span className="text-2xl font-bold">
                  ${listing.selling_price.toFixed(2)}
                </span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">You Save</span>
                  <Badge variant="default" className="bg-green-500">
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Expiration */}
            {listing.expiration_date && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {hasExpired ? 'Expired on' : 'Expires on'}
                  </span>
                </div>
                <p className="font-medium">
                  {new Date(listing.expiration_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Purchase Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Purchases</span>
                <span>{listing_data.purchase_count || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Views</span>
                <span>{listing.view_count || 0}</span>
              </div>
              {listing.stock_quantity && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock</span>
                    <span>{listing.stock_quantity} available</span>
                  </div>
                  <Progress 
                    value={(listing.purchase_count / listing.stock_quantity) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            {!isOwner && !isPurchased && !hasExpired && (
              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? (
                  'Processing...'
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Purchase for ${listing.selling_price.toFixed(2)}
                  </>
                )}
              </Button>
            )}

            {isPurchased && (
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  You own this deal! The coupon code has been revealed above.
                </AlertDescription>
              </Alert>
            )}

            {isOwner && (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  This is your listing. You cannot purchase your own deals.
                </AlertDescription>
              </Alert>
            )}

            {hasExpired && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  This deal has expired and is no longer available for purchase.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category Average</span>
              <span>$15.99</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Rating</span>
              <Badge variant={listing.selling_price < 15.99 ? 'default' : 'secondary'}>
                {listing.selling_price < 15.99 ? 'Below Average' : 'Above Average'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Demand</span>
              <Badge variant="outline">
                {listing.purchase_count > 10 ? 'High' : 'Normal'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
