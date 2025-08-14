import type { Deal } from '@/lib/fraud-detection/fraud-detection-engine';

export const getMockDeals = (): Deal[] => {
  const baseTime = Date.now();
  return [
    {
      id: 'deal1',
      title: 'iPhone 15 Pro - 95% OFF Limited Time!',
      originalPrice: 134900,
      discountedPrice: 6745,
      category: 'electronics',
      sellerId: 'seller3',
      url: 'https://amazom.com/deal/iphone-15-pro',
      timestamp: baseTime - 3600000
    },
    {
      id: 'deal2',
      title: 'Samsung Galaxy S23 - Genuine Deal',
      originalPrice: 79999,
      discountedPrice: 59999,
      category: 'electronics',
      sellerId: 'seller1',
      url: 'https://amazon.in/samsung-galaxy-s23',
      timestamp: baseTime - 1800000
    },
    {
      id: 'deal3',
      title: 'Nike Air Max - Flash Sale',
      originalPrice: 7999,
      discountedPrice: 24999,
      category: 'fashion',
      sellerId: 'seller2',
      url: 'https://suspicious-site.com/nike-air-max',
      timestamp: baseTime - 900000
    }
  ];
};