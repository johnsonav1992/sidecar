import type { Handle } from 'remix/component';
import { css } from 'remix/component';

import { routes } from '../../routes.ts';
import { theme } from '../../theme/theme.ts';
import { Skeleton } from '../../ui/skeleton.tsx';
import { snapshotRanges, type SnapshotRange, type SnapshotData } from './snapshot-data.ts';
import { SnapshotMetricTile } from './snapshot-metric.tsx';

export const SnapshotCard = (
  handle: Handle<{ range: SnapshotRange; data?: SnapshotData; loading?: boolean; error?: boolean }>
) => {
  return () => {
    const { range, data, loading, error } = handle.props;
    const dates = data
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC'
        }).formatRange(new Date(`${data.start}T00:00:00Z`), new Date(`${data.end}T00:00:00Z`))
      : null;

    return (
      <section
        aria-label={loading ? 'Loading channel snapshot' : 'Channel snapshot'}
        aria-busy={loading ?? false}
        mix={css({
          padding: theme.space.lg,
          borderRadius: theme.radius.lg,
          border: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
          background: theme.color.surface
        })}
      >
        <header
          mix={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: theme.space.md
          })}
        >
          <div>
            <h2
              mix={css({
                margin: 0,
                fontSize: theme.font.size.heading,
                fontWeight: theme.font.weight.semibold,
                lineHeight: '1.5rem'
              })}
            >
              Channel snapshot
            </h2>
            <div
              mix={css({
                marginTop: theme.space.xs,
                color: theme.color.textMuted,
                fontSize: theme.font.size.small,
                lineHeight: '1.25rem',
                minHeight: '1.25rem'
              })}
            >
              {loading ? (
                <Skeleton
                  width='12rem'
                  height='1.25rem'
                />
              ) : (
                (dates ?? 'Your channel at a glance')
              )}
            </div>
          </div>
          <nav
            aria-label='Snapshot date range'
            mix={css({
              display: 'flex',
              gap: theme.space.xs,
              background: theme.color.background,
              padding: theme.space.xs,
              borderRadius: theme.radius.md
            })}
          >
            {snapshotRanges.map((option) => (
              <a
                key={option}
                href={`${routes.dashboard.index.href()}?range=${option}`}
                data-rmx-target='channel-snapshot'
                data-rmx-src={`${routes.dashboard.snapshot.href()}?range=${option}`}
                data-rmx-reset-scroll='false'
                aria-current={option === range ? 'true' : undefined}
                mix={css({
                  textDecoration: 'none',
                  padding: `${theme.space.sm} ${theme.space.md}`,
                  borderRadius: theme.radius.sm,
                  fontSize: theme.font.size.small,
                  fontWeight: theme.font.weight.medium,
                  whiteSpace: 'nowrap',
                  color: theme.color.textMuted,
                  '&[aria-current="true"]': {
                    background: theme.color.surfaceHover,
                    color: theme.color.text
                  },
                  '&:hover': { color: theme.color.text },
                  '&:focus-visible': {
                    outline: `${theme.borderWidth.subtle} solid ${theme.color.accent}`,
                    outlineOffset: theme.space.xs
                  }
                })}
              >
                {option} days
              </a>
            ))}
          </nav>
        </header>
        {error ? (
          <p
            role='status'
            mix={css({ padding: `${theme.space.xl} 0`, color: theme.color.textMuted })}
          >
            Couldn’t load this snapshot. Choose a range to try again.
          </p>
        ) : (
          <div
            mix={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: theme.space.lg,
              padding: `${theme.space.lg} 0`,
              marginTop: theme.space.md,
              borderTop: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
              '@media (max-width: 75rem)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
              '@media (max-width: 45rem)': { gridTemplateColumns: 'minmax(0, 1fr)' }
            })}
          >
            {loading
              ? [0, 1, 2, 3].map((key) => (
                  <SnapshotMetricTile
                    key={key}
                    loading
                  />
                ))
              : data?.metrics.map((metric) => (
                  <SnapshotMetricTile
                    key={metric.label}
                    metric={metric}
                  />
                ))}
          </div>
        )}
        <footer
          mix={css({
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: theme.space.sm,
            borderTop: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
            paddingTop: theme.space.md,
            color: theme.color.textMuted,
            fontSize: theme.font.size.small,
            lineHeight: '1.25rem'
          })}
        >
          <span>
            {loading
              ? 'Updating your snapshot…'
              : `Changes compared with the previous ${range} days`}
          </span>
          <span title='Date ranges end yesterday in Pacific time. Recent totals and estimated revenue can change as YouTube finishes processing.'>
            YouTube reporting may lag · USD
          </span>
        </footer>
      </section>
    );
  };
};
