'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateCardRequest } from '@/types/card-vault';
import { Info } from 'lucide-react';

interface CardVaultFormProps {
  onSubmit: (data: CreateCardRequest) => void;
  initialData?: Partial<CreateCardRequest>;
}

export default function CardVaultForm({ onSubmit, initialData }: CardVaultFormProps) {
  const [formData, setFormData] = useState<CreateCardRequest>({
    bankName: initialData?.bankName || '',
    cardType: initialData?.cardType || '',
    cardNetwork: initialData?.cardNetwork || 'Visa',
    lastFourDigits: initialData?.lastFourDigits || '',
    nickname: initialData?.nickname || '',
    baseRewardRate: initialData?.baseRewardRate || 0,
    rewardType: initialData?.rewardType || 'points',
    pointValueInr: initialData?.pointValueInr || 0,
    categoryRewards: initialData?.categoryRewards || {},
    currentPoints: initialData?.currentPoints || 0,
    milestoneConfig: initialData?.milestoneConfig || [],
    features: initialData?.features || {},
    annualFee: initialData?.annualFee || 0,
    feeWaiverCriteria: initialData?.feeWaiverCriteria,
  });

  const [categoryName, setCategoryName] = useState('');
  const [categoryRate, setCategoryRate] = useState('');

  const handleAddCategory = () => {
    if (categoryName && categoryRate) {
      setFormData({
        ...formData,
        categoryRewards: {
          ...formData.categoryRewards,
          [categoryName.toLowerCase()]: parseFloat(categoryRate),
        },
      });
      setCategoryName('');
      setCategoryRate('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    const { [category]: _, ...rest } = formData.categoryRewards || {};
    setFormData({ ...formData, categoryRewards: rest });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g., HDFC"
                required
              />
            </div>
            <div>
              <Label htmlFor="cardType">Card Type</Label>
              <Input
                id="cardType"
                value={formData.cardType}
                onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                placeholder="e.g., Infinia"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardNetwork">Card Network</Label>
              <Select
                value={formData.cardNetwork}
                onValueChange={(value) => setFormData({ ...formData, cardNetwork: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="Rupay">Rupay</SelectItem>
                  <SelectItem value="American Express">American Express</SelectItem>
                  <SelectItem value="Diners Club">Diners Club</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lastFourDigits">Last 4 Digits (Optional)</Label>
              <Input
                id="lastFourDigits"
                value={formData.lastFourDigits || ''}
                onChange={(e) => setFormData({ ...formData, lastFourDigits: e.target.value })}
                placeholder="1234"
                maxLength={4}
                pattern="[0-9]{4}"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nickname">Card Nickname (Optional)</Label>
            <Input
              id="nickname"
              value={formData.nickname || ''}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="e.g., My Travel Card"
            />
          </div>

          <div>
            <Label htmlFor="annualFee">Annual Fee (₹)</Label>
            <Input
              id="annualFee"
              type="number"
              value={formData.annualFee || 0}
              onChange={(e) => setFormData({ ...formData, annualFee: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="feeWaiverCriteria">Fee Waiver Criteria (Optional)</Label>
            <Input
              id="feeWaiverCriteria"
              value={formData.feeWaiverCriteria || ''}
              onChange={(e) => setFormData({ ...formData, feeWaiverCriteria: e.target.value })}
              placeholder="e.g., Spend 2L in a year"
            />
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rewardType">Reward Type</Label>
              <Select
                value={formData.rewardType}
                onValueChange={(value) => setFormData({ ...formData, rewardType: value as 'points' | 'cashback' | 'miles' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Points</SelectItem>
                  <SelectItem value="cashback">Cashback</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="baseRewardRate">
                Base Reward Rate (%)
                <span className="text-xs text-muted-foreground ml-1">
                  {formData.rewardType === 'cashback' ? 'Cashback %' : 'Points per ₹100'}
                </span>
              </Label>
              <Input
                id="baseRewardRate"
                type="number"
                step="0.1"
                value={formData.baseRewardRate || 0}
                onChange={(e) => setFormData({ ...formData, baseRewardRate: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          {formData.rewardType === 'points' && (
            <div>
              <Label htmlFor="pointValueInr">Point Value (₹)</Label>
              <Input
                id="pointValueInr"
                type="number"
                step="0.01"
                value={formData.pointValueInr || 0}
                onChange={(e) => setFormData({ ...formData, pointValueInr: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          )}

          <div>
            <Label htmlFor="currentPoints">Current Points Balance</Label>
            <Input
              id="currentPoints"
              type="number"
              value={formData.currentPoints || 0}
              onChange={(e) => setFormData({ ...formData, currentPoints: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

          <div>
            <Label>Category-specific Rewards</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Category (e.g., dining)"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <Input
                placeholder="Rate %"
                type="number"
                step="0.1"
                value={categoryRate}
                onChange={(e) => setCategoryRate(e.target.value)}
              />
              <Button type="button" onClick={handleAddCategory}>
                Add
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {Object.entries(formData.categoryRewards || {}).map(([category, rate]) => (
                <div key={category} className="flex justify-between items-center p-2 bg-secondary rounded">
                  <span className="capitalize">{category}: {rate}%</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            <Info className="inline h-4 w-4 mr-1" />
            Select the features available with your card
          </div>
          
          <div className="space-y-3">
            {[
              { key: 'loungeAccess', label: 'Airport Lounge Access' },
              { key: 'concierge', label: 'Concierge Service' },
              { key: 'golfAccess', label: 'Golf Course Access' },
              { key: 'insuranceCover', label: 'Insurance Coverage' },
              { key: 'fuelSurchargeWaiver', label: 'Fuel Surcharge Waiver' },
              { key: 'noForexMarkup', label: 'No Forex Markup' },
              { key: 'priorityPass', label: 'Priority Pass' },
              { key: 'meetGreet', label: 'Meet & Greet Service' },
            ].map((feature) => (
              <div key={feature.key} className="flex items-center justify-between">
                <Label htmlFor={feature.key} className="cursor-pointer">
                  {feature.label}
                </Label>
                <Switch
                  id={feature.key}
                  checked={formData.features?.[feature.key] || false}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      features: {
                        ...formData.features,
                        [feature.key]: checked,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">Add Card</Button>
      </div>
    </form>
  );
}
