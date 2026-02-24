import React from 'react';
import { cn } from '../lib/utils';

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
      outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-900',
      ghost: 'hover:bg-slate-100 text-slate-600',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

export const Card = ({ className, children, style, onClick }: { className?: string; children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) => (
  <div 
    style={style} 
    onClick={onClick}
    className={cn('bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden', className, onClick && 'cursor-pointer')}
  >
    {children}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
