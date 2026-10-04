import type { Handle } from 'remix/component';
import { css } from 'remix/component';

import { theme } from '../../theme/theme.ts';
import { Skeleton } from '../../ui/skeleton.tsx';
import type { SnapshotMetric } from './snapshot-data.ts';

export const SnapshotMetricTile = (
  handle: Handle<{ metric?: SnapshotMetric; loading?: boolean }>
) => {
  return () => {
    const { metric } = handle.props;
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
          gap: theme.space.md,
          padding: `${theme.space.sm} 0`,
          alignContent: 'start'
        })}
      >
        <div
          mix={css({
            color: theme.color.textMuted,
            fontSize: theme.font.size.small,
            minHeight: '1.25rem',
            lineHeight: '1.25rem'
          })}
        >
          {handle.props.loading ? (
            <Skeleton
              width='7rem'
              height='1.25rem'
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
          {handle.props.loading ? (
            <Skeleton
              width='9rem'
              height='2.75rem'
            />
          ) : (
            format(metric?.value ?? null)
          )}
        </div>
        <div mix={css({ display: 'flex', alignItems: 'center', minHeight: '1.75rem' })}>
          {handle.props.loading ? (
            <Skeleton
              width='5rem'
              height='1.75rem'
            />
          ) : (
            <span
              aria-label={
                percentage
                  ? `${percentage}% ${change! > 0 ? 'increase' : 'decrease'} compared with the previous period`
                  : comparison
              }
              mix={css({
                borderRadius: theme.radius.sm,
                padding: `${theme.space.xs} ${theme.space.sm}`,
                fontSize: theme.font.size.small,
                fontWeight: theme.font.weight.medium
              })}
              style={{
                color:
                  change === null || change === 0
                    ? theme.color.textMuted
                    : change > 0
                      ? theme.color.success
                      : theme.color.danger,
                background:
                  change === null || change === 0
                    ? theme.color.surfaceRaised
                    : change > 0
                      ? theme.color.successBackground
                      : theme.color.dangerBackground
              }}
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
          {handle.props.loading ? (
            <Skeleton
              width='8rem'
              height='1.25rem'
            />
          ) : metric?.previous == null ? (
            'Revenue unavailable'
          ) : (
            `${format(metric.previous)} previous period`
          )}
        </div>
      </div>
    );
  };
};
