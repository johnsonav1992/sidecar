import type { Handle } from 'remix/component';
import { css } from 'remix/component';

import { routes } from '../routes.ts';
import { theme } from '../theme/theme.ts';

export type LoginPageProps = {
  error?: string;
};

const loginErrors: Record<string, string> = {
  authorization: 'Google sign-in did not complete. Please try again.',
  channel: 'This Google account could not access the DFW Tesla YouTube channel.',
  profile: 'Google did not provide an email address for this account.',
  reauthorize: 'Your Google authorization expired. Sign in again to reconnect your channel.',
  configuration: 'Set GOOGLE_ALLOWED_CHANNEL_ID in the app environment before signing in.'
};

export const LoginPage = (handle: Handle<LoginPageProps>) => {
  return () => (
    <section
      aria-labelledby='login-title'
      mix={css({
        display: 'grid',
        alignContent: 'center',
        justifyItems: 'center',
        minHeight: 'calc(100vh - 3rem)',
        padding: theme.space.lg
      })}
    >
      <div
        mix={css({
          width: '100%',
          maxWidth: '28rem',
          padding: theme.space.xl,
          border: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
          borderRadius: theme.radius.lg,
          background: theme.color.surface
        })}
      >
        <h1
          id='login-title'
          mix={css({
            margin: 0,
            fontSize: theme.font.size.title,
            fontWeight: theme.font.weight.semibold,
            letterSpacing: '-0.035em'
          })}
        >
          Sign in to Sidecar
        </h1>
        <p mix={css({ color: theme.color.textMuted, lineHeight: 1.6 })}>
          Connect the Google account that manages your YouTube channel to view its private
          analytics.
        </p>
        {handle.props.error && loginErrors[handle.props.error] ? (
          <p
            role='alert'
            mix={css({ color: theme.color.danger, lineHeight: 1.6 })}
          >
            {loginErrors[handle.props.error]}
          </p>
        ) : null}
        <a
          href={routes.googleLogin.href()}
          data-rmx-document
          mix={css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.space.sm,
            width: '100%',
            boxSizing: 'border-box',
            marginTop: theme.space.lg,
            padding: `${theme.space.md} ${theme.space.lg}`,
            border: `${theme.borderWidth.subtle} solid ${theme.color.border}`,
            borderRadius: theme.radius.md,
            background: theme.color.surfaceRaised,
            color: theme.color.text,
            textDecoration: 'none',
            fontWeight: theme.font.weight.semibold,
            '&:hover': { background: theme.color.border },
            '&:focus-visible': {
              outline: `${theme.borderWidth.subtle} solid ${theme.color.accent}`,
              outlineOffset: theme.space.xs
            }
          })}
        >
          Continue with Google
        </a>
        <p
          mix={css({
            marginBottom: 0,
            color: theme.color.textMuted,
            fontSize: theme.font.size.small,
            lineHeight: 1.6
          })}
        >
          Sidecar only requests read access to your YouTube channel and analytics.
        </p>
      </div>
    </section>
  );
};
