import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Space } from '../src/components/space';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Space',
  component: Space,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
    warp: { control: 'boolean' },
    size: { control: 'select', options: ['small', 'middle', 'large'] },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    size: 'small',
    warp: false,
  },
  render: (args) => (
    <Space {...args}>
      <div style={{ width: 100, height: 100, backgroundColor: 'red' }} />
      <div style={{ width: 100, height: 100, backgroundColor: 'green' }} />
      <div style={{ width: 100, height: 100, backgroundColor: 'blue' }} />
    </Space>
  ),
};

export const Middle: Story = {
  args: {
    size: 'middle',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};
