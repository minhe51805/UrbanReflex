/**
 * Author: Trương Dương Bảo Minh (minhe51805)
 * Create at: 13-11-2025
 * Update at: 01-12-2025
 * Description: Reusable button UI component with multiple variants (primary, secondary, outline) and size options
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/format';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#33a3a1] text-white hover:bg-[#2a8886] focus:ring-[#33a3a1] shadow-md',
    secondary: 'bg-[#e6f8f8] text-[#33a3a1] border border-[#b0e8e6] hover:bg-[#b0e8e6] focus:ring-[#33a3a1]',
    outline: 'bg-transparent text-[#1e64ab] border border-[#1e64ab] hover:bg-[#1e64ab] hover:text-white focus:ring-[#1e64ab]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

