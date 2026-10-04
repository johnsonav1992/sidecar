import { defineConfig } from 'oxlint';

export default defineConfig({
  jsPlugins: ['./linting/oxlint-plugin.ts'],
  overrides: [
    {
      files: ['app/**/*.{js,jsx,ts,tsx}', 'server.ts'],
      rules: {
        'sidecar/padding-around-multiline-blocks': 'error',
        'sidecar/only-arrow-functions': 'error',
        'sidecar/blank-line-before-return': 'error',
        'sidecar/no-blank-lines-between-jsx-elements': 'error'
      }
    }
  ]
});
