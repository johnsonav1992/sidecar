import type { Handle } from 'remix/component';
import { clientEntry } from 'remix/component';

export const FrameLoader = clientEntry(`${import.meta.url}#FrameLoader`, (handle: Handle) => {
  const sync = (pending: boolean) => {
    const marker = document.getElementById(handle.id);
    const region = marker?.closest('[data-snapshot-frame]');

    if (!(region instanceof HTMLElement)) return;

    setPending(region, pending, rangeFromSrc(handle.frame.src));
  };

  handle.frame.addEventListener('reloadStart', () => sync(true), { signal: handle.signal });
  handle.frame.addEventListener('reloadComplete', () => sync(false), { signal: handle.signal });

  return () => (
    <span
      id={handle.id}
      hidden={true}
    />
  );
});

const rangeFromSrc = (src: string): string | null => {
  try {
    return new URL(src, window.location.href).searchParams.get('range');
  } catch {
    return null;
  }
};

const setPending = (region: HTMLElement, pending: boolean, range: string | null) => {
  const content = region.querySelector('[data-snapshot-slot="content"]');
  const fallback = region.querySelector('[data-snapshot-slot="fallback"]');

  if (content instanceof HTMLElement) content.hidden = pending;

  if (fallback instanceof HTMLElement) {
    fallback.hidden = !pending;

    if (pending && range) {
      for (const link of fallback.querySelectorAll('a')) {
        const active = rangeFromSrc(link.href) === range;

        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    }
  }

  region.setAttribute('aria-busy', pending ? 'true' : 'false');
};
