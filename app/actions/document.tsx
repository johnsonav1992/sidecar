import type { Handle, RemixNode } from 'remix/component';
import { css } from 'remix/component';
import { ImportMap } from 'remix/component/server';

import { scriptEntry } from '../assets.ts';
import { theme } from '../theme/theme.ts';
import { AppLayout } from '../ui/app-layout.tsx';

export interface DocumentProps {
  children?: RemixNode;
  head?: RemixNode;
  title?: string;
}

const DEFAULT_TITLE = 'Sidecar';

export const Document = (handle: Handle<DocumentProps>) => {
  return () => {
    let { children, head, title = DEFAULT_TITLE } = handle.props;
    let { href, importMap, preloads } = scriptEntry;

    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1'
          />
          <meta
            name='color-scheme'
            content='dark'
          />
          <link
            rel='preconnect'
            href='https://fonts.googleapis.com'
          />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='anonymous'
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          />
          <link
            rel='icon'
            type='image/svg+xml'
            href='/favicon.svg'
          />
          <title>{title}</title>
          {head}
          <ImportMap value={importMap} />
          {preloads.map((preloadHref) => (
            <link
              key={preloadHref}
              rel='modulepreload'
              href={preloadHref}
            />
          ))}
          <script
            type='module'
            src={href}
          ></script>
        </head>
        <body
          mix={css({
            margin: 0,
            minHeight: '100vh',
            background: theme.color.background,
            color: theme.color.text,
            fontFamily: theme.font.family
          })}
        >
          <AppLayout>{children}</AppLayout>
        </body>
      </html>
    );
  };
};
