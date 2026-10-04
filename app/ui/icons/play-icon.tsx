import type { Handle } from 'remix/component';

import type { IconProps } from './icon-props.ts';

export const PlayIcon = (handle: Handle<IconProps>) => {
  return () => (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      width={handle.props.size ?? 16}
      height={handle.props.size ?? 16}
      fill='currentColor'
    >
      <path d='M8 5.5a1 1 0 0 1 1.5-.86l10 6.5a1 1 0 0 1 0 1.72l-10 6.5A1 1 0 0 1 8 18.5z' />
    </svg>
  );
};
