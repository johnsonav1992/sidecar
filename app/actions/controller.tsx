import { completeAuth, finishExternalAuth, startExternalAuth } from 'remix/auth';
import { google } from 'googleapis';
import { createController } from 'remix/router';
import { createRedirectResponse } from 'remix/response/redirect';

import { allowedYoutubeChannelId, googleProvider } from '../auth/google-provider.ts';
import { assets } from '../assets.ts';
import { sqliteTokenStore } from '../data/sqlite-token-store.ts';
import { routes } from '../routes.ts';
import { Document } from './document.tsx';
import { LoginPage } from './login-page.tsx';

export default createController(routes, {
  actions: {
    home: () => createRedirectResponse(routes.dashboard.index.href()),
    login: (context) => {
      return context.render(
        <Document
          title='Sign in · Sidecar'
          channel={null}
        >
          <LoginPage
            error={
              !allowedYoutubeChannelId
                ? 'configuration'
                : (context.url.searchParams.get('error') ?? undefined)
            }
          />
        </Document>
      );
    },
    googleLogin: (context) => {
      if (!allowedYoutubeChannelId) {
        return createRedirectResponse(`${routes.login.href()}?error=configuration`);
      }

      return startExternalAuth(googleProvider, context, {
        returnTo: routes.dashboard.index.href()
      });
    },
    googleCallback: async (context) => {
      try {
        const { result, returnTo } = await finishExternalAuth(googleProvider, context);
        const email = result.profile.email?.trim().toLowerCase();

        if (!allowedYoutubeChannelId) {
          return createRedirectResponse(`${routes.login.href()}?error=configuration`);
        }

        if (!email) {
          return createRedirectResponse(`${routes.login.href()}?error=profile`);
        }

        const previousAuth = await sqliteTokenStore.get(email);
        const refreshToken = result.tokens.refreshToken ?? previousAuth?.tokens.refreshToken;
        if (!refreshToken) throw new Error('Google did not return a refresh token');

        const tokens = { ...result.tokens };
        delete tokens.idToken;

        const client = new google.auth.OAuth2();
        client.setCredentials({ access_token: tokens.accessToken });
        const { data } = await google.youtube({ version: 'v3', auth: client }).channels.list({
          part: ['id'],
          mine: true
        });

        if (!data.items?.some((channel) => channel.id === allowedYoutubeChannelId)) {
          return createRedirectResponse(`${routes.login.href()}?error=channel`);
        }

        await sqliteTokenStore.save({
          email,
          providerAccountId: result.account.providerAccountId,
          tokens: { ...tokens, refreshToken }
        });

        completeAuth(context).set('auth', {
          email,
          providerAccountId: result.account.providerAccountId
        });

        return createRedirectResponse(returnTo ?? routes.dashboard.index.href());
      } catch (error) {
        console.error(
          'Google authorization failed',
          error instanceof Error ? error.message : 'Unknown error'
        );

        return createRedirectResponse(`${routes.login.href()}?error=authorization`);
      }
    },
    logout: (context) => {
      context.session.unset('auth');
      context.session.regenerateId(true);

      return createRedirectResponse(routes.login.href());
    },
    assets: async (context) => {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 });
    }
  }
});
