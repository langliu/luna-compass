import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './index'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    shape: {
      control: { type: 'radio' },
      options: ['rounded', 'square'],
    },
    src: {
      control: { type: 'text' },
      description: '图片地址或base64',
    },
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Primary: Story = {
  args: {
    size: 'md',
    shape: 'rounded',
    src: 'https://picsum.photos/200',
  },
}

export const Small: Story = {
  args: {
    ...Primary.args,
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    ...Primary.args,
    size: 'lg',
  },
}

export const Square: Story = {
  args: {
    ...Primary.args,
    shape: 'square',
  },
}

export const WithCustomImage: Story = {
  args: {
    ...Primary.args,
    src: 'https://picsum.photos/200?grayscale',
  },
}

export const Ring: Story = {
  args: {
    ...Primary.args,
    ring: true,
  },
}

export const Indicator: Story = {
  args: {
    ...Primary.args,
    indicator: 'online',
  },
}

export const Placeholder: Story = {
  args: {
    ...Primary.args,
    src: '',
    placeholder: 'Ja',
  },
}
