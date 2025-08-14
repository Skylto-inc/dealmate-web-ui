"use client";

import React from "react";
import { AnimatedLoader } from '@/components/ui/animated-loader';

interface AppLoadingScreenProps {
  title?: string;
  size?: "sm" | "md" | "lg";
  loadingText?: string;
  words?: string[];
}

// Reusable full-screen loading component with DealMate branding
export function AppLoadingScreen({
  title = "DealMate",
  size = "lg",
  loadingText,
  words
}: AppLoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-white text-center space-y-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {title}
        </h1>
        {/* @ts-ignore */}
        <AnimatedLoader 
          size={size} 
          loadingText={loadingText}
          words={words}
        />
      </div>
    </div>
  );
}

// Quick shortcuts for common loading screens
export const DefaultAppLoader = () => <AppLoadingScreen />;
export const AuthAppLoader = () => <AppLoadingScreen loadingText="authenticating" words={["account", "profile", "settings", "data", "account"]} />;
export const DashboardAppLoader = () => <AppLoadingScreen loadingText="loading" words={["dashboard", "deals", "offers", "savings", "dashboard"]} />;
