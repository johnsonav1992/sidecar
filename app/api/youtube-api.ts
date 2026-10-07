import {
  google,
  type youtube_v3,
  type youtubeAnalytics_v2,
  type youtubereporting_v1
} from 'googleapis';

/** Server-side client for YouTube Data, Analytics, and Reporting APIs. */
export class YouTubeApi {
  private readonly data: youtube_v3.Youtube;
  private readonly analytics: youtubeAnalytics_v2.Youtubeanalytics;
  private readonly reporting: youtubereporting_v1.Youtubereporting;

  constructor(private readonly auth: InstanceType<typeof google.auth.OAuth2>) {
    this.data = google.youtube({ version: 'v3', auth });
    this.analytics = google.youtubeAnalytics({ version: 'v2', auth });
    this.reporting = google.youtubereporting({ version: 'v1', auth });
  }

  /** Query any API-supported user-activity, engagement, audience, or monetization report. */
  queryAnalytics = async <StartDate extends string, EndDate extends string>(
    params: AnalyticsQuery<StartDate, EndDate>
  ) => {
    const validatedParams = {
      ...params,
      startDate: this.parseYouTubeDate(params.startDate),
      endDate: this.parseYouTubeDate(params.endDate)
    };
    const { data } = await this.analytics.reports.query(validatedParams);

    return data;
  };

  /** Convenience query for daily channel-wide performance. */
  getDailyOverview = async <StartDate extends string, EndDate extends string>({
    startDate,
    endDate,
    ids = 'channel==MINE'
  }: DailyOverviewParams<StartDate, EndDate>) => {
    return this.queryAnalytics({
      ids,
      startDate,
      endDate,
      dimensions: 'day',
      metrics: YOUTUBE_ANALYTICS_METRICS.overview.join(',')
    });
  };

  /** Convenience query for daily channel-wide revenue and ad performance. */
  getDailyRevenue = async <StartDate extends string, EndDate extends string>({
    startDate,
    endDate,
    ids = 'channel==MINE',
    currency = 'USD'
  }: DailyRevenueParams<StartDate, EndDate>) => {
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
  getVideoAnalytics = async <StartDate extends string, EndDate extends string>({
    videoId,
    startDate,
    endDate,
    metrics = YOUTUBE_ANALYTICS_METRICS.overview.join(',')
  }: VideoAnalyticsParams<StartDate, EndDate>) => {
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

  private parseYouTubeDate = (value: string): YouTubeDate => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) throw new RangeError(`Invalid YouTube date "${value}"; expected YYYY-MM-DD`);

    const [, yearText, monthText, dayText] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth) {
      throw new RangeError(`Invalid calendar date "${value}"`);
    }

    return value as YouTubeDate;
  };
}

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

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type NonZeroDigit = Exclude<Digit, '0'>;
type Month = `0${NonZeroDigit}` | `1${'0' | '1' | '2'}`;
type Day = `0${NonZeroDigit}` | `${'1' | '2'}${Digit}` | `3${'0' | '1'}`;

/** YYYY-MM-DD shape with valid month/day ranges. Runtime parsing checks the year and calendar date. */
export type YouTubeDate = `${number}-${Month}-${Day}`;

type DateFormatDiagnostic<Value extends string> = Value extends YouTubeDate
  ? Value
  : Value & {
      readonly 'DATE FORMAT ERROR: use YYYY-MM-DD with zero-padded month/day; use parseYouTubeDate(value) for runtime input': never;
    };

export type AnalyticsQuery<
  StartDate extends string = YouTubeDate,
  EndDate extends string = YouTubeDate
> = Omit<youtubeAnalytics_v2.Params$Resource$Reports$Query, 'auth' | 'startDate' | 'endDate'> & {
  startDate: DateFormatDiagnostic<StartDate>;
  endDate: DateFormatDiagnostic<EndDate>;
};

export type DailyOverviewParams<
  StartDate extends string = YouTubeDate,
  EndDate extends string = YouTubeDate
> = {
  startDate: DateFormatDiagnostic<StartDate>;
  endDate: DateFormatDiagnostic<EndDate>;
  ids?: string;
};

export type DailyRevenueParams<
  StartDate extends string = YouTubeDate,
  EndDate extends string = YouTubeDate
> = DailyOverviewParams<StartDate, EndDate> & {
  currency?: string;
};

export type VideoAnalyticsParams<
  StartDate extends string = YouTubeDate,
  EndDate extends string = YouTubeDate
> = {
  videoId: string;
  startDate: DateFormatDiagnostic<StartDate>;
  endDate: DateFormatDiagnostic<EndDate>;
  metrics?: string;
};
