import type { StorybookConfig } from 'storybook-react-rsbuild'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../src/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-rslib',
  ],
  framework: 'storybook-react-rsbuild',
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        'postcss-loader',
      ],
      include: path.resolve(__dirname, '../'),
    })
    return config
  },
}

export default config
