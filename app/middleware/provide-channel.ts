import type { Middleware } from 'remix/router';

import { YouTubeApi } from '../api/youtube-api.ts';
import { allowedYoutubeChannelId } from '../auth/google-provider.ts';
import { ChannelLoader } from '../data/channel.ts';

type ChannelMiddleware = Middleware<{
  key: typeof ChannelLoader;
  value: ChannelLoader;
  property: 'channel';
}>;

export const provideChannel: ChannelMiddleware = (context, next) => {
  const youtube = context.get(YouTubeApi);
  if (!youtube) throw new Error('Channel middleware requires the YouTube middleware');

  context.set(ChannelLoader, new ChannelLoader(youtube, allowedYoutubeChannelId), {
    property: 'channel'
  });

  return next();
};
