import { google } from 'googleapis';
import { refreshExternalAuth } from 'remix/auth';
import { Auth, type AuthState } from 'remix/middleware/auth';
import type { Middleware } from 'remix/router';
import { createRedirectResponse } from 'remix/response/redirect';
import { Session } from 'remix/session';

import { googleProvider } from '../auth/google-provider.ts';
import type { SidecarIdentity } from '../auth/require-google-auth.ts';
import { sqliteTokenStore } from '../data/sqlite-token-store.ts';
import { routes } from '../routes.ts';
import { YouTubeApi } from '../api/youtube-api.ts';

type YoutubeMiddlewareFn = Middleware<{
  key: typeof YouTubeApi;
  value: YouTubeApi;
  property: 'youtube';
}>;

export const provideYoutube: YoutubeMiddlewareFn = async (context, next) => {
  const auth = context.get(Auth) as AuthState<SidecarIdentity> | undefined;

  if (!auth?.ok) {
    context.set(YouTubeApi, new YouTubeApi(new google.auth.OAuth2()), { property: 'youtube' });

    return next();
  }

  const session = context.get(Session);

  const storedAuth = await sqliteTokenStore.get(auth.identity.email);

  if (!storedAuth) {
    session?.unset('auth');

    return createRedirectResponse(routes.login.href());
  }

  try {
    let tokens = storedAuth.tokens;

    if (tokens.expiresAt && tokens.expiresAt.getTime() <= Date.now()) {
      try {
        tokens = (await refreshExternalAuth(googleProvider, tokens)).tokens;
      } catch {
        return createRedirectResponse(`${routes.login.href()}?error=reauthorize`);
      }

      if (!tokens.refreshToken) tokens.refreshToken = storedAuth.tokens.refreshToken;
      await sqliteTokenStore.save({ ...storedAuth, tokens });
    }

    const client = new google.auth.OAuth2();
    client.setCredentials({ access_token: tokens.accessToken });
    context.set(YouTubeApi, new YouTubeApi(client), { property: 'youtube' });
  } catch {
    return new Response('Unable to prepare YouTube access. Please try again.', { status: 503 });
  }

  return next();
};
