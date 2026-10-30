# Asset credits and replacement guide

This is an independent concept project, not affiliated with or endorsed by AC Milan. This edition includes official-source player portraits, alternate hover poses, archive photographs and club crests at the user’s request. They remain copyrighted by their respective rights holders and are not covered by the MIT code license. Attribution does not grant permission for public redistribution or commercial use.

## Photography

These photographs are bundled under the [Unsplash License](https://unsplash.com/license), which permits downloading, modification and distribution as part of a project. The images are not public domain and the project code license does not override their license. No endorsement by photographers, subjects or venues is implied. Photos are resized/compressed; displayed crops and colour treatment may differ from originals.

| Local asset | Photographer | Source and subject |
| --- | --- | --- |
| `public/assets/stadium.jpg` | Daniele Simon | [San Siro at dusk](https://unsplash.com/photos/empty-soccer-stadium-at-dusk-with-lights-on-pojussMqLw0) — real San Siro venue image, not a depiction of an AC Milan fixture in the demonstration schedule. |
| `public/assets/architecture.jpg` | Pierre Antona | [San Siro exterior](https://unsplash.com/photos/a-large-stadium-building-with-a-red-roof-M7YlOxQ6zew). |
| `public/assets/pitch.jpg` | Marcel Strauß | [Football on grass](https://unsplash.com/photos/white-and-black-soccer-ball-on-green-grass-field-S6_s9q74JGY), Böhmenkirch, Germany — illustrative training imagery, not an AC Milan training session. |

The free-use license statements and photographer names were verified on the original Unsplash photo pages on 30 October 2026. Retain attribution when adapting this repository. Do not sell these images as standalone stock or assemble a competing image service.

## Typography

- **Bebas Neue**: Google Fonts distribution, SIL Open Font License 1.1. See `public/assets/BebasNeue-LICENSE.txt`.
- **Inter** (400, 500, 600, 700): Google Fonts distribution, SIL Open Font License 1.1. See `public/assets/Inter-LICENSE.txt`.
- Fonts downloaded from the Google Fonts CSS API and converted from TTF to WOFF2 solely for browser packaging; no glyph/design changes. Local files avoid third-party runtime font requests.

Source repositories: https://github.com/google/fonts/tree/main/ofl/bebasneue and https://github.com/google/fonts/tree/main/ofl/inter.

## Content and authenticity

Historical summaries should cite the official AC Milan and UEFA sources documented in the project. Club imagery and historical facts do not imply an official affiliation. The roster is a dated official-source snapshot. Fictional fixtures, match statistics and editorial demo stories remain visibly labeled. The historical Legends exhibition is a project curation, not a claim of official Hall of Fame membership.

To insert licensed player portraits, place optimized WebP/JPEG files under `public/assets`, update the appropriate data/markup image paths and descriptive alternative text, then append the source, license, author and any required credit here. Do not hotlink or redistribute official website photos without permission.

## Official-source assets — checked 30 October 2026

- 28 players / 56 images from https://www.acmilan.com/en/teams/men-first-team/all . Exact front and alternate source URLs, profile URLs and local filenames: `public/data/players.json`.
- Seven legend portraits from the official AC Milan archive and Hall of Fame. Seven team crests; six from AC Milan match pages, Lyon from its official club store. Full source mapping: `public/data/official-assets-extra.json`.
- Player PNGs were converted to 850px WebP with transparency retained. Archive images were converted to WebP, max 1600px. No faces were generated or substituted. Original official red treatments on Maldini, Pirlo and Seedorf are retained.
- These assets are rights-reserved. No club endorsement or redistribution license is claimed. Obtain appropriate permission before a public/commercial release.
