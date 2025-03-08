import { type VariantProps, cva } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import '../../styles/base.css'

const buttonVariants = cva('btn', {
  variants: {
    color: {
      primary: 'btn-primary',
      neutral: 'btn-neutral',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      info: 'btn-info',
      success: 'btn-success',
      warning: 'btn-warning',
      error: 'btn-error',
    },
    size: {
      xs: 'btn-xs',
      sm: 'btn-sm',
      lg: 'btn-lg',
      xl: 'btn-xl',
    },
    soft: {
      true: 'btn-soft',
    },
    outline: {
      true: 'btn-outline',
    },
    dash: {
      true: 'btn-dash',
    },
    ghost: {
      true: 'btn-ghost',
    },
    link: {
      true: 'btn-link',
    },
    block: {
      true: 'btn-block',
    },
  },
  defaultVariants: {},
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = ({
  className,
  color,
  soft,
  outline,
  dash,
  size,
  link,
  ghost,
  children,
  block,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={buttonVariants({ color, size, soft, link, ghost, outline, dash, className })}
      {...props}
    >
      {children}
    </button>
  )
}
