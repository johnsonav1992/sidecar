import type { Handle } from 'remix/component';
import { css } from 'remix/component';

import { theme } from '../../theme/theme.ts';
import { Skeleton } from '../../ui/skeleton.tsx';
import type { SnapshotMetric } from './snapshot-data.ts';

type SnapshotMetricTileProps = {
  metric?: SnapshotMetric;
  loading?: boolean;
};

export const SnapshotMetricTile = (handle: Handle<SnapshotMetricTileProps>) => {
  return () => {
    const { metric, loading } = handle.props;
    const format = (value: number | null): string => {
      return value == null
        ? '—'
        : new Intl.NumberFormat('en-US', {
            ...(metric?.format === 'currency' ? { style: 'currency', currency: 'USD' } : {}),
            maximumFractionDigits:
              metric?.format === 'number' ? 0 : metric?.format === 'currency' ? 2 : 1
          }).format(value);
    };
    const change =
      metric?.value == null || metric.previous == null ? null : metric.value - metric.previous;
    const percentage =
      change !== null && metric?.previous
        ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
            Math.abs((change / metric.previous) * 100)
          )
        : null;
    const trend = change === null || change === 0 ? 'flat' : change > 0 ? 'up' : 'down';
    const comparison =
      change === null
        ? 'Unavailable'
        : change === 0
          ? 'No change'
          : percentage
            ? `${change > 0 ? '↑' : '↓'} ${percentage}%`
            : 'No prior activity';

    return (
      <div
        mix={css({
          minWidth: 0,
          display: 'grid',
          gap: theme.space.sm,
          alignContent: 'start',
          padding: theme.space.md,
          borderRadius: theme.radius.md,
          background: theme.color.surfaceRaised,
          border: `${theme.borderWidth.subtle} solid ${theme.color.border}`
        })}
      >
        <div
          mix={css({
            color: theme.color.textMuted,
            fontSize: theme.font.size.xs,
            fontWeight: theme.font.weight.medium,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: '1rem',
            minHeight: '1rem'
          })}
        >
          {loading ? (
            <Skeleton
              width='6rem'
              height='1rem'
            />
          ) : (
            metric?.label
          )}
        </div>
        <div
          mix={css({
            fontSize: theme.font.size.metric,
            lineHeight: '2.75rem',
            fontWeight: theme.font.weight.semibold,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums'
          })}
        >
          {loading ? (
            <Skeleton
              width='8rem'
              height='2.75rem'
            />
          ) : (
            format(metric?.value ?? null)
          )}
        </div>
        <div mix={css({ display: 'flex', alignItems: 'center', minHeight: '1.75rem' })}>
          {loading ? (
            <Skeleton
              width='5.5rem'
              height='1.75rem'
            />
          ) : (
            <span
              data-trend={trend}
              aria-label={
                percentage
                  ? `${percentage}% ${change! > 0 ? 'increase' : 'decrease'} compared with the previous period`
                  : comparison
              }
              mix={css({
                display: 'inline-flex',
                alignItems: 'center',
                width: 'fit-content',
                borderRadius: theme.radius.pill,
                padding: `${theme.space.xs} ${theme.space.sm}`,
                fontSize: theme.font.size.small,
                fontWeight: theme.font.weight.semibold,
                lineHeight: '1.25rem',
                fontVariantNumeric: 'tabular-nums',
                '&[data-trend="flat"]': {
                  color: theme.color.textMuted,
                  background: theme.color.background
                },
                '&[data-trend="up"]': {
                  color: theme.color.success,
                  background: theme.color.successBackground
                },
                '&[data-trend="down"]': {
                  color: theme.color.danger,
                  background: theme.color.dangerBackground
                }
              })}
            >
              {comparison}
            </span>
          )}
        </div>
        <div
          mix={css({
            color: theme.color.textMuted,
            fontSize: theme.font.size.small,
            lineHeight: '1.25rem',
            minHeight: '1.25rem'
          })}
        >
          {loading ? (
            <Skeleton
              width='9rem'
              height='1.25rem'
            />
          ) : metric?.previous == null ? (
            'Unavailable'
          ) : (
            `${format(metric.previous)} previous period`
          )}
        </div>
      </div>
    );
  };
};
