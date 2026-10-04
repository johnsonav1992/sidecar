import type { Handle } from 'remix/component';

import { FrameLoader } from '../../ui/public/frame-loader.tsx';
import type { SnapshotRange, SnapshotData } from './snapshot-data.ts';
import { SnapshotCard } from './snapshot-card.tsx';

export const ChannelSnapshot = (
  handle: Handle<{ range: SnapshotRange; data?: SnapshotData; loading?: boolean; error?: boolean }>
) => {
  return () =>
    handle.props.loading ? (
      <SnapshotCard
        range={handle.props.range}
        loading
      />
    ) : (
      <FrameLoader
        fallback={
          <SnapshotCard
            range={handle.props.range}
            loading
          />
        }
      >
        <SnapshotCard {...handle.props} />
      </FrameLoader>
    );
};
