import { createRouter, type MiddlewareContext } from 'remix/router';
import { render } from 'remix/middleware/render';
import { staticFiles } from 'remix/middleware/static';

import { provideYoutube } from './middleware/provide-youtube.ts';
import controller from './actions/controller.tsx';
import { assets } from './assets.ts';
import { routes } from './routes.ts';

const renderMiddleware = render({ assets });
type AppContext = MiddlewareContext<[typeof provideYoutube, typeof renderMiddleware]>;

declare module 'remix' {
  interface RouterTypes {
    context: AppContext;
  }
}

export const router = createRouter<AppContext>({
  middleware: [staticFiles('./public', { index: false }), provideYoutube, renderMiddleware]
});

router.map(routes, controller);
