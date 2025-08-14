'use client';

import { useState } from 'react';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Item {
  id: string;
  imageUrl?: string;
  name: string;
  price: string;
  platform: string;
  productUrl: string;
}

const initialMockWishlist: Item[] = [
  { 
    id: '1', 
    name: 'Wireless Earbuds Pro', 
    price: '₹2,499', 
    platform: 'Flipkart', 
    productUrl: 'https://www.flipkart.com/search?q=wireless+earbuds+pro', 
    imageUrl: 'https://picsum.photos/seed/earbuds/100/100' 
  },
  { 
    id: '2', 
    name: 'Smartwatch Series 7', 
    price: '₹15,999', 
    platform: 'Amazon.in', 
    productUrl: 'https://www.amazon.in/s?k=smartwatch+series+7', 
    imageUrl: 'https://picsum.photos/seed/watch/100/100' 
  },
  { 
    id: '3', 
    name: 'Running Shoes XYZ', 
    price: '₹3,200', 
    platform: 'Myntra', 
    productUrl: 'https://www.myntra.com/running-shoes', 
    imageUrl: 'https://picsum.photos/seed/shoes/100/100' 
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Item[]>(initialMockWishlist);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRemoveItem = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  
  const filteredItems = wishlistItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Input 
          type="search" 
          placeholder="Search wishlist..." 
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <WishlistItem
              key={item.id}
              {...item}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <SearchX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No items found</h3>
          <p className="text-sm text-muted-foreground">
            {wishlistItems.length === 0 ? "Your wishlist is empty. Add some products!" : "Try a different search term."}
          </p>
        </div>
      )}
    </div>
  );
}
