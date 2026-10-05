import type { Handle } from 'remix/component';

import { SnapshotCard, type SnapshotCardProps } from './snapshot-card.tsx';

export const ChannelSnapshot = (handle: Handle<SnapshotCardProps>) => {
  return () => <SnapshotCard {...handle.props} />;
};
