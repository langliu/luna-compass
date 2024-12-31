import type { FC, PropsWithChildren } from 'react'
import { Space } from '..'
import type { Story } from '../Space.stories'

const As: FC<PropsWithChildren<{ name: string }>> = ({ name, children }) => {
  return (
    <div>
      {name}
      {children}
    </div>
  )
}

const ADD = () => {
  return (
    <As name="asd">
      水电费
      <div>wewe</div>
    </As>
  )
}

export const SpaceSize: Story = {
  args: {
    size: 'large',
  },
  tags: ['autodocs'],
  name: '间距大小',
  render: (args) => (
    <Space {...args}>
      <div style={{ width: 50, height: 50, background: 'green' }} />
      <div style={{ width: 50, height: 50, background: 'red' }} />
      <div style={{ width: 50, height: 50, background: 'green' }} />
    </Space>
  ),
  decorators: [
    (Story) => (
      <div style={{}}>
        <Story />
        <div>asd</div>
      </div>
    ),
  ],
}
