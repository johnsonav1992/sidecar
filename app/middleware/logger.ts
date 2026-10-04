import { logger as remixLogger } from 'remix/middleware/logger';
import type { Middleware } from 'remix/router';

const accessLog = remixLogger();

export const logger: Middleware = async (context, next) => {
  if (context.url.pathname.startsWith('/assets')) {
    return next();
  }

  return accessLog(context, next);
};
