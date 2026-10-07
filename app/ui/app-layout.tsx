import type { Handle, RemixNode } from 'remix/component';
import { css } from 'remix/component';

import type { ChannelInfo } from '../data/channel.ts';
import { routes } from '../routes.ts';
import { theme } from '../theme/theme.ts';
import { DashboardIcon } from './icons/dashboard-icon.tsx';
import { LogoutIcon } from './icons/logout-icon.tsx';
import { SidecarIcon } from './icons/sidecar-icon.tsx';

export interface AppLayoutProps {
  channel: ChannelInfo | null;
  children?: RemixNode;
  userEmail?: string;
}

export const AppLayout = (handle: Handle<AppLayoutProps>) => {
  return () => {
    const { channel, userEmail } = handle.props;
    const hasAccount = Boolean(userEmail);

    return (
      <div
        mix={css({
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: hasAccount ? '15.5rem minmax(0, 1fr)' : 'minmax(0, 1fr)',
          background: theme.color.background,
          color: theme.color.text,
          fontFamily: theme.font.family,
          fontSize: theme.font.size.body
        })}
      >
        {hasAccount ? (
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
              href={routes.dashboard.index.href()}
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
              <SidecarIcon />
              <span>Sidecar</span>
            </a>
            {channel ? (
              <div
                mix={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.space.sm,
                  padding: `${theme.space.sm} ${theme.space.sm}`,
                  marginTop: theme.space.md,
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
                    overflow: 'hidden',
                    background: theme.color.avatarChannel,
                    color: theme.color.text,
                    fontWeight: theme.font.weight.semibold
                  })}
                >
                  {channel.avatarUrl ? (
                    <img
                      src={channel.avatarUrl}
                      alt=''
                      mix={css({
                        display: 'block',
                        width: '2.5rem',
                        height: '2.5rem',
                        objectFit: 'cover'
                      })}
                    />
                  ) : (
                    channel.title.charAt(0)
                  )}
                </div>
                <div mix={css({ minWidth: 0 })}>
                  <strong
                    mix={css({
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    })}
                  >
                    {channel.title}
                  </strong>
                  <span
                    mix={css({
                      display: 'block',
                      marginTop: theme.space.xs,
                      color: theme.color.textMuted,
                      fontSize: theme.font.size.small,
                      lineHeight: 1.5
                    })}
                  >
                    {channel.handle ?? 'Your channel'}
                  </span>
                </div>
              </div>
            ) : null}
            <nav
              aria-label='Main navigation'
              mix={css({ display: 'grid', gap: theme.space.xs, marginTop: theme.space.md })}
            >
              <a
                href={routes.dashboard.index.href()}
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
                right: theme.space.lg,
                display: 'grid',
                paddingTop: theme.space.md,
                borderTop: `${theme.borderWidth.subtle} solid ${theme.color.border}`
              })}
            >
              <form
                method='post'
                action={routes.logout.href()}
              >
                <button
                  type='submit'
                  mix={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.space.sm,
                    padding: 0,
                    border: 0,
                    background: 'transparent',
                    color: theme.color.textMuted,
                    font: 'inherit',
                    fontSize: theme.font.size.small,
                    cursor: 'pointer',
                    '&:hover': { color: theme.color.text }
                  })}
                >
                  <LogoutIcon />
                  Sign out
                </button>
              </form>
            </div>
          </aside>
        ) : null}
        <main
          mix={css({
            minWidth: 0,
            width: '100%',
            gridColumn: hasAccount ? '2' : '1',
            boxSizing: 'border-box',
            padding: theme.space.lg
          })}
        >
          {handle.props.children}
        </main>
      </div>
    );
  };
};
