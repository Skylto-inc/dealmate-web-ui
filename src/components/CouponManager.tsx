'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: string;
  discount_value?: number;
  minimum_order?: number;
  valid_until?: string;
  is_active: boolean;
}

interface CouponTestResult {
  code: string;
  is_valid: boolean;
  discount_applied?: number;
  final_price?: number;
  error_message?: string;
}

export default function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [merchantDomain, setMerchantDomain] = useState('');
  const [testCodes, setTestCodes] = useState('');
  const [orderValue, setOrderValue] = useState('100');
  const [testResults, setTestResults] = useState<CouponTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchCoupons = async () => {
    if (!merchantDomain) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/coupons/search?merchant_domain=${merchantDomain}&active_only=true`
      );
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
    setLoading(false);
  };

  const testCoupons = async () => {
    if (!merchantDomain || !testCodes) return;
    
    setLoading(true);
    try {
      const codes = testCodes.split(',').map(code => code.trim());
      const response = await fetch('/api/v1/coupons/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coupon_codes: codes,
          merchant_domain: merchantDomain,
          order_value: parseFloat(orderValue)
        })
      });
      
      if (response.ok) {
        const results = await response.json();
        setTestResults(results);
      }
    } catch (error) {
      console.error('Error testing coupons:', error);
    }
    setLoading(false);
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% off`;
    } else if (coupon.discount_type === 'fixed') {
      return `$${coupon.discount_value} off`;
    } else if (coupon.discount_type === 'free_shipping') {
      return 'Free shipping';
    }
    return 'Discount';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎯 Coupon Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter merchant domain (e.g., amazon.com)"
              value={merchantDomain}
              onChange={(e) => setMerchantDomain(e.target.value)}
            />
            <Button onClick={searchCoupons} disabled={loading}>
              Search Coupons
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Enter coupon codes (comma-separated)"
                value={testCodes}
                onChange={(e) => setTestCodes(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Order value"
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
              />
              <Button onClick={testCoupons} disabled={loading}>
                Test Coupons
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {coupons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Coupons ({coupons.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <Card key={coupon.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {coupon.code}
                      </code>
                      <Badge variant={coupon.is_active ? "default" : "secondary"}>
                        {coupon.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{coupon.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-green-600">
                        {getDiscountDisplay(coupon)}
                      </span>
                      {coupon.minimum_order && (
                        <span className="text-gray-500">
                          Min: ${coupon.minimum_order}
                        </span>
                      )}
                    </div>
                    {coupon.valid_until && (
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(coupon.valid_until).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border-l-4 ${
                    result.is_valid ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <code className="font-mono text-sm">{result.code}</code>
                      <p className="text-sm mt-1">
                        {result.is_valid ? (
                          <span className="text-green-700">
                            ✅ Valid - Saved ${result.discount_applied?.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-red-700">
                            ❌ {result.error_message || 'Invalid'}
                          </span>
                        )}
                      </p>
                    </div>
                    {result.final_price && (
                      <div className="text-right text-sm">
                        <p>Final Price: ${result.final_price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}