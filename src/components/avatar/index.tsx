import type { FC } from 'react'
import { cva } from 'class-variance-authority'

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
  },
  defaultVariants: {
    size: 'md',
    shape: 'rounded',
  },
})

export const Avatar: FC<AvatarProps> = ({ size = 'md', src, shape = 'rounded', className }) => {
  return (
    <div className='avatar'>
      <div className={avatarVariants({ className, size })}>
        <img src={src} alt={'avatar'} />
      </div>
    </div>
  )
}
