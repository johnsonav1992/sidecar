import type { Handle } from 'remix/component';
import { css, Frame } from 'remix/component';

import { routes } from '../../routes.ts';
import { theme } from '../../theme/theme.ts';
import { ChannelSnapshot } from './channel-snapshot.tsx';
import type { SnapshotRange } from './snapshot-data.ts';

export const DashboardPage = (handle: Handle<{ range: SnapshotRange }>) => {
  return () => (
    <div mix={css({ display: 'grid', gap: theme.space.lg })}>
      <h1
        mix={css({
          margin: 0,
          fontSize: theme.font.size.title,
          fontWeight: theme.font.weight.semibold,
          letterSpacing: '-0.035em'
        })}
      >
        Dashboard
      </h1>
      <Frame
        name='channel-snapshot'
        src={`${routes.dashboard.snapshot.href()}?range=${handle.props.range}`}
        fallback={
          <ChannelSnapshot
            range={handle.props.range}
            loading
          />
        }
      />
    </div>
  );
};
