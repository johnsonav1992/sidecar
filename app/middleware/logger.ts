import { logger as rmxLogger } from 'remix/middleware/logger';
import type { Middleware } from 'remix/router';

export const logger: Middleware = async (context, next) => {
  if (context.url.pathname.startsWith('/assets')) {
    return next();
  }

  return rmxLogger()(context, next);
};
