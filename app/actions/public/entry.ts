import {
  detectMultipleImportMapSupport,
  importModule,
  preloadShim
} from 'remix/multiple-import-maps-polyfill';
import { run } from 'remix/component';

const app = run({
  loadModule: async (moduleUrl, exportName) => {
    let mod = await importModule(moduleUrl);
    let Component = mod[exportName];

    if (typeof Component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`);
    }

    return Component;
  },
  processClientEntryPreloads: async (preloads) => {
    if (await detectMultipleImportMapSupport()) return preloads;

    preloadShim(preloads);

    return [];
  }
});

if (import.meta.hot) {
  import.meta.hot.on('server:update', async () => {
    try {
      await app.ready();
      await app.frames.top.reload();
    } catch (error) {
      console.error('Error reloading top frame on server update', error);
    }
  });
}
