import 'dotenv/config';

import { OAuth2Client } from 'google-auth-library';
import type { Middleware } from 'remix/router';

import { YOUTUBE_OAUTH_SCOPES, YouTubeApi } from '../api/youtube-api.ts';

const oauthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauthClient.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
}

type YoutubeMiddlewareFn = Middleware<{
  key: typeof YouTubeApi;
  value: YouTubeApi;
  property: 'youtube';
}>;

/**
 * Adds the authenticated YouTube API wrapper to every request context.
 * Configure the Google OAuth environment variables before calling YouTube methods.
 */
export const provideYoutube: YoutubeMiddlewareFn = (context, next) => {
  context.set(YouTubeApi, new YouTubeApi(oauthClient), { property: 'youtube' });

  return next();
};

/** Build the consent URL for a one-time refresh-token setup or a future login flow. */
export const getYouTubeAuthorizationUrl = (state = 'youtube-auth') => {
  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: Object.values(YOUTUBE_OAUTH_SCOPES),
    state
  });
};

/** Exchange the authorization code from Google's OAuth redirect for tokens. */
export const exchangeYouTubeAuthorizationCode = async (code: string) => {
  const { tokens } = await oauthClient.getToken(code);

  return tokens;
};
