import { css } from 'remix/component';

import { theme } from '../../theme/theme.ts';

export const SidecarIcon = () => {
  return () => (
    <svg
      aria-hidden='true'
      viewBox='0 -2 184 68'
      mix={css({ display: 'block', width: '3.5rem', height: '1.375rem', flexShrink: 0 })}
    >
      <path
        fill={theme.color.youtubeRed}
        d='M3 53 1 47 2 40 2 34C11 28 26 23 44 20 57 12 70 4 87 1 113-3 139 2 160 10L173 14 179 14 178 18 178 25 180 36 182 39 179 49 162 54V49a18 18 0 0 0-36 0V55H49V49a18 18 0 0 0-36 0V55Z'
      />
      <circle
        cx='31'
        cy='49'
        r='14'
        fill={theme.color.youtubeRed}
      />
      <circle
        cx='144'
        cy='49'
        r='14'
        fill={theme.color.youtubeRed}
      />
      <path
        d='M85 13 109 27 85 41Z'
        fill={theme.color.text}
      />
    </svg>
  );
};
