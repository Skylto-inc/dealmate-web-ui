'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './auth-styles.css';

export default function AuthContainer() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  
  const isLogin = searchParams?.get('form') !== 'signup';
  const error = searchParams?.get('error');

  const handleRedirect = useCallback(() => {
    if (isAuthenticated && user) {
      window.location.href = '/home';
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  const handleAuth0Login = async (connection?: string) => {
    try {
      setLoading(`auth0-${connection || 'email'}`);
      await loginWithRedirect({
        authorizationParams: {
          connection,
          screen_hint: 'login'
        }
      });
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to redirect to authentication provider.',
        variant: 'destructive',
      });
      setLoading(null);
    }
  };

  const handleAuth0Signup = async (connection?: string) => {
    try {
      setLoading(`auth0-signup-${connection || 'email'}`);
      await loginWithRedirect({
        authorizationParams: {
          connection,
          screen_hint: 'signup'
        }
      });
    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: 'Failed to redirect to authentication provider.',
        variant: 'destructive',
      });
      setLoading(null);
    }
  };

  // Show loading state while Auth0 is processing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Zap className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">DealMate</h1>
          </div>
          <p className="text-gray-300">Your AI-powered shopping companion</p>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error === 'authentication_failed' && 'Authentication failed. Please try again.'}
              {error === 'missing_code' && 'Invalid authentication request. Please try again.'}
              {error === 'access_denied' && 'Access was denied. Please try again.'}
              {!['authentication_failed', 'missing_code', 'access_denied'].includes(error) && 
                'An error occurred during authentication.'}
            </AlertDescription>
          </Alert>
        )}

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin 
                ? 'Sign in to access your personalized deals' 
                : 'Join thousands finding amazing deals'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Custom Auth Forms */}
            <Tabs value={isLogin ? 'login' : 'signup'} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-white/20 text-white"
                  onClick={() => window.history.replaceState({}, '', '/auth?form=login')}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-white/20 text-white"
                  onClick={() => window.history.replaceState({}, '', '/auth?form=signup')}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <SignUpForm />
              </TabsContent>
            </Tabs>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="space-y-3">
              <Button
                onClick={() => {
                  toast({
                    title: 'Configuration Required',
                    description: 'Google sign-in needs Auth0 callback URLs to be configured. Please contact support.',
                    variant: 'destructive',
                  });
                }}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 hover:text-gray-900 border-0"
                variant="outline"
              >
                <img src="/google-logo.svg" alt="Google" className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>

              <Button
                onClick={() => {
                  toast({
                    title: 'Configuration Required',
                    description: 'Microsoft sign-in needs Auth0 callback URLs to be configured. Please contact support.',
                    variant: 'destructive',
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-white/20"
                variant="outline"
              >
                <img src="/microsoft-logo.svg" alt="Microsoft" className="h-4 w-4 mr-2" />
                Continue with Microsoft
              </Button>
            </div>
            {/* Social login options will be available once configured */}
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-purple-400 hover:text-purple-300 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
