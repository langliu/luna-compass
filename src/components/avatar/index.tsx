import './index.css'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'

export type AvatarSize = 'large' | 'small' | 'default'

export type AvatarProps = {
  className?: string
  style?: React.CSSProperties
  src?: string
  size?: AvatarSize
}
type AvatarVariants = Required<Pick<AvatarProps, 'size'>>

const avatar = cva('avatar', {
  variants: {
    size: {
      large: 'lc-avatar-large',
      small: 'lc-avatar-small',
      default: 'lc-avatar-default',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export function Avatar(props: AvatarProps) {
  const { className, style, src, size } = props
  return (
    <img
      className={clsx(avatar({ size }), className)}
      style={style}
      src={src}
      alt="avatar"
    />
  )
}
