'use client';

import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function AuthSimplePage() {
  const { loginWithRedirect } = useAuth0();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSocialLogin = (connection: 'google-oauth2' | 'windowslive') => {
    loginWithRedirect({
      authorizationParams: {
        connection,
      },
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
      loginWithRedirect({
        authorizationParams: {
          connection: 'Username-Password-Authentication',
          login_hint: email,
        },
      });
    } else {
      // Handle signup
      loginWithRedirect({
        authorizationParams: {
          connection: 'Username-Password-Authentication',
          screen_hint: 'signup',
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">DealMate</h1>
            <p className="text-gray-300">Your Smart Shopping Assistant</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google-oauth2')}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>🌐</span>
              <span>Continue with Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin('windowslive')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>🔷</span>
              <span>Continue with Microsoft</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-3">What you get with DealMate:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                AI-Powered Deals
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs">
                Real-time Alerts
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                Price Tracking
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
