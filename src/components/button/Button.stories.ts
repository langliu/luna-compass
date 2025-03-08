import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './index'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary', 'neutral', 'secondary', 'accent', 'info', 'success', 'warning', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'lg', 'xl'],
    },
    soft: { control: 'boolean' },
    outline: { control: 'boolean' },
    dash: { control: 'boolean' },
    ghost: { control: 'boolean' },
    link: { control: 'boolean' },
    block: { control: 'boolean' },
  },
  args: {
    color: 'primary',
    size: 'sm',
    children: 'Button',
  },
}

export default meta

type Story = StoryObj<typeof Button>

// 基础按钮
export const Primary: Story = {}

// 颜色变体
export const Neutral: Story = { args: { color: 'neutral' } }
export const Secondary: Story = { args: { color: 'secondary' } }
export const Accent: Story = { args: { color: 'accent' } }

// 尺寸变体
export const ExtraSmall: Story = { args: { size: 'xs' } }
export const Large: Story = { args: { size: 'lg' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }

// 样式组合
export const OutlineGhost: Story = {
  args: {
    outline: true,
    ghost: true,
  },
}

export const SoftBlock: Story = {
  args: {
    soft: true,
    block: true,
  },
}

export const LinkButton: Story = {
  args: {
    link: true,
    children: 'Link Style',
  },
}

export const DashWarning: Story = {
  args: {
    dash: true,
    color: 'warning',
  },
}

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
