import { createCookie } from 'remix/cookie';
import { createCookieSessionStorage } from 'remix/session-storage/cookie';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) throw new Error('SESSION_SECRET is required');

export const sessionCookie = createCookie('__sidecar', {
  secrets: [sessionSecret],
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30
});

export const sessionStorage = createCookieSessionStorage();
