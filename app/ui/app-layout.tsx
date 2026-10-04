import type { Handle, RemixNode } from 'remix/component';
import { css } from 'remix/component';

import { theme } from '../theme/theme.ts';
import { DashboardIcon } from './icons/dashboard-icon.tsx';
import { PlayIcon } from './icons/play-icon.tsx';

export interface AppLayoutProps {
  children?: RemixNode;
}

export const AppLayout = (handle: Handle<AppLayoutProps>) => {
  return () => (
    <div
      mix={css({
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '15.5rem minmax(0, 1fr)',
        background: theme.color.background,
        color: theme.color.text,
        fontFamily: theme.font.family,
        fontSize: theme.font.size.body
      })}
    >
      <aside
        mix={css({
          position: 'relative',
          minHeight: '100vh',
          boxSizing: 'border-box',
          padding: `${theme.space.lg} ${theme.space.md}`,
          background: theme.color.surface,
          borderRight: `${theme.borderWidth.subtle} solid ${theme.color.border}`
        })}
      >
        <a
          href='/'
          aria-label='Sidecar home'
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: theme.space.sm,
            padding: `0 ${theme.space.sm}`,
            color: theme.color.text,
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: theme.font.weight.semibold
          })}
        >
          <span
            mix={css({
              display: 'grid',
              placeItems: 'center',
              width: '2rem',
              height: '1.5rem',
              borderRadius: theme.radius.sm,
              background: theme.color.brandVideo,
              color: theme.color.text
            })}
          >
            <PlayIcon size={14} />
          </span>
          <span>Sidecar</span>
        </a>
        <div
          mix={css({
            display: 'flex',
            alignItems: 'center',
            gap: theme.space.sm,
            padding: `${theme.space.lg} ${theme.space.sm}`,
            marginTop: theme.space.lg,
            borderTop: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
            borderBottom: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
            fontSize: theme.font.size.small
          })}
        >
          <div
            mix={css({
              display: 'grid',
              placeItems: 'center',
              width: '2.5rem',
              height: '2.5rem',
              flexShrink: 0,
              borderRadius: theme.radius.pill,
              background: theme.color.avatarChannel,
              color: theme.color.text,
              fontWeight: theme.font.weight.semibold
            })}
          >
            D
          </div>
          <div>
            <strong>DFW Tesla</strong>
            <span
              mix={css({
                display: 'block',
                marginTop: theme.space.xs,
                color: theme.color.textMuted,
                fontSize: theme.font.size.small,
                lineHeight: 1.5
              })}
            >
              Channel
            </span>
          </div>
        </div>
        <nav
          aria-label='Main navigation'
          mix={css({ display: 'grid', gap: theme.space.xs, marginTop: theme.space.md })}
        >
          <a
            href='/'
            aria-current='page'
            mix={css({
              display: 'flex',
              alignItems: 'center',
              gap: theme.space.md,
              padding: `${theme.space.sm} ${theme.space.md}`,
              borderRadius: theme.radius.md,
              color: theme.color.text,
              textDecoration: 'none',
              fontSize: theme.font.size.small,
              background: theme.color.surfaceRaised
            })}
          >
            <DashboardIcon /> Dashboard
          </a>
        </nav>
        <div
          mix={css({
            position: 'absolute',
            bottom: theme.space.lg,
            left: theme.space.lg,
            color: theme.color.textMuted,
            fontSize: theme.font.size.xs,
            letterSpacing: '0.12em'
          })}
        >
          SIDECAR
        </div>
      </aside>
      <div mix={css({ minWidth: 0 })}>
        <header
          mix={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem',
            padding: `0 ${theme.space.xl}`,
            borderBottom: `${theme.borderWidth.subtle} solid ${theme.color.border}`
          })}
        >
          <span mix={css({ color: theme.color.textMuted, fontSize: theme.font.size.small })}>
            DFW Tesla
          </span>
          <button
            type='button'
            aria-label='Account'
            mix={css({
              width: '2rem',
              height: '2rem',
              border: 0,
              borderRadius: theme.radius.pill,
              background: theme.color.avatarAccount,
              color: theme.color.text,
              font: 'inherit'
            })}
          >
            A
          </button>
        </header>
        <main
          mix={css({
            maxWidth: '70rem',
            margin: '0 auto',
            padding: `${theme.space.xl} ${theme.space.xl}`
          })}
        >
          {handle.props.children}
        </main>
      </div>
    </div>
  );
};
