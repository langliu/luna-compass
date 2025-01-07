import type { StoryObj } from '@storybook/react'
import { size } from 'lodash-es'
import { Progress, type ProgressProps } from './index'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  argTypes: {
    percent: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    status: {
      control: {
        type: 'select',
        options: ['active', 'exception'],
      },
    },
    showInfo: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['default', 'small'],
      },
    },
  },
}

export default meta

export type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    percent: 50,
    status: 'active',
    showInfo: true,
    size: 'default',
  },
}

const Template = (args: ProgressProps) => <Progress {...args} />

export const Exception: Story = {
  render: Template,
  args: {
    percent: 50,
    status: 'exception',
    showInfo: true,
  },
}

export const WithoutInfo: Story = {
  render: Template,
  args: {
    percent: 50,
    status: 'active',
    showInfo: false,
  },
}
