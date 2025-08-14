'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Share2, 
  Copy, 
  Check,
  Gift,
  TrendingUp,
  Star,
  MessageCircle,
  Mail,
  ChevronRight,
  Trophy,
  Target,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ReferralStats {
  totalReferred: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
  thisMonthEarned: number;
}

interface ReferralMilestone {
  referrals: number;
  reward: string;
  achieved: boolean;
  icon: React.ReactNode;
}

export default function ReferAndEarn() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = 'DEALMATE2025';
  const referralLink = 'https://dealmate.app/invite/DEALMATE2025';

  const stats: ReferralStats = {
    totalReferred: 23,
    successfulReferrals: 18,
    pendingReferrals: 5,
    totalEarned: 4500,
    thisMonthEarned: 750
  };

  const milestones: ReferralMilestone[] = [
    { referrals: 5, reward: '₹500 Bonus', achieved: true, icon: <Star className="h-4 w-4" /> },
    { referrals: 10, reward: '₹1,000 + Gold Status', achieved: true, icon: <Trophy className="h-4 w-4" /> },
    { referrals: 25, reward: '₹2,500 + Platinum Status', achieved: false, icon: <Target className="h-4 w-4" /> },
    { referrals: 50, reward: '₹5,000 + VIP Benefits', achieved: false, icon: <Zap className="h-4 w-4" /> }
  ];

  const referralBenefits = [
    {
      title: 'You Get',
      amount: '₹250',
      description: 'When your friend makes their first purchase',
      icon: <Gift className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Friend Gets',
      amount: '₹100',
      description: 'Instant cashback on signup',
      icon: <Users className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const nextMilestone = milestones.find(m => !m.achieved);
  const progressToNext = nextMilestone 
    ? (stats.successfulReferrals / nextMilestone.referrals) * 100
    : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Refer & Earn
        </CardTitle>
        <CardDescription>
          Invite friends and earn cashback rewards together
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Total Referred</p>
            <p className="text-2xl font-bold">{stats.totalReferred}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Successful</p>
            <p className="text-2xl font-bold text-green-600">{stats.successfulReferrals}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold">₹{stats.totalEarned}</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-blue-600">₹{stats.thisMonthEarned}</p>
          </div>
        </div>

        {/* Referral Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {referralBenefits.map((benefit, index) => (
            <div key={index} className={`p-4 rounded-lg bg-gradient-to-r ${benefit.color} text-white`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  {benefit.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{benefit.title}</p>
                  <p className="text-2xl font-bold">{benefit.amount}</p>
                </div>
              </div>
              <p className="text-sm text-white/80">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Referral Code & Link */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono font-semibold text-lg">
                {referralCode}
              </div>
              <Button onClick={handleCopyCode} variant="outline">
                {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedCode ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Referral Link</label>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Share via</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" className="justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" className="justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" className="justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              More
            </Button>
          </div>
        </div>

        {/* Referral Milestones */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Referral Milestones</h4>
          
          {nextMilestone && (
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Next Milestone</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  {nextMilestone.referrals - stats.successfulReferrals} more to go
                </Badge>
              </div>
              <Progress value={progressToNext} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                Refer {nextMilestone.referrals - stats.successfulReferrals} more friends to earn {nextMilestone.reward}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${
                  milestone.achieved ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      milestone.achieved 
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                        : 'bg-muted'
                    }`}>
                      {milestone.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {milestone.referrals} Referrals
                      </p>
                      <p className="text-xs text-muted-foreground">{milestone.reward}</p>
                    </div>
                  </div>
                  {milestone.achieved ? (
                    <Badge className="bg-green-500 text-white">Achieved</Badge>
                  ) : (
                    <Badge variant="secondary">Locked</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Referrals */}
        {stats.pendingReferrals > 0 && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {stats.pendingReferrals} Pending Referrals
              </p>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Your friends have signed up but haven't made their first purchase yet. 
              Remind them to shop and unlock your rewards!
            </p>
          </div>
        )}

        {/* CTA */}
        <Button className="w-full" size="lg">
          Invite More Friends
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
