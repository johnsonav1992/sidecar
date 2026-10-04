import { createController } from 'remix/router';

import { assets } from '../assets.ts';
import { routes } from '../routes.ts';

export default createController(routes, {
  actions: {
    assets: async (context) => {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 });
    }
  }
});
