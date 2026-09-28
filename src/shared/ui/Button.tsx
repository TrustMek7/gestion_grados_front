import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variants = {
  primary: 'border-brand bg-brand text-white hover:border-brand-hover hover:bg-brand-hover',
  secondary: 'border-outline bg-white text-ink hover:border-brand hover:bg-brand-soft/40',
  ghost: 'border-transparent bg-transparent text-muted hover:bg-brand-soft hover:text-brand',
}

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props} />
  )
}
