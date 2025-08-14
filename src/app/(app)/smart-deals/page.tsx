'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ShoppingBag, Star, Clock } from 'lucide-react';
import { DealLoader } from '@/components/ui/animated-loader';

// Mock data for discounted products from various marketplaces
const MOCK_DISCOUNTED_PRODUCTS = [
  {
    id: 1,
    title: "Samsung Galaxy Buds Pro",
    marketplace: "Amazon",
    originalPrice: 15999,
    discountedPrice: 9999,
    discount: 38,
    image: "https://via.placeholder.com/300x200?text=Galaxy+Buds",
    rating: 4.5,
    expiresIn: "2 days"
  },
  {
    id: 2,
    title: "Sony WH-1000XM4 Headphones",
    marketplace: "Flipkart",
    originalPrice: 29990,
    discountedPrice: 19990,
    discount: 33,
    image: "https://via.placeholder.com/300x200?text=Sony+Headphones",
    rating: 4.8,
    expiresIn: "5 hours"
  },
  {
    id: 3,
    title: "Nike Air Max 270",
    marketplace: "AJIO",
    originalPrice: 12995,
    discountedPrice: 7797,
    discount: 40,
    image: "https://via.placeholder.com/300x200?text=Nike+Shoes",
    rating: 4.3,
    expiresIn: "1 day"
  },
  {
    id: 4,
    title: "iPad Air (5th Gen)",
    marketplace: "Apple Store",
    originalPrice: 54900,
    discountedPrice: 49900,
    discount: 9,
    image: "https://via.placeholder.com/300x200?text=iPad+Air",
    rating: 4.9,
    expiresIn: "3 days"
  },
  {
    id: 5,
    title: "OnePlus Nord CE 3 Lite",
    marketplace: "OnePlus Store",
    originalPrice: 19999,
    discountedPrice: 17999,
    discount: 10,
    image: "https://via.placeholder.com/300x200?text=OnePlus+Phone",
    rating: 4.2,
    expiresIn: "6 hours"
  },
  {
    id: 6,
    title: "Logitech MX Master 3S",
    marketplace: "Amazon",
    originalPrice: 9995,
    discountedPrice: 7495,
    discount: 25,
    image: "https://via.placeholder.com/300x200?text=Logitech+Mouse",
    rating: 4.7,
    expiresIn: "4 days"
  },
  {
    id: 7,
    title: "JBL Flip 6 Speaker",
    marketplace: "Croma",
    originalPrice: 11999,
    discountedPrice: 8999,
    discount: 25,
    image: "https://via.placeholder.com/300x200?text=JBL+Speaker",
    rating: 4.4,
    expiresIn: "12 hours"
  },
  {
    id: 8,
    title: "Fitbit Charge 5",
    marketplace: "Nykaa",
    originalPrice: 14999,
    discountedPrice: 9999,
    discount: 33,
    image: "https://via.placeholder.com/300x200?text=Fitbit",
    rating: 4.1,
    expiresIn: "2 days"
  }
];

export default function SmartDealsPage() {
  const [products, setProducts] = useState<typeof MOCK_DISCOUNTED_PRODUCTS>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setProducts(MOCK_DISCOUNTED_PRODUCTS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // In real implementation, this would fetch new products
      setProducts([...MOCK_DISCOUNTED_PRODUCTS].sort(() => Math.random() - 0.5));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen-safe bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="space-responsive">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3 xs:gap-4 mb-4 xs:mb-6 sm:mb-8">
          <div className="glass-card p-3 xs:p-4 sm:p-6">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
              <div className="flex-1">
                <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  🛍️ Deals
                </h2>
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground/80 mt-1 xs:mt-2">
                  Discover discounted products from marketplaces worldwide
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size="sm" 
                  disabled={isLoading} 
                  className="touch-target"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-8">
            <DealLoader size="lg" />
            <p className="text-muted-foreground animate-pulse">
              Loading amazing deals from around the world...
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <>
            <div className="glass-card p-3 xs:p-4 mb-4 xs:mb-6">
              <div className="text-sm xs:text-base font-medium">
                {products.length} discounted products available
              </div>
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-6 lg:gap-8 mb-6 xs:mb-8">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="glass-card p-4 hover:scale-105 transition-transform duration-200 animate-fade-in" 
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {/* Product Image */}
                  <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-800">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                      -{product.discount}%
                    </div>
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                      {product.marketplace}
                    </div>
                  </div>

                  {/* Product Info */}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{product.rating}</span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-green-400">₹{product.discountedPrice.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-green-400">Save ₹{(product.originalPrice - product.discountedPrice).toLocaleString()}</div>
                  </div>

                  {/* Expiry */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Clock className="h-3 w-3" />
                    <span>Expires in {product.expiresIn}</span>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" size="sm">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Deal
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Stats Card */}
            <div className="glass-card p-4 xs:p-6 lg:p-8 text-center">
              <h3 className="text-base xs:text-lg lg:text-xl font-semibold mb-3 xs:mb-4">Deal Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4">
                <div className="p-2 xs:p-3 rounded-lg bg-purple-500/10">
                  <div className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-400">
                    {products.length}
                  </div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Active Deals</div>
                </div>
                <div className="p-2 xs:p-3 rounded-lg bg-blue-500/10">
                  <div className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-400">
                    ₹{products.reduce((sum, p) => sum + (p.originalPrice - p.discountedPrice), 0).toLocaleString()}
                  </div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Total Savings</div>
                </div>
                <div className="p-2 xs:p-3 rounded-lg bg-green-500/10 col-span-2 sm:col-span-1">
                  <div className="text-lg xs:text-xl sm:text-2xl font-bold text-green-400">
                    {Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length)}%
                  </div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Avg Discount</div>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="glass-card p-3 xs:p-4 mt-4 xs:mt-6 mb-safe-bottom">
          <p className="text-xs xs:text-sm text-center text-muted-foreground/60">
            💡 Showing discounted products from popular marketplaces. New deals added regularly.
          </p>
        </div>
      </div>
    </div>
  );
}
