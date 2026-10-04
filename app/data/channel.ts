import type { YouTubeApi } from '../api/youtube-api.ts';

export interface ChannelInfo {
  title: string;
  handle?: string;
  avatarUrl?: string;
}

export class ChannelLoader {
  private pending: Promise<ChannelInfo | null> | undefined;

  constructor(private readonly youtube: Pick<YouTubeApi, 'getChannel'>) {}

  get = (): Promise<ChannelInfo | null> => {
    return (this.pending ??= this.load());
  };

  private load = async (): Promise<ChannelInfo | null> => {
    try {
      const response = await this.youtube.getChannel({ part: ['snippet'], mine: true });
      const snippet = response.items?.[0]?.snippet;

      if (!snippet?.title) return null;

      return {
        title: snippet.title,
        handle: snippet.customUrl ?? undefined,
        avatarUrl: snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? undefined
      };
    } catch {
      console.error('Unable to load YouTube channel information');

      return null;
    }
  };
}
