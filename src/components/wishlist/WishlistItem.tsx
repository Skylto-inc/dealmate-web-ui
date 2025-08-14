import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WishlistItemProps {
  id: string;
  imageUrl?: string;
  name: string;
  price: string;
  platform: string;
  productUrl: string;
  onRemove: (id: string) => void;
}

export default function WishlistItem({
  id,
  imageUrl = "https://placehold.co/100x100.png",
  name,
  price,
  platform,
  productUrl,
  onRemove,
}: WishlistItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 flex items-start gap-3">
        <Image
          src={imageUrl}
          alt={name}
          width={80}
          height={80}
          className="rounded-md object-cover w-20 h-20"
          data-ai-hint="product image"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold leading-tight">{name}</h3>
             <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(id)}
                aria-label="Remove from wishlist"
              >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant="secondary" className="text-xs mb-1">{platform}</Badge>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-primary">{price}</p>
            <Button variant="outline" size="sm" asChild>
              <a href={productUrl} target="_blank" rel="noopener noreferrer">
                View
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
