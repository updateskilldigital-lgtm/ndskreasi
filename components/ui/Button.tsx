import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

const variantClasses = {
  primary:   'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-primary text-white hover:bg-primary-light',
  outline:   'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost:     'text-primary hover:bg-background-alt',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading, fullWidth, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          rounded-lg font-semibold transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          inline-flex items-center justify-center
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading...
          </>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
