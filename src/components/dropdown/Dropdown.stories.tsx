import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './index'

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Basic: Story = {
  args: {
    children: 'Hover Me',
    menu: [
      { key: 1, label: 'Menu Item 1' },
      { key: 2, label: 'Menu Item 2' },
      { key: 3, label: 'Menu Item 3' },
    ],
    trigger: 'click',
  },
}

export const WithDisabledItems: Story = {
  args: {
    ...Basic.args,
    menu: [
      { key: 1, label: 'Active Item' },
      { key: 2, label: 'Disabled Item', disabled: true },
      { key: 3, label: 'Another Active' },
    ],
  },
}

export const WithIcons: Story = {
  args: {
    ...Basic.args,
    menu: [
      { key: 1, label: 'Edit', icon: '✏️' },
      { key: 2, label: 'Delete', icon: '🗑️' },
      { key: 3, label: 'Share', icon: '📤' },
    ],
  },
}
