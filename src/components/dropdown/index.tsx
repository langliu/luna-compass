import { clsx } from 'clsx'
import type { PropsWithChildren, ReactNode } from 'react'

type DropdownProps = PropsWithChildren & {
  className?: string
  menu?: {
    key: string | number
    label: ReactNode
    disabled?: boolean
    icon?: ReactNode
  }[]
  /** 触发方式：默认点击触发 */
  trigger?: 'click' | 'hover'
}

export const Dropdown = ({ trigger = 'click', className, children, menu = [] }: DropdownProps) => {
  return (
    <div
      className={clsx('dropdown', className, {
        'dropdown-hover': trigger === 'hover',
      })}
    >
      <div tabIndex={0} role='button' className='btn m-1'>
        {children}
      </div>
      <div
        tabIndex={0}
        className='menu dropdown-content z-1 w-52 rounded-box bg-base-100 p-2 shadow-sm'
      >
        {menu?.map(({ key, label }, index) => (
          <li key={key}>
            <div>{label}</div>
          </li>
        ))}
      </div>
    </div>
  )
}
