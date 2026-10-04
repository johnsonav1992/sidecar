export const theme = {
  color: {
    background: '#0f0f0f',
    surface: '#181818',
    surfaceRaised: '#222222',
    surfaceHover: '#2a2a2a',
    border: '#303030',
    text: '#f1f1f1',
    textMuted: '#aaaaaa',
    accent: '#3ea6ff',
    accentStrong: '#065fd4',
    success: '#2ba640',
    danger: '#f87171',
    brandVideo: '#ff0033',
    avatarChannel: '#356f74',
    avatarAccount: '#6b4a86'
  },
  font: {
    family:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    size: { xs: '0.625rem', small: '0.8125rem', body: '0.9375rem', title: '1.5rem' },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  },
  space: { xs: '0.375rem', sm: '0.625rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' },
  radius: { sm: '0.375rem', md: '0.625rem', lg: '0.875rem', pill: '999rem' },
  borderWidth: { subtle: '0.0625rem' },
  shadow: { panel: '0 0.5rem 1.75rem rgb(0 0 0 / 24%)' }
} as const;

export type Theme = typeof theme;
