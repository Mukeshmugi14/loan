import { ButtonHTMLAttributes, forwardRef, HTMLAttributes, InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Card
export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-dark-900/40 border border-dark-800 rounded-2xl p-6", className)} {...props} />
));
Card.displayName = "Card";

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const baseStyled = "inline-flex items-center justify-center rounded-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-white hover:bg-brand-500 text-black hover:text-white",
    secondary: "bg-dark-800 hover:bg-dark-700 text-white border border-dark-700",
    outline: "border border-dark-700 hover:bg-dark-800 text-dark-50",
    ghost: "hover:bg-dark-800/50 text-dark-300 hover:text-white",
  };
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };
  return <button ref={ref} className={cn(baseStyled, variants[variant], sizes[size], className)} {...props} />;
});
Button.displayName = "Button";

// Input
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("flex h-12 w-full rounded-xl border border-dark-700 bg-dark-900/50 px-4 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors", className)} {...props} />
));
Input.displayName = "Input";
