import { createController } from 'remix/router';

import { routes } from '../../routes.ts';
import { Document } from '../document.tsx';
import { DashboardPage } from './page.tsx';
import { ChannelSnapshot } from './channel-snapshot.tsx';
import { loadSnapshot, parseSnapshotRange } from './snapshot-data.ts';

export default createController(routes.dashboard, {
  actions: {
    index: async (context) => {
      const channel = await context.channel.get();

      return context.render(
        <Document
          title='Dashboard · Sidecar'
          channel={channel}
        >
          <DashboardPage range={parseSnapshotRange(context.url.searchParams.get('range'))} />
        </Document>
      );
    },
    snapshot: async (context) => {
      const range = parseSnapshotRange(context.url.searchParams.get('range'));

      try {
        const data = await loadSnapshot(context.youtube, range);

        return context.render(
          <ChannelSnapshot
            range={range}
            data={data}
          />,
          { headers: { 'Cache-Control': 'private, no-store' } }
        );
      } catch {
        console.error('Unable to load channel snapshot');

        return context.render(
          <ChannelSnapshot
            range={range}
            error
          />,
          { headers: { 'Cache-Control': 'private, no-store' } }
        );
      }
    }
  }
});
