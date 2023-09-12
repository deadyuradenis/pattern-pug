import custom from '../webpack.config.js';

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: 'storypug',
      options: {
        babel: true,
        loaderOptions: {
          root: '../src',
        },
      },
    },
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          implementation: require('sass'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/html-webpack5',
    options: {},
  },
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...custom.resolve,
        alias: {
          ...custom.resolve?.alias,
        },
      },
      devServer: {
        static: {
          directory: '../public',
        },
      },
    };
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};

export default config;
