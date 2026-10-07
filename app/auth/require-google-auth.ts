import { auth, createSessionAuthScheme, requireAuth } from 'remix/middleware/auth';
import type { Middleware } from 'remix/router';
import { createRedirectResponse } from 'remix/response/redirect';

import { sqliteTokenStore } from '../data/sqlite-token-store.ts';
import { routes } from '../routes.ts';

export type SidecarIdentity = {
  email: string;
  providerAccountId: string;
};

const publicPaths = new Set([
  routes.login.href(),
  routes.googleLogin.href(),
  routes.googleCallback.href(),
  routes.logout.href()
]);

const isPublicPath = (pathname: string) => {
  return publicPaths.has(pathname) || pathname.startsWith('/assets/');
};

export const authMiddleware = auth({
  schemes: [
    createSessionAuthScheme<SidecarIdentity, SidecarIdentity>({
      read: (session, context) => {
        if (isPublicPath(context.url.pathname)) return null;

        const value = session.get('auth');

        if (!value || typeof value !== 'object') {
          return null;
        }

        const identity = value as Partial<SidecarIdentity>;

        if (typeof identity.email !== 'string' || typeof identity.providerAccountId !== 'string') {
          return null;
        }

        return { email: identity.email, providerAccountId: identity.providerAccountId };
      },
      verify: async (identity) => {
        const storedAuth = await sqliteTokenStore.get(identity.email);

        if (!storedAuth || storedAuth.providerAccountId !== identity.providerAccountId) {
          return null;
        }

        return identity;
      },
      invalidate: (session) => {
        session.unset('auth');
      }
    })
  ]
});

const enforceAuth = requireAuth<SidecarIdentity>({
  onFailure: () => createRedirectResponse(routes.login.href())
});

export const requireGoogleAuth: Middleware = (context, next) => {
  if (isPublicPath(context.url.pathname)) return next();

  return enforceAuth(context, next);
};
