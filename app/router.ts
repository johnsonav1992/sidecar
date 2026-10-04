import { createRouter, type MiddlewareContext } from 'remix/router';
import { render } from 'remix/middleware/render';
import { staticFiles } from 'remix/middleware/static';

import { provideChannel } from './middleware/provide-channel.ts';
import { logger } from './middleware/logger.ts';
import { provideYoutube } from './middleware/provide-youtube.ts';
import controller from './actions/controller.tsx';
import dashboardController from './actions/dashboard/controller.tsx';
import { assets } from './assets.ts';
import { routes } from './routes.ts';
const renderMiddleware = render({ assets });
type AppContext = MiddlewareContext<
  [typeof provideYoutube, typeof provideChannel, typeof renderMiddleware]
>;

declare module 'remix' {
  interface RouterTypes {
    context: AppContext;
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    staticFiles('./public', { index: false }),
    provideYoutube,
    provideChannel,
    renderMiddleware,
    logger
  ]
});

router.map(routes, controller);
router.map(routes.dashboard, dashboardController);
