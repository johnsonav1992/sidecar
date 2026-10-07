import { createGoogleAuthProvider } from 'remix/auth';

import { YOUTUBE_OAUTH_SCOPES } from '../api/youtube-api.ts';

const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);

  return value;
};

export const allowedYoutubeChannelId = process.env.GOOGLE_ALLOWED_CHANNEL_ID?.trim() ?? null;

export const googleProvider = createGoogleAuthProvider({
  clientId: required('GOOGLE_CLIENT_ID'),
  clientSecret: required('GOOGLE_CLIENT_SECRET'),
  redirectUri: required('GOOGLE_REDIRECT_URI'),
  scopes: ['openid', 'email', ...Object.values(YOUTUBE_OAUTH_SCOPES)],
  authorizationParams: {
    access_type: 'offline',
    prompt: 'consent select_account'
  }
});
