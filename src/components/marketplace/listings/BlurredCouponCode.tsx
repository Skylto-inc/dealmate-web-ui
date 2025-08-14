'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BlurredCouponCodeProps {
  code?: string;
  isPurchased: boolean;
  isPreview?: boolean;
  className?: string;
  onPurchase?: () => void;
  purchasing?: boolean;
}

export default function BlurredCouponCode({
  code,
  isPurchased,
  isPreview = false,
  className,
  onPurchase,
  purchasing = false,
}: BlurredCouponCodeProps) {
  const [showCode, setShowCode] = useState(false);

  const displayCode = isPurchased && code ? code : 'XXXXXXXXXX';
  const canReveal = isPurchased && code;

  return (
    <Card className={cn('p-4', className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Coupon Code
          </h3>
          {canReveal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              className="h-8 px-2"
            >
              {showCode ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Show
                </>
              )}
            </Button>
          )}
        </div>

        <div className="relative">
          <div
            className={cn(
              'font-mono text-lg px-4 py-3 rounded-md bg-muted text-center select-all transition-all',
              !isPurchased && 'select-none',
              !canReveal || !showCode ? 'blur-md' : ''
            )}
          >
            {displayCode}
          </div>

          {!isPurchased && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {!isPurchased && !isPreview && onPurchase && (
          <Button
            onClick={onPurchase}
            disabled={purchasing}
            className="w-full"
            size="sm"
          >
            {purchasing ? 'Processing...' : 'Purchase to Reveal'}
          </Button>
        )}

        {isPreview && (
          <p className="text-xs text-muted-foreground text-center">
            Code will be revealed after purchase
          </p>
        )}

        {isPurchased && code && (
          <p className="text-xs text-muted-foreground text-center">
            Click the code to copy • {showCode ? 'Click "Hide" to blur again' : 'Click "Show" to reveal'}
          </p>
        )}
      </div>
    </Card>
  );
}
