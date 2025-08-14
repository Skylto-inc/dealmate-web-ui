import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductInfoCardProps {
  imageUrl?: string;
  title: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  platform: string;
}

export default function ProductInfoCard({
  imageUrl = "https://placehold.co/300x200.png",
  title,
  currentPrice,
  originalPrice,
  discount,
  platform
}: ProductInfoCardProps) {
  return (
    <Card className="group neumorphic-card w-full h-full flex flex-col transform-gpu transition-transform duration-300 ease-in-out hover:scale-105 relative hover:z-10">
      <div className="h-full flex flex-col">
        <CardHeader className="p-0 relative flex-shrink-0">
          <div className="relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              width={300}
              height={200}
              className="w-full h-28 xs:h-32 sm:h-36 md:h-40 lg:h-44 object-cover"
              data-ai-hint="product e-commerce"
              priority
              sizes="(max-width: 374px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Platform Badge - Responsive */}
            <div className="absolute top-1.5 xs:top-2 right-1.5 xs:right-2">
              <Badge variant="secondary" className="glass-card text-xs xs:text-sm px-1.5 xs:px-2 py-0.5 xs:py-1 font-medium backdrop-blur-md">
                {platform}
              </Badge>
            </div>
            
            {/* Discount Badge - Mobile Optimized */}
            {discount && (
              <div className="absolute top-1.5 xs:top-2 left-1.5 xs:left-2">
                <Badge variant="destructive" className="gradient-border text-xs xs:text-sm px-1.5 xs:px-2 py-0.5 xs:py-1 shadow-lg font-bold">
                  {discount} OFF
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-2.5 xs:p-3 sm:p-4 space-y-2 xs:space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
          {/* Product Title - Responsive Typography */}
          <CardTitle className="text-sm xs:text-base sm:text-lg font-semibold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200 flex-1">
            {title}
          </CardTitle>
          
          {/* Price Section - Enhanced Mobile Layout */}
          <div className="flex items-baseline gap-1.5 xs:gap-2 flex-wrap mt-auto">
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-primary">
              {currentPrice}
            </p>
            {originalPrice && (
              <p className="text-xs xs:text-sm sm:text-base text-muted-foreground line-through">
                {originalPrice}
              </p>
            )}
          </div>
          
          {/* Savings Calculation - Mobile Friendly */}
          {originalPrice && currentPrice && (
            <div className="text-xs xs:text-sm text-green-400 font-medium">
              You save: ₹{(parseInt(originalPrice.replace(/[^₹\d]/g, '')) - parseInt(currentPrice.replace(/[^₹\d]/g, ''))).toLocaleString()}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
