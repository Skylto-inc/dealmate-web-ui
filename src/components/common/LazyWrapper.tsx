'use client';

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { AuthLoader } from '@/components/ui/animated-loader';

interface LazyWrapperProps {
  fallback?: ReactNode;
  className?: string;
}

// Generic lazy wrapper with intersection observer for viewport-based loading
export function LazyWrapper({ 
  children, 
  fallback = <AuthLoader size="sm" />,
  className = "" 
}: LazyWrapperProps & { children: ReactNode }) {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P = {}>(
  ComponentToLoad: ComponentType<P>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: ComponentToLoad }));
  
  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <AuthLoader size="sm" />}>
        <LazyComponent {...props as any} />
      </Suspense>
    );
  };
}

// Intersection Observer based lazy loading
export function LazyViewport({ 
  children, 
  fallback = <AuthLoader size="sm" />,
  rootMargin = '100px',
  className = ""
}: LazyWrapperProps & { 
  children: ReactNode;
  rootMargin?: string;
}) {
  return (
    <IntersectionObserverWrapper rootMargin={rootMargin}>
      <LazyWrapper fallback={fallback} className={className}>
        {children}
      </LazyWrapper>
    </IntersectionObserverWrapper>
  );
}

// Intersection Observer wrapper component
function IntersectionObserverWrapper({ 
  children, 
  rootMargin = '100px' 
}: { 
  children: ReactNode;
  rootMargin?: string;
}) {
  return (
    <div 
      className="lazy-load-trigger" 
      style={{ 
        minHeight: '1px',
        // Will be enhanced with actual intersection observer logic in production
      }}
    >
      {children}
    </div>
  );
}

export default LazyWrapper;
