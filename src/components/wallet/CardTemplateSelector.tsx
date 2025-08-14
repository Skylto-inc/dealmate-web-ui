'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CardTemplate } from '@/types/card-vault';

interface CardTemplateSelectorProps {
  templates: CardTemplate[];
  onSelectTemplate: (template: CardTemplate) => void;
}

export default function CardTemplateSelector({ templates, onSelectTemplate }: CardTemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(
    (template) =>
      template.bankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.cardType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.cardNetwork?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryRewardsDisplay = (categoryRewards: Record<string, number>) => {
    const entries = Object.entries(categoryRewards || {});
    if (entries.length === 0) return null;
    
    const displayEntries = entries.slice(0, 3);
    const remaining = entries.length - 3;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {displayEntries.map(([category, rate]) => (
          <Badge key={category} variant="secondary" className="text-xs">
            {category}: {rate}%
          </Badge>
        ))}
        {remaining > 0 && (
          <Badge variant="secondary" className="text-xs">
            +{remaining} more
          </Badge>
        )}
      </div>
    );
  };

  const getFeaturesList = (features: CardTemplate['features']) => {
    const activeFeatures = Object.entries(features || {})
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    const featureLabels: Record<string, string> = {
      loungeAccess: 'Lounge Access',
      concierge: 'Concierge',
      golfAccess: 'Golf Access',
      insuranceCover: 'Insurance',
      fuelSurchargeWaiver: 'Fuel Waiver',
      noForexMarkup: 'No Forex Markup',
      priorityPass: 'Priority Pass',
      meetGreet: 'Meet & Greet',
    };

    return activeFeatures.slice(0, 3).map(feature => (
      <Badge key={feature} variant="outline" className="text-xs">
        {featureLabels[feature] || feature}
      </Badge>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by bank, card name, or network..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No matching cards found
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredTemplates.map((template, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {template.bankName || 'Unknown Bank'} {template.cardType || 'Card'}
                    </CardTitle>
                    <CardDescription>
                      {template.cardNetwork || 'Unknown Network'} • ₹{(template.annualFee || 0).toLocaleString()} annual fee
                    </CardDescription>
                  </div>
                  {template.rewardType && template.baseRewardRate !== undefined && (
                    <Badge variant="default">
                      {template.rewardType === 'cashback' 
                        ? `${template.baseRewardRate}% Cashback`
                        : `${template.baseRewardRate} pts/₹`
                      }
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Fee Waiver */}
                {template.feeWaiverCriteria && (
                  <p className="text-sm text-muted-foreground">
                    Fee waiver: {template.feeWaiverCriteria}
                  </p>
                )}

                {/* Category Rewards */}
                {getCategoryRewardsDisplay(template.categoryRewards)}

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {getFeaturesList(template.features)}
                </div>

                <Button
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
