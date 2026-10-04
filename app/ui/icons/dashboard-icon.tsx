import type { Handle } from 'remix/component';

import type { IconProps } from './icon-props.ts';

export const DashboardIcon = (handle: Handle<IconProps>) => {
  return () => (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      width={handle.props.size ?? 18}
      height={handle.props.size ?? 18}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect
        x='3.5'
        y='3.5'
        width='7'
        height='7'
        rx='1.5'
      />
      <rect
        x='13.5'
        y='3.5'
        width='7'
        height='7'
        rx='1.5'
      />
      <rect
        x='3.5'
        y='13.5'
        width='7'
        height='7'
        rx='1.5'
      />
      <rect
        x='13.5'
        y='13.5'
        width='7'
        height='7'
        rx='1.5'
      />
    </svg>
  );
};
