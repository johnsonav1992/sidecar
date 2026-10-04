import type { Handle, RemixNode } from 'remix/component';
import { clientEntry } from 'remix/component';

export const FrameLoader = clientEntry(
  `${import.meta.url}#FrameLoader`,
  (handle: Handle<{ children: RemixNode; fallback: RemixNode }>) => {
    let pending = false;

    handle.frame.addEventListener(
      'reloadStart',
      () => {
        pending = true;
        handle.update();
      },
      { signal: handle.signal }
    );

    handle.frame.addEventListener(
      'reloadComplete',
      () => {
        pending = false;
        handle.update();
      },
      { signal: handle.signal }
    );

    return () => (
      <div aria-busy={pending}>{pending ? handle.props.fallback : handle.props.children}</div>
    );
  }
);
