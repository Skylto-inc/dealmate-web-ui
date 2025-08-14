import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  center?: boolean
}

const maxWidthClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm', 
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  sm: 'px-2 xs:px-3 sm:px-4',
  md: 'px-3 xs:px-4 sm:px-6 lg:px-8',
  lg: 'px-4 xs:px-6 sm:px-8 lg:px-12',
  xl: 'px-6 xs:px-8 sm:px-12 lg:px-16',
}

export function ResponsiveContainer({
  children,
  maxWidth = '4xl',
  padding = 'md',
  center = true,
  className,
  ...props
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
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
  gap?: 'sm' | 'md' | 'lg' | 'xl'
}

const gapClasses = {
  sm: 'gap-2 xs:gap-3',
  md: 'gap-3 xs:gap-4 sm:gap-6',
  lg: 'gap-4 xs:gap-6 sm:gap-8',
  xl: 'gap-6 xs:gap-8 sm:gap-12',
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, sm: 2, lg: 3, xl: 4 },
  gap = 'md',
  className,
  ...props
}: ResponsiveGridProps) {
  const gridClasses = []
  
  if (cols.default) gridClasses.push(`grid-cols-${cols.default}`)
  if (cols.xs) gridClasses.push(`xs:grid-cols-${cols.xs}`)
  if (cols.sm) gridClasses.push(`sm:grid-cols-${cols.sm}`)
  if (cols.md) gridClasses.push(`md:grid-cols-${cols.md}`)
  if (cols.lg) gridClasses.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) gridClasses.push(`xl:grid-cols-${cols.xl}`)
  if (cols['2xl']) gridClasses.push(`2xl:grid-cols-${cols['2xl']}`)

  return (
    <div
      className={cn(
        'grid',
        ...gridClasses,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  responsive?: boolean
}

const responsiveTextClasses = {
  xs: 'text-xs xs:text-sm',
  sm: 'text-sm xs:text-base',
  base: 'text-sm xs:text-base sm:text-lg',
  lg: 'text-base xs:text-lg sm:text-xl',
  xl: 'text-lg xs:text-xl sm:text-2xl',
  '2xl': 'text-xl xs:text-2xl sm:text-3xl',
  '3xl': 'text-2xl xs:text-3xl sm:text-4xl',
  '4xl': 'text-3xl xs:text-4xl sm:text-5xl',
}

const staticTextClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export function ResponsiveText({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  responsive = true,
  className,
  ...props
}: ResponsiveTextProps) {
  return (
    <Component
      className={cn(
        responsive ? responsiveTextClasses[size] : staticTextClasses[size],
        weightClasses[weight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

interface ResponsiveStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: 'row' | 'col'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  responsive?: {
    direction?: 'row' | 'col'
    breakpoint?: 'xs' | 'sm' | 'md' | 'lg'
  }
}

const spacingClasses = {
  row: {
    sm: 'space-x-1 xs:space-x-2',
    md: 'space-x-2 xs:space-x-3 sm:space-x-4',
    lg: 'space-x-3 xs:space-x-4 sm:space-x-6',
    xl: 'space-x-4 xs:space-x-6 sm:space-x-8',
  },
  col: {
    sm: 'space-y-1 xs:space-y-2',
    md: 'space-y-2 xs:space-y-3 sm:space-y-4',
    lg: 'space-y-3 xs:space-y-4 sm:space-y-6',
    xl: 'space-y-4 xs:space-y-6 sm:space-y-8',
  }
}

export function ResponsiveStack({
  children,
  direction = 'col',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  responsive,
  className,
  ...props
}: ResponsiveStackProps) {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col'
  const responsiveClass = responsive 
    ? `${responsive.breakpoint}:${responsive.direction === 'row' ? 'flex-row' : 'flex-col'}`
    : ''
  
  const alignClass = `items-${align}`
  const justifyClass = `justify-${justify}`
  const wrapClass = wrap ? 'flex-wrap' : ''
  
  return (
    <div
      className={cn(
        'flex',
        directionClass,
        responsiveClass,
        alignClass,
        justifyClass,
        wrapClass,
        spacingClasses[direction][spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}