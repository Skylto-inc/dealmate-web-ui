'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { useScreenSize } from "@/hooks/use-mobile"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const { isMobile, isTablet, isDesktop, isTouch } = useScreenSize()

  return (
    <div 
      className={cn(
        "min-h-screen-safe w-full",
        "safe-area-inset-all",
        // Mobile-first responsive padding
        "px-3 xs:px-4 sm:px-6 lg:px-8",
        "py-3 xs:py-4 sm:py-6",
        // Touch-friendly spacing
        isTouch && "space-y-4",
        className
      )}
      data-mobile={isMobile}
      data-tablet={isTablet}
      data-desktop={isDesktop}
      data-touch={isTouch}
    >
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-4 xs:mb-6 sm:mb-8", className)}>
      <div className="glass-card p-3 xs:p-4 sm:p-6">
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs xs:text-sm sm:text-base text-muted-foreground/80 mt-1 xs:mt-2">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CardGridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  className?: string
}

export function CardGrid({ 
  children, 
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  className 
}: CardGridProps) {
  const gridClasses = []
  
  if (cols.default) gridClasses.push(`grid-cols-${cols.default}`)
  if (cols.xs) gridClasses.push(`xs:grid-cols-${cols.xs}`)
  if (cols.sm) gridClasses.push(`sm:grid-cols-${cols.sm}`)
  if (cols.md) gridClasses.push(`md:grid-cols-${cols.md}`)
  if (cols.lg) gridClasses.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) gridClasses.push(`xl:grid-cols-${cols.xl}`)
  if (cols['2xl']) gridClasses.push(`2xl:grid-cols-${cols['2xl']}`)

  return (
    <div className={cn(
      "grid gap-3 xs:gap-4 sm:gap-6",
      ...gridClasses,
      className
    )}>
      {children}
    </div>
  )
}

interface MobileOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export function MobileOptimizedButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className,
  disabled,
  ...props
}: MobileOptimizedButtonProps) {
  const baseClasses = "touch-target transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-primary/40",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[40px]",
    md: "px-4 py-3 text-base min-h-[44px]",
    lg: "px-6 py-4 text-lg min-h-[48px]"
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide'
  objectFit?: 'cover' | 'contain' | 'fill'
  priority?: boolean
}

export function ResponsiveImage({
  src,
  alt,
  aspectRatio = 'photo',
  objectFit = 'cover',
  priority = false,
  className,
  ...props
}: ResponsiveImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]',
    wide: 'aspect-[16/9]'
  }
  
  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill'
  }
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg",
      aspectClasses[aspectRatio]
    )}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full transition-transform duration-300 hover:scale-105",
          objectFitClasses[objectFit],
          className
        )}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  count?: number
  type?: 'card' | 'text' | 'image' | 'button'
}

export function LoadingSkeleton({ 
  className, 
  count = 1, 
  type = 'card' 
}: LoadingSkeletonProps) {
  const skeletonTypes = {
    card: (
      <div className="glass-card p-3 xs:p-4 sm:p-6 animate-pulse">
        <div className="h-20 xs:h-24 sm:h-32 bg-muted/20 rounded-md mb-3 xs:mb-4"></div>
        <div className="space-y-2 xs:space-y-3">
          <div className="h-3 xs:h-4 bg-muted/20 rounded w-3/4"></div>
          <div className="h-2 xs:h-3 bg-muted/20 rounded w-1/2"></div>
          <div className="h-2 xs:h-3 bg-muted/20 rounded w-1/3"></div>
        </div>
      </div>
    ),
    text: (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted/20 rounded w-3/4"></div>
        <div className="h-4 bg-muted/20 rounded w-1/2"></div>
      </div>
    ),
    image: (
      <div className="animate-pulse">
        <div className="h-32 xs:h-40 sm:h-48 bg-muted/20 rounded-lg"></div>
      </div>
    ),
    button: (
      <div className="animate-pulse">
        <div className="h-10 xs:h-12 bg-muted/20 rounded-lg w-full"></div>
      </div>
    )
  }
  
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          {skeletonTypes[type]}
        </div>
      ))}
    </div>
  )
}