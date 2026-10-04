import type { YouTubeApi, YouTubeDate } from '../../api/youtube-api.ts';

export const snapshotRanges = [7, 28, 90] as const;
export type SnapshotRange = (typeof snapshotRanges)[number];
export type SnapshotMetric = {
  label: string;
  value: number | null;
  previous: number | null;
  format: 'number' | 'hours' | 'currency';
};
export type SnapshotData = { start: string; end: string; metrics: SnapshotMetric[] };

export const parseSnapshotRange = (value: string | null): SnapshotRange => {
  return snapshotRanges.find((range) => String(range) === value) ?? 28;
};

export const getSnapshotDates = (range: SnapshotRange, now = new Date()) => {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
  const date = new Date(`${today}T00:00:00Z`);
  const offset = (days: number): YouTubeDate => {
    return new Date(date.getTime() - days * 86400000).toISOString().slice(0, 10) as YouTubeDate;
  };

  return {
    start: offset(range),
    end: offset(1),
    previousStart: offset(range * 2),
    previousEnd: offset(range + 1)
  };
};

export const loadSnapshot = async (
  youtube: YouTubeApi,
  range: SnapshotRange
): Promise<SnapshotData> => {
  const dates = getSnapshotDates(range);
  const totals = async (startDate: YouTubeDate, endDate: YouTubeDate, metrics: string) => {
    const result = await youtube.queryAnalytics({
      ids: 'channel==MINE',
      startDate,
      endDate,
      metrics
    });
    const row = result.rows?.[0];

    return Object.fromEntries(
      (result.columnHeaders ?? []).map((column, index) => [column.name, Number(row?.[index] ?? 0)])
    );
  };

  const metrics = 'views,estimatedMinutesWatched,subscribersGained,subscribersLost';
  const [current, previous, revenue, previousRevenue] = await Promise.all([
    totals(dates.start, dates.end, metrics),
    totals(dates.previousStart, dates.previousEnd, metrics),
    totals(dates.start, dates.end, 'estimatedRevenue').catch(() => null),
    totals(dates.previousStart, dates.previousEnd, 'estimatedRevenue').catch(() => null)
  ]);

  return {
    start: dates.start,
    end: dates.end,
    metrics: [
      { label: 'Views', value: current.views, previous: previous.views, format: 'number' },
      {
        label: 'Watch hours',
        value: current.estimatedMinutesWatched / 60,
        previous: previous.estimatedMinutesWatched / 60,
        format: 'hours'
      },
      {
        label: 'Net subscribers',
        value: current.subscribersGained - current.subscribersLost,
        previous: previous.subscribersGained - previous.subscribersLost,
        format: 'number'
      },
      {
        label: 'Estimated revenue',
        value: revenue?.estimatedRevenue ?? null,
        previous: previousRevenue?.estimatedRevenue ?? null,
        format: 'currency'
      }
    ]
  };
};
