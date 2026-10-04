import {
  google,
  type youtube_v3,
  type youtubeAnalytics_v2,
  type youtubereporting_v1
} from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

/** Request both scopes during OAuth consent if the app needs monetary reports. */
export const YOUTUBE_OAUTH_SCOPES = {
  analyticsReadOnly: 'https://www.googleapis.com/auth/yt-analytics.readonly',
  analyticsMonetaryReadOnly: 'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
  dataReadOnly: 'https://www.googleapis.com/auth/youtube.readonly'
} as const;

/** Common Analytics API measures. Google validates that each combination is supported. */
export const YOUTUBE_ANALYTICS_METRICS = {
  overview: [
    'views',
    'engagedViews',
    'estimatedMinutesWatched',
    'averageViewDuration',
    'averageViewPercentage',
    'subscribersGained',
    'subscribersLost',
    'likes',
    'comments',
    'shares'
  ],
  revenue: [
    'estimatedRevenue',
    'estimatedAdRevenue',
    'estimatedRedPartnerRevenue',
    'grossRevenue',
    'cpm',
    'playbackBasedCpm',
    'adImpressions',
    'monetizedPlaybacks'
  ],
  audience: [
    'viewerPercentage',
    'uniqueViewers',
    'newViewers',
    'returningViewers',
    'averageViewDuration',
    'estimatedMinutesWatched'
  ],
  impressions: ['videoThumbnailImpressions', 'videoThumbnailImpressionsClickRate'],
  playlist: [
    'playlistStarts',
    'playlistViews',
    'viewsPerPlaylistStart',
    'averageTimeInPlaylist',
    'videosAddedToPlaylists',
    'videosRemovedFromPlaylists'
  ],
  cards: [
    'cardImpressions',
    'cardClicks',
    'cardClickRate',
    'cardTeaserImpressions',
    'cardTeaserClicks',
    'cardTeaserClickRate'
  ],
  endScreens: ['endScreenElementImpressions', 'endScreenElementClicks', 'endScreenElementClickRate']
} as const;

/** Common report dimensions. Many metrics only support particular dimensions. */
export const YOUTUBE_ANALYTICS_DIMENSIONS = {
  time: ['day', 'month'],
  content: ['video', 'playlist'],
  geography: ['country', 'province'],
  audience: ['ageGroup', 'gender'],
  discovery: ['insightTrafficSourceType', 'insightTrafficSourceDetail'],
  playback: ['insightPlaybackLocationType', 'deviceType', 'operatingSystem'],
  live: ['liveOrOnDemand', 'subscribedStatus']
} as const;

export type AnalyticsQuery = Omit<youtubeAnalytics_v2.Params$Resource$Reports$Query, 'auth'>;

/** Server-side client for YouTube Data, Analytics, and Reporting APIs. Keep this module server-only. */
export class YouTubeApi {
  private readonly data: youtube_v3.Youtube;
  private readonly analytics: youtubeAnalytics_v2.Youtubeanalytics;
  private readonly reporting: youtubereporting_v1.Youtubereporting;

  constructor(private readonly auth: OAuth2Client) {
    this.data = google.youtube({ version: 'v3', auth });
    this.analytics = google.youtubeAnalytics({ version: 'v2', auth });
    this.reporting = google.youtubereporting({ version: 'v1', auth });
  }

  /** Query any API-supported user-activity, engagement, audience, or monetization report. */
  queryAnalytics = async (params: AnalyticsQuery) => {
    const { data } = await this.analytics.reports.query(params);

    return data;
  };

  /** Convenience query for daily channel-wide performance. */
  getDailyOverview = async (startDate: string, endDate: string, ids = 'channel==MINE') => {
    return this.queryAnalytics({
      ids,
      startDate,
      endDate,
      dimensions: 'day',
      metrics: YOUTUBE_ANALYTICS_METRICS.overview.join(',')
    });
  };

