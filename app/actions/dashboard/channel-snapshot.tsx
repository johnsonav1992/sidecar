import type { Handle } from 'remix/component';

import { FrameLoader } from '../../ui/public/frame-loader.tsx';
import { SnapshotCard, type SnapshotCardProps } from './snapshot-card.tsx';

export const ChannelSnapshot = (handle: Handle<SnapshotCardProps>) => {
  return () =>
    handle.props.loading ? (
      <SnapshotCard
        range={handle.props.range}
        loading
      />
    ) : (
      <div
        data-snapshot-frame
        aria-busy='false'
      >
        <FrameLoader />
        <div data-snapshot-slot='content'>
          <SnapshotCard {...handle.props} />
        </div>
        <div
          data-snapshot-slot='fallback'
          hidden={true}
        >
          <SnapshotCard
            range={handle.props.range}
            loading
          />
        </div>
      </div>
    );
};
