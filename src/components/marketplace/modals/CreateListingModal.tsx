'use client';

import { useState } from 'react';
import { X, AlertCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreateListingRequest } from '@/lib/marketplace/types';
import { marketplaceApi } from '@/lib/marketplace/api';
import { useToast } from '@/hooks/use-toast';
import { CouponValidator } from '@/lib/marketplace/coupon-validator';
import PriceAnalytics from '@/components/marketplace/analytics/PriceAnalytics';

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'food', name: 'Food & Dining' },
  { id: 'travel', name: 'Travel' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'beauty', name: 'Beauty & Health' },
  { id: 'home', name: 'Home & Living' },
  { id: 'sports', name: 'Sports & Fitness' },
];

export default function CreateListingModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateListingModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand_name: '',
    selling_price: '',
    coupon_code: '',
    expiration_date: '',
  });
  const [couponValidation, setCouponValidation] = useState<{
    errors: string[];
    suggestions?: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.selling_price || !formData.coupon_code || !formData.category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate coupon code before submission
    const validation = CouponValidator.validate(formData.coupon_code, formData.category);
    if (!validation.isValid) {
      setCouponValidation({ errors: validation.errors, suggestions: validation.suggestions });
      return;
    }

    setLoading(true);
    try {
      const formattedCouponCode = CouponValidator.format(formData.coupon_code);
      
      const payload: CreateListingRequest = {
        listing_type: 'discount_code',
        title: formData.title,
        description: formData.description || `Coupon code for ${formData.brand_name || formData.title}`,
        category: formData.category,
        brand_name: formData.brand_name,
        selling_price: parseFloat(formData.selling_price),
        expiration_date: formData.expiration_date || undefined,
        tags: [formData.category, 'coupon', 'discount'].filter(Boolean),
      };

      // Include formatted coupon code in the payload - it will be encrypted and stored securely on the backend
      if (formattedCouponCode) {
        payload.coupon_code = formattedCouponCode;
      }
      
      const listing = await marketplaceApi.createListing(payload);

      toast({
        title: 'Success!',
        description: 'Your deal has been listed successfully',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        brand_name: '',
        selling_price: '',
        coupon_code: '',
        expiration_date: '',
      });

        onOpenChange(false);
        setCouponValidation(null);
        onSuccess?.();
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sell a Deal</DialogTitle>
          <DialogDescription>
            List your coupon code or discount for others to purchase
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Name *</Label>
            <Input
              id="title"
              placeholder="e.g., 50% OFF Nike Shoes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name</Label>
              <Input
                id="brand_name"
                placeholder="e.g., Nike"
                value={formData.brand_name}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
              />
            </div>
          </div>

          {/* Price Analytics */}
          {formData.category && formData.selling_price && (
            <PriceAnalytics
              category={formData.category}
              currentPrice={parseFloat(formData.selling_price) || 0}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="coupon_code">Coupon Code *</Label>
            <Input
              id="coupon_code"
              placeholder="Enter the coupon code"
              value={formData.coupon_code}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, coupon_code: value });
                
                // Real-time validation
                if (value) {
                  const validation = CouponValidator.validate(value, formData.category);
                  setCouponValidation({
                    errors: validation.errors,
                    suggestions: validation.suggestions,
                  });
                } else {
                  setCouponValidation(null);
                }
              }}
              className={couponValidation?.errors.length ? 'border-destructive' : ''}
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be hidden until someone purchases your deal
            </p>
            
            {couponValidation?.errors.length ? (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {couponValidation.errors[0]}
                </AlertDescription>
              </Alert>
            ) : null}
            
            {couponValidation?.suggestions?.length ? (
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {couponValidation.suggestions[0]}
                </AlertDescription>
              </Alert>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="selling_price">Selling Price *</Label>
            <Input
              id="selling_price"
              type="number"
              step="0.01"
              placeholder="10.00"
              value={formData.selling_price}
              onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration_date">Expiration Date</Label>
            <Input
              id="expiration_date"
              type="date"
              value={formData.expiration_date}
              onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this deal..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
