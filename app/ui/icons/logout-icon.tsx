import type { Handle } from 'remix/component';

import type { IconProps } from './icon-props.ts';

export const LogoutIcon = (handle: Handle<IconProps>) => {
  return () => (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      width={handle.props.size ?? 18}
      height={handle.props.size ?? 18}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.9'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
      <path d='m16 17 5-5-5-5' />
      <path d='M21 12H9' />
    </svg>
  );
};
