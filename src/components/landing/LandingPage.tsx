'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  TrendingUp, 
  Shield, 
  Zap,
  ChevronRight,
  Star,
  Users,
  CreditCard
} from 'lucide-react';
import { isFeatureEnabled } from '@/lib/feature-toggles-client';

export default function LandingPage() {
  const router = useRouter();
  const [loginEnabled, setLoginEnabled] = useState(true);

  useEffect(() => {
    const checkLoginFeature = async () => {
      try {
        const enabled = await isFeatureEnabled('Login');
        setLoginEnabled(enabled);
      } catch (error) {
        setLoginEnabled(true);
      }
    };
    checkLoginFeature();
  }, []);

  const handleGetStarted = () => {
    if (loginEnabled) {
      router.push('/auth');
    } else {
      router.replace('/home');
    }
  };

  useEffect(() => {
    if (!loginEnabled) {
      router.replace('/home');
    }
  }, [loginEnabled]);

  const features = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Smart Deal Discovery",
      description: "AI-powered system finds the best deals across multiple platforms"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Price Intelligence",
      description: "Track price history and get alerts when prices drop"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Wallet",
      description: "Safely store your cards and payment methods with bank-level security"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Rewards",
      description: "Earn cashback and rewards on every purchase automatically"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$2M+", label: "Saved by Users" },
    { value: "1000+", label: "Partner Stores" },
    { value: "4.8", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">DealMate</h1>
          </div>
          <Button 
            onClick={handleGetStarted}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Get Started
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Your Smart Shopping
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Companion</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          DealMate uses AI to find the best deals, stack discounts, and maximize your savings across all your favorite stores.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Start Saving Now
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          >
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Everything You Need to Save More
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-purple-500/20"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 backdrop-blur-lg border border-purple-500/20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Trusted by Thousands of Smart Shoppers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          How DealMate Works
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              1
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">
              Browse Normally
            </h4>
            <p className="text-gray-400">
              Shop on your favorite websites as you always do
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              2
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">
              Get Instant Alerts
            </h4>
            <p className="text-gray-400">
              DealMate automatically finds and applies the best deals
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              3
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">
              Save Money
            </h4>
            <p className="text-gray-400">
              Enjoy maximum savings with stacked discounts and cashback
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Saving?
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of smart shoppers who save money on every purchase with DealMate.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Get Started Free
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <ShoppingBag className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-semibold text-white">DealMate</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 DealMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
