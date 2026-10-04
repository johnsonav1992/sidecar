import type { Handle } from 'remix/component';
import { css } from 'remix/component';

import { theme } from '../theme/theme.ts';

type SkeletonLength = `${number}rem` | `${number}%`;

export const Skeleton = (handle: Handle<{ width?: SkeletonLength; height?: SkeletonLength }>) => {
  return () => (
    <span
      aria-hidden='true'
      style={{ width: handle.props.width ?? '100%', height: handle.props.height ?? '1rem' }}
      mix={css({
        display: 'block',
        maxWidth: '100%',
        borderRadius: theme.radius.sm,
        background: theme.color.surfaceHover,
        animation: 'sidecar-skeleton-pulse 1.5s ease-in-out infinite',
        '@keyframes sidecar-skeleton-pulse': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 }
        },
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' }
      })}
    />
  );
};
