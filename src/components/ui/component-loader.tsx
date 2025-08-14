"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ComponentLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ComponentLoader({ 
  className, 
  size = "md"
}: ComponentLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size])} />
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="h-48 bg-gray-700 rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

// Skeleton loader for text content
export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-700 rounded" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}
