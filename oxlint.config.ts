import { defineConfig } from 'oxlint';

export default defineConfig({
  jsPlugins: ['./linting/oxlint-plugin.ts'],
  overrides: [
    {
      files: ['app/**/*.{js,jsx,ts,tsx}', 'server.ts'],
      rules: {
        'youtube-analytics/padding-around-multiline-blocks': 'error',
        'youtube-analytics/only-arrow-functions': 'error',
        'youtube-analytics/blank-line-before-return': 'error',
        'youtube-analytics/no-blank-lines-between-jsx-elements': 'error'
      }
    }
  ]
});
