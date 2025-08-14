"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedLoader } from "./animated-loader";

interface LoadingOverlayProps {
  isLoading: boolean;
  loadingText?: string;
  words?: string[];
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

// Full screen loading overlay that appears over content
export function LoadingOverlay({
  isLoading,
  loadingText = "loading",
  words,
  size = "md",
  children,
  className,
  overlayClassName
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
            overlayClassName
          )}
        >
          {/* @ts-ignore */}
          <AnimatedLoader
            loadingText={loadingText}
            words={words}
            size={size}
          />
        </div>
      )}
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  loadingText?: string;
  words?: string[];
  size?: "sm" | "md" | "lg";
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Conditional rendering based on loading/error states
export function LoadingState({
  isLoading,
  error,
  loadingText = "loading",
  words,
  size = "md",
  loadingComponent,
  errorComponent,
  children,
  className
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        {loadingComponent || (
          // @ts-ignore
          <AnimatedLoader
            loadingText={loadingText}
            words={words}
            size={size}
          />
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        {errorComponent || (
          <div className="text-center text-destructive">
            <p className="text-lg font-semibold">Something went wrong</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

interface AsyncComponentProps<T> {
  asyncFunction: () => Promise<T>;
  loadingText?: string;
  words?: string[];
  size?: "sm" | "md" | "lg";
  children: (data: T) => React.ReactNode;
  errorFallback?: (error: Error) => React.ReactNode;
  className?: string;
}

// Component that handles async operations with loading states
export function AsyncComponent<T>({
  asyncFunction,
  loadingText = "loading",
  words,
  size = "md",
  children,
  errorFallback,
  className
}: AsyncComponentProps<T>) {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFunction();
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [asyncFunction]);

  return (
    <LoadingState
      isLoading={isLoading}
      error={error?.message}
      loadingText={loadingText}
      words={words}
      size={size}
      errorComponent={errorFallback ? errorFallback(error!) : undefined}
      className={className}
    >
      {data && children(data)}
    </LoadingState>
  );
}

// Hook for managing loading states
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const withLoading = React.useCallback(async (fn: () => Promise<any>): Promise<any> => {
    setIsLoading(true);
    try {
      const result = await fn();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    withLoading
  };
}

// Simple spinner component for inline use
export function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary/30 border-t-primary", sizeClasses[size], className)} />
  );
}
