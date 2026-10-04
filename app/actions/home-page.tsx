import { css } from 'remix/component';

import { theme } from '../theme/theme.ts';

export const HomePage = () => {
  return () => (
    <h1
      mix={css({
        margin: 0,
        fontSize: theme.font.size.title,
        fontWeight: theme.font.weight.semibold,
        letterSpacing: '-0.035em'
      })}
    >
      Dashboard
    </h1>
  );
};