  /** Convenience query for daily channel-wide revenue and ad performance. */
  getDailyRevenue = async (
    startDate: string,
    endDate: string,
    ids = 'channel==MINE',
    currency = 'USD'
  ) => {
    return this.queryAnalytics({
      ids,
      startDate,
      endDate,
      dimensions: 'day',
      metrics: YOUTUBE_ANALYTICS_METRICS.revenue.join(','),
      currency
    });
  };

  /** Convenience query for one video's daily performance. */
  getVideoAnalytics = async (
    videoId: string,
    startDate: string,
    endDate: string,
    metrics = YOUTUBE_ANALYTICS_METRICS.overview.join(',')
  ) => {
    return this.queryAnalytics({
      ids: 'channel==MINE',
      startDate,
      endDate,
      dimensions: 'day',
      filters: `video==${videoId}`,
      metrics
    });
  };

  /** Discover report types supported for this account; include system-managed revenue reports if available. */
  listReportTypes = async (
    params: Omit<youtubereporting_v1.Params$Resource$Reporttypes$List, 'auth'> = {
      includeSystemManaged: true
    }
  ) => {
    const { data } = await this.reporting.reportTypes.list(params);

    return data;
  };

  listReportingJobs = async (
    params: Omit<youtubereporting_v1.Params$Resource$Jobs$List, 'auth'> = {}
  ) => {
    const { data } = await this.reporting.jobs.list(params);

    return data;
  };

  createReportingJob = async (
    params: Omit<youtubereporting_v1.Params$Resource$Jobs$Create, 'auth'>
  ) => {
    const { data } = await this.reporting.jobs.create(params);

    return data;
  };

  deleteReportingJob = async (
    params: Omit<youtubereporting_v1.Params$Resource$Jobs$Delete, 'auth'>
  ) => {
    await this.reporting.jobs.delete(params);
  };

  listReports = async (
    params: Omit<youtubereporting_v1.Params$Resource$Jobs$Reports$List, 'auth'>
  ) => {
    const { data } = await this.reporting.jobs.reports.list(params);

    return data;
  };

  getReport = async (
    params: Omit<youtubereporting_v1.Params$Resource$Jobs$Reports$Get, 'auth'>
  ) => {
    const { data } = await this.reporting.jobs.reports.get(params);

    return data;
  };

  /** Download generated CSV report contents. Reporting API reports are bulk, asynchronous exports. */
  downloadReport = async (reportUrl: string): Promise<string> => {
    const url = new URL(reportUrl);

    if (
      url.protocol !== 'https:' ||
      !['youtube.com', 'googleusercontent.com', 'googleapis.com'].some(
        (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      )
    ) {
      throw new Error('Unexpected YouTube report download URL');
    }

    const accessToken = await this.auth.getAccessToken();
    const response = await fetch(url, {
      headers: accessToken.token ? { Authorization: `Bearer ${accessToken.token}` } : undefined
    });
    if (!response.ok)
      throw new Error(`YouTube report download failed (${response.status} ${response.statusText})`);

    return response.text();
  };

  getChannel = async (params: Omit<youtube_v3.Params$Resource$Channels$List, 'auth'>) => {
    const { data } = await this.data.channels.list(params);

    return data;
  };

  getVideos = async (params: Omit<youtube_v3.Params$Resource$Videos$List, 'auth'>) => {
    const { data } = await this.data.videos.list(params);

    return data;
  };

  getPlaylists = async (params: Omit<youtube_v3.Params$Resource$Playlists$List, 'auth'>) => {
    const { data } = await this.data.playlists.list(params);

    return data;
  };

  getPlaylistItems = async (
    params: Omit<youtube_v3.Params$Resource$Playlistitems$List, 'auth'>
  ) => {
    const { data } = await this.data.playlistItems.list(params);

    return data;
  };

  getCommentThreads = async (
    params: Omit<youtube_v3.Params$Resource$Commentthreads$List, 'auth'>
  ) => {
    const { data } = await this.data.commentThreads.list(params);

    return data;
  };
}
