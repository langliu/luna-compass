import type { FC } from 'react'
import { useState } from 'react'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'

export type AvatarProps = {
  /** 头像的大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 头像的形状 */
  shape?: 'square' | 'rounded'
  /** 头像的图片地址 */
  src?: string
  /** 头像的文本内容 */
  text?: string
  /** 头像的边框 */
  className?: string
  /** 头像的边框 */
  ring?: boolean
  /** 头像的状态 */
  indicator?: 'online' | 'offline'
  /** 头像的占位符 */
  placeholder?: string
}

const avatarVariants = cva('', {
  variants: {
    size: {
      sm: 'w-8',
      md: 'w-16',
      lg: 'w-20',
      xl: 'w-32',
    },
    shape: {
      rounded: 'rounded-xl',
      square: 'rounded-full',
    },
    ring: {
      true: 'ring ring-primary ring-offset-2 ring-offset-base-100',
    },
    indicator: {
      online: 'avatar-online',
      offline: 'avatar-offline',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'rounded',
  },
})

export const Avatar: FC<AvatarProps> = ({
  size = 'md',
  src,
  shape = 'rounded',
  ring,
  indicator,
  className,
  placeholder,
}) => {
  const [hasError, setHasError] = useState(false)

  const showPlaceholder = !src || hasError

  return (
    <div
      className={clsx('avatar', {
        'avatar-placeholder': showPlaceholder,
      })}
    >
      <div
        className={clsx(avatarVariants({ className, size, shape, ring, indicator }), {
          'bg-neutral text-neutral-content': showPlaceholder,
        })}
      >
        {showPlaceholder ? (
          <span
            className={clsx({
              'text-3xl': size === 'xl',
              'text-xl': size === 'lg',
              'text-xs': size === 'sm',
            })}
          >
            {placeholder || 'A'}
          </span>
        ) : (
          <img src={src} alt={'avatar'} onError={() => setHasError(true)} />
        )}
      </div>
    </div>
  )
}
