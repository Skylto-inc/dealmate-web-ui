"use client";

import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2, Sparkles, Gift, Zap, Coins, TicketPercent } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Reward {
  id: string;
  type: 'coupon' | 'cashback' | 'points' | 'voucher' | 'exclusive' | 'jackpot';
  title: string;
  value: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface PackOpeningModalProps {
  pack: any;
  isOpen: boolean;
  onClose: () => void;
  onRewardsRevealed: (rewards: Reward[]) => void;
}

// Mock reward generation
const generateRewards = (pack: any): Reward[] => {
  const rewardCount = Math.floor(Math.random() * (pack.rewards.max - pack.rewards.min + 1)) + pack.rewards.min;
  const rewards: Reward[] = [];

  const rewardTemplates = {
    coupon: [
      { title: 'Amazon 10% OFF', value: '10% OFF', description: 'Valid on electronics', rarity: 'common' },
      { title: 'Flipkart ₹200 OFF', value: '₹200 OFF', description: 'Min order ₹1000', rarity: 'rare' },
      { title: 'Myntra 25% OFF', value: '25% OFF', description: 'Fashion & lifestyle', rarity: 'epic' }
    ],
    cashback: [
      { title: 'Paytm Cashback', value: '5% CB', description: 'Max ₹100', rarity: 'common' },
      { title: 'PhonePe Cashback', value: '₹50 CB', description: 'On first order', rarity: 'rare' },
      { title: 'HDFC Cashback', value: '10% CB', description: 'Credit card only', rarity: 'epic' }
    ],
    points: [
      { title: 'DealCoins', value: '+50', description: 'Use in app', rarity: 'common' },
      { title: 'Bonus Points', value: '+100', description: 'Limited time', rarity: 'rare' },
      { title: 'Mega Points', value: '+500', description: 'Jackpot!', rarity: 'legendary' }
    ],
    voucher: [
      { title: 'Swiggy Voucher', value: '₹100', description: 'Food delivery', rarity: 'rare' },
      { title: 'Uber Credits', value: '₹150', description: 'Ride credits', rarity: 'epic' }
    ],
    exclusive: [
      { title: 'VIP Access', value: 'Early Access', description: 'Sale preview', rarity: 'epic' },
      { title: 'Premium Deal', value: 'Exclusive', description: 'Members only', rarity: 'legendary' }
    ],
    jackpot: [
      { title: 'MEGA JACKPOT', value: '₹5000', description: 'Shopping voucher', rarity: 'legendary' }
    ]
  };

  for (let i = 0; i < rewardCount; i++) {
    const possibleTypes = pack.rewards.possibleTypes;
    const type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    const templates = rewardTemplates[type as keyof typeof rewardTemplates] || rewardTemplates.coupon;
    const template = templates[Math.floor(Math.random() * templates.length)];

    rewards.push({
      id: `${i}`,
      type: type as Reward['type'],
      ...template,
      rarity: template.rarity as Reward['rarity']
    });
  }

  return rewards;
};

const PackOpeningModal: FC<PackOpeningModalProps> = ({
  pack,
  isOpen,
  onClose,
  onRewardsRevealed
}) => {
  const [isOpening, setIsOpening] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Generate rewards when modal opens
      const generatedRewards = generateRewards(pack);
      setRewards(generatedRewards);

      // Start opening animation
      setTimeout(() => {
        setIsOpening(false);
        // Trigger confetti for epic/legendary rewards
        const hasRareReward = generatedRewards.some(r => r.rarity === 'epic' || r.rarity === 'legendary');
        if (hasRareReward) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 3500);

      // Reveal rewards one by one
      const revealInterval = setInterval(() => {
        setRevealedCount(prev => {
          if (prev >= generatedRewards.length - 1) {
            clearInterval(revealInterval);
            // Defer the callback to avoid state update during render
            setTimeout(() => {
              onRewardsRevealed(generatedRewards);
            }, 0);
            return generatedRewards.length;
          }
          return prev + 1;
        });
      }, 600);

      return () => clearInterval(revealInterval);
    }
  }, [isOpen, pack, onRewardsRevealed]);

  const rarityColors = {
    common: 'border-gray-400 bg-gray-400/10',
    rare: 'border-blue-400 bg-blue-400/10',
    epic: 'border-purple-400 bg-purple-400/10',
    legendary: 'border-yellow-400 bg-yellow-400/10 animate-pulse'
  };

  const getRewardIcon = (type: Reward['type']) => {
    switch (type) {
      case 'coupon': return TicketPercent;
      case 'cashback': return Coins;
      case 'points': return Sparkles;
      case 'voucher': return Gift;
      case 'exclusive': return Zap;
      case 'jackpot': return Package2;
      default: return Gift;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="sr-only">Opening Pack Rewards</DialogTitle>
        <div className="text-center py-8">
          {isOpening ? (
            <div className="space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-24 h-24"
              >
                <Package2 className="w-full h-full text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold">Opening {pack.name}...</h2>
              <div className="flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">You got {rewards.length} rewards!</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {rewards.map((reward, index) => {
                    const Icon = getRewardIcon(reward.type);
                    return (
                      <motion.div
                        key={reward.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={index < revealedCount ? { opacity: 1, scale: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={cn(
                          "border-2 rounded-lg p-4 transition-all",
                          rarityColors[reward.rarity],
                          index >= revealedCount && "opacity-0"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-background/50">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold">{reward.title}</h3>
                            <p className="text-lg font-bold text-primary">{reward.value}</p>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                            <Badge variant="outline" className="mt-2">
                              {reward.rarity}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <Button onClick={onClose} className="w-full sm:w-auto">
                Awesome!
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackOpeningModal;
