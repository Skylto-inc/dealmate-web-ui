'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Percent, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  DollarSign
} from 'lucide-react';

interface PartnershipFormData {
  businessName: string;
  website: string;
  contactEmail: string;
  contactName: string;
  phone: string;
  businessType: string;
  monthlyRevenue: string;
  cashbackRate: string;
  description: string;
  averageOrderValue: string;
  monthlyOrders: string;
}

export default function CashbackPartnershipsPage() {
  const [formData, setFormData] = useState<PartnershipFormData>({
    businessName: '',
    website: '',
    contactEmail: '',
    contactName: '',
    phone: '',
    businessType: '',
    monthlyRevenue: '',
    cashbackRate: '',
    description: '',
    averageOrderValue: '',
    monthlyOrders: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const businessTypes = [
    'E-commerce',
    'Fashion & Apparel',
    'Electronics',
    'Home & Garden',
    'Travel & Hospitality',
    'Food & Beverage',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Software & Services',
    'Other'
  ];

  const handleInputChange = (field: keyof PartnershipFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit partnership application
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setSubmitSuccess(true);
      setFormData({
        businessName: '',
        website: '',
        contactEmail: '',
        contactName: '',
        phone: '',
        businessType: '',
        monthlyRevenue: '',
        cashbackRate: '',
        description: '',
        averageOrderValue: '',
        monthlyOrders: ''
      });
    } catch (error) {
      console.error('Partnership application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Access to 100K+ Active Users',
      description: 'Reach our growing community of deal-conscious shoppers'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Real-time dashboard with conversion metrics and ROI tracking'
    },
    {
      icon: Target,
      title: 'Targeted Promotion',
      description: 'AI-powered user matching for better conversion rates'
    },
    {
      icon: Globe,
      title: 'Multi-Platform Integration',
      description: 'Browser extension, mobile app, and web platform coverage'
    }
  ];

  const benefits = [
    'Increase customer acquisition by 25-40%',
    'No upfront costs - pay only for successful referrals',
    'Real-time tracking and analytics',
    'Dedicated account management',
    'Custom integration support',
    'Cross-promotion opportunities'
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Thank you for your interest in partnering with DealMate. Our business development team will review your application and contact you within 2-3 business days.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">1</div>
                <span>Application review (1-2 business days)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">2</div>
                <span>Initial consultation call</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">3</div>
                <span>Integration setup and testing</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">4</div>
                <span>Go live and start earning!</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setSubmitSuccess(false)} 
            className="mt-6"
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Partner with <span className="text-blue-600">DealMate</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our cashback network and reach millions of deal-savvy shoppers. 
            Increase your sales with performance-based marketing.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              4.8/5 Partner Satisfaction
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2" />
              $2M+ Partner Earnings
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              500+ Active Partners
            </Badge>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Partner with DealMate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Partner Benefits
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Success Story</h3>
              <blockquote className="text-lg italic mb-4">
                "DealMate increased our customer acquisition by 35% in just 3 months. 
                The quality of traffic is exceptional, and the analytics help us optimize our offers."
              </blockquote>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-blue-200">Marketing Director, TechStyle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Partnership Application</CardTitle>
              <CardDescription>
                Fill out the form below to start your partnership with DealMate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        required
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website URL *</Label>
                      <Input
                        id="website"
                        type="url"
                        required
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="monthlyRevenue">Monthly Revenue Range</Label>
                      <Select value={formData.monthlyRevenue} onValueChange={(value) => handleInputChange('monthlyRevenue', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-10k">$0 - $10,000</SelectItem>
                          <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                          <SelectItem value="500k+">$500,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        required
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="contact@yourbusiness.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Partnership Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Percent className="w-5 h-5 mr-2" />
                    Partnership Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cashbackRate">Proposed Cashback Rate (%)</Label>
                      <Input
                        id="cashbackRate"
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        value={formData.cashbackRate}
                        onChange={(e) => handleInputChange('cashbackRate', e.target.value)}
                        placeholder="e.g., 2.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="averageOrderValue">Average Order Value ($)</Label>
                      <Input
                        id="averageOrderValue"
                        type="number"
                        min="0"
                        value={formData.averageOrderValue}
                        onChange={(e) => handleInputChange('averageOrderValue', e.target.value)}
                        placeholder="e.g., 75"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="monthlyOrders">Monthly Order Volume</Label>
                      <Select value={formData.monthlyOrders} onValueChange={(value) => handleInputChange('monthlyOrders', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select order volume range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-100">0 - 100 orders</SelectItem>
                          <SelectItem value="100-500">100 - 500 orders</SelectItem>
                          <SelectItem value="500-1000">500 - 1,000 orders</SelectItem>
                          <SelectItem value="1000-5000">1,000 - 5,000 orders</SelectItem>
                          <SelectItem value="5000+">5,000+ orders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Tell us about your business, target audience, and why you'd like to partner with DealMate..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {submitSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Application submitted successfully! We'll contact you within 2-3 business days.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">
                    * Required fields
                  </p>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
