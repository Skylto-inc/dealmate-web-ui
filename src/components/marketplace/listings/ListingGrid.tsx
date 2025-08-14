import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, Gift, MapPin, DollarSign, Award, Star, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import { ListingWithSeller } from '@/lib/marketplace/types';
import { formatDistanceToNow } from 'date-fns';

interface ListingGridProps {
  listings: ListingWithSeller[];
  loading?: boolean;
  onLoadMore?: () => void;
}

const listingTypeIcons = {
  discount_code: <Tag className="h-4 w-4" />,
  gift_card: <Gift className="h-4 w-4" />,
  referral_link: <MapPin className="h-4 w-4" />,
  location_deal: <MapPin className="h-4 w-4" />,
  cashback_offer: <DollarSign className="h-4 w-4" />,
  loyalty_points: <Award className="h-4 w-4" />,
};

const listingTypeLabels = {
  discount_code: 'Code',
  gift_card: 'Gift Card',
  referral_link: 'Referral',
  location_deal: 'Local Deal',
  cashback_offer: 'Cashback',
  loyalty_points: 'Points',
};

export default function ListingGrid({ listings, loading, onLoadMore }: ListingGridProps) {
  if (loading && listings.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {listings.map((item) => (
          <Link
            key={item.id}
            href={`/marketplace/listing/${item.id}`}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {listingTypeIcons[item.listing_type as keyof typeof listingTypeIcons]}
                      <span className="text-xs text-gray-500">
                        {listingTypeLabels[item.listing_type as keyof typeof listingTypeLabels]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                  {item.is_verified && (
                    <Shield className="h-4 w-4 text-green-500 flex-shrink-0" />
                  )}
                </div>

                {/* Brand */}
                {item.brand_name && (
                  <p className="text-xs text-gray-600 mb-2">{item.brand_name}</p>
                )}

                {/* Price */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-primary">
                    ${item.selling_price}
                  </p>
                  {item.original_value && (
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 line-through">
                        ${item.original_value}
                      </p>
                      {item.discount_percentage && (
                        <Badge variant="secondary" className="text-xs">
                          {item.discount_percentage}% OFF
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Seller Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{item.seller.username}</span>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      <span>{item.seller.trust_score.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Expiration */}
                {item.expiration_date && (
                  <div className="mt-2 text-xs text-orange-600">
                    Expires {formatDistanceToNow(new Date(item.expiration_date), { addSuffix: true })}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {onLoadMore && listings.length >= 20 && (
        <div className="flex justify-center mt-8">
          <Button onClick={onLoadMore} variant="outline" disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </>
  );
}
