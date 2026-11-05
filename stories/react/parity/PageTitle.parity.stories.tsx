import type { Meta, StoryObj } from '@storybook/react-vite';

import { PageTitle } from '../../../src/react/PageTitle.tsx';
import * as plays from '../../plays/page-title.ts';

// The React twin of stories/parity/PageTitle.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = { title: 'Parity/PageTitle' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// A local image, so the tests don't depend on the network: diagonal stripes.
const image =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300"><defs><pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="60" fill="#e84a27"/><rect x="30" width="30" height="60" fill="#5e6669"/></pattern></defs><rect width="1200" height="300" fill="url(#p)"/></svg>',
  );

const themes = [undefined, 'blue', 'orange', 'white'] as const;

/**
 * `PageTitle` with the same variants, styled by ilw-ui's `page-title.css` only.
 *
 * **Why:** the play function checks the markup (an `<h1>`, a decorative image) and each theme's text and plate colours. axe checks the contrast where there is no image.
 *
 * **Review:** matches **Toolkit**: the default is white on Illinois Blue; blue is the same; orange is blue-on-orange; white is blue on white. With an image, the plate is translucent; with fade it is solid and the image fades out downwards. Narrow the window: the title shrinks at 800 px and 600 px.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <>
      {themes.map((theme) => (
        <PageTitle key={theme ?? 'default'} theme={theme}>
          Graduate Programs ({theme ?? 'default'})
        </PageTitle>
      ))}
      <PageTitle image={image}>With an image</PageTitle>
      <PageTitle image={image} fade>
        With an image, fade
      </PageTitle>
    </>
  ),
  play: plays.parity,
};
