# ClubSphere — AC Milan Edition

**A cinematic football experience. Built with Next.js App Router. Exported as a static website.**

Independent concept project. Not affiliated with or endorsed by AC Milan.

![Official player portraits](docs/screenshots/real-players.jpg)

A complete migration of ClubSphere's HTML edition: dark editorial layouts, official player portraits with alternate hover poses, a heritage archive, match experiences, and interactive fan tools. No backend, database, authentication, API keys, or paid services are required.

**Demo:** replace this with `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/` after your first deployment.

## Quick start

Requires Node.js **22 or newer** and npm.

```bash
npm ci --include=dev
npm run dev
```

Open http://localhost:3000. For production:

```bash
npm run build
npm run check
npm run preview
```

Preview the static export at http://localhost:4174. The deployable website is in **`out/`**. Do not run `next start`: this project is a static export. Do not open HTML through `file://`; use an HTTP server so JSON loading and modules work.

## Deploy directly to GitHub Pages

1. Create a GitHub repository, for example `clubsphere`.
2. Extract this ZIP and upload the **contents of the project directory** to the repository root. Include `.github/workflows/deploy.yml`, `package-lock.json`, and the other dotfiles. Do not upload `node_modules`, `.next`, or `out`.
3. Use `main` as the branch (or change the workflow's branch filter).
4. Open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. Push to `main`, or select **Actions → Deploy ClubSphere to GitHub Pages → Run workflow**.
6. When both jobs finish, use the URL in the deployment/environment summary.

The workflow installs the locked dependencies, builds the site, checks exported links, uploads `out/`, and deploys it. No personal token or manual `gh-pages` branch is needed. The workflow requires repository Pages support and permission to run Actions. Publishing a repository does not grant rights to its third-party photographs.

### Repository paths, user sites, and custom domains

`actions/configure-pages` supplies the correct `base_path` automatically:

| Destination | Build base path |
| --- | --- |
| `username.github.io/clubsphere/` | `/clubsphere` |
| `username.github.io/` | empty |
| Custom domain configured in Pages | empty |

Both page links and runtime-loaded player data use the same prefix. To reproduce a project-site deployment locally:

```bash
# Bash / macOS / Linux
NEXT_PUBLIC_BASE_PATH=/clubsphere npm run build
NEXT_PUBLIC_BASE_PATH=/clubsphere npm run check
NEXT_PUBLIC_BASE_PATH=/clubsphere npm run preview
```

```powershell
# Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH = '/clubsphere'
npm run build
npm run check
npm run preview
```

Then open http://localhost:4174/clubsphere/. Remove the environment variable and rebuild for a root-domain deployment. `basePath` is compiled into the build; it cannot be changed by renaming the exported folder afterwards.

For a custom domain, configure DNS and the domain in GitHub Pages settings, then rerun the workflow. You can optionally set `PAGES_CUSTOM_DOMAIN` at build time to emit `out/CNAME`. `.nojekyll` is emitted automatically. All routes end in `/` and export their own `index.html`, so deep links and refresh work without server rewrites. GitHub Pages uses `out/404.html` for unknown paths.

## Features

- 60 editorial views, including a custom not-found page.
- Home, club, history, honours, academy, partners, contact and credits.
- 28 player profiles with 56 official front/alternate portraits.
- Squad position filters, accessible hover/focus states, touch portrait switch.
- Seven legend profiles, archive photography and actual team crests.
- Fixtures and results filters, match panels, countdowns that never become negative.
- News archive, individual articles, gallery dialogs and copy-link controls.
- Five-question quiz, four formation models and local favourite-player persistence.
- Responsive navigation with a native modal dialog and keyboard handling.
- Local contact-brief download: no email is sent and no form data leaves the device.

Fixture scores, schedules, match events and lineups are **illustrative**. Player identities and photos are a dated snapshot, not a live feed. Content is English; Persian setup guidance is in [README.fa.md](README.fa.md).

## Architecture

```text
app/
  layout.jsx                 Root App Router layout and metadata
  globals.css                Tailwind utilities
  page.jsx                   Home (generated JSX)
  not-found.jsx              Custom 404 (generated JSX)
  squad/page.jsx             Explicit static route
  player-*/page.jsx          Explicit player routes
components/
  SiteShell.jsx              Shared header, footer and dialogs (generated)
  Enhancements.jsx           Client-only interaction initialization
lib/paths.js                 Shared basePath-aware URL helper
public/assets/               Local photographs, logos, fonts and CSS
public/data/                 Players, fixtures, stories, legends and sources
public/js/                   Modular UI, football and fan interactions
scripts/content.mjs          Editorial templates + JSON-driven content
scripts/generate-pages.mjs   Compiles templates to genuine JSX route files
scripts/check-export.mjs     Validates exported pages and asset references
.github/workflows/deploy.yml GitHub Pages build and deploy
```

Next.js renders the JSX pages during the build. They are not HTML injected with `dangerouslySetInnerHTML`, and no runtime HTML parser is shipped. There are no route handlers, server actions, cookies, dynamic server rendering or image-optimization server. The parser is a development-only dependency.

Internal page links use **Next Link and App Router client-side navigation**: switching pages does not reload the whole document. External links, downloads and same-page anchors retain their native behavior. Browser back/forward and direct deep links remain supported.

The client enhancement layer reacts to pathname changes. Every route owns an abortable scope for event listeners, pending player-data fetches, timers, animation frames and observers. Cleanup prevents duplicate handlers and stale responses when users navigate away, return, or run development Strict Mode. Menus close on navigation and scroll locking is released.

`output: 'export'` is retained only to deploy on GitHub Pages, which cannot run a Next.js server. **Exported hosting and SPA navigation are compatible**: HTML handles first loads; Next's static route payloads handle subsequent transitions. There is no application backend.

## Customize

1. Edit `public/data/players.json`, `legends.json`, `fixtures.json` and `stories.json` for content.
2. Edit shared editorial markup and layouts in `scripts/content.mjs`.
3. Edit component styles in `public/assets/style.css`, utility colors in `tailwind.config.cjs`, and interactions in `public/js/`.
4. Run `npm run prepare:pages` or `npm run build` to regenerate route JSX and `SiteShell`.

Generated route files are included for inspection and IDE navigation. **Do not edit generated files directly**: the next build overwrites them. When changing JSON/templates during `npm run dev`, rerun `npm run prepare:pages` in another terminal. For a removed page, remove its corresponding generated `app/...` directory too.

To adapt to another club, replace palette tokens, name/wordmark, local asset collection, JSON data, editorial copy, source links, legal disclaimer, metadata and the README screenshot. Keep example match data clearly identified. Asset names in JSON are relative to `public/assets/`.

## Accessibility and performance

Semantic landmarks, skip link, meaningful image alternatives, visible focus, native dialogs, labelled filters, live result messages and reduced-motion support are retained. Fonts and photographs are local; portraits are optimized WebP. Below-fold imagery is lazy-loaded. Real images use native `img` elements; Next image server optimization is disabled for static hosting.

Export checks cover root and repository-prefix paths. Production builds, route links and lifecycle cleanup are checked; browser verification is recorded separately. This is not a formal accessibility audit. See [docs/NEXT-VERIFICATION.md](docs/NEXT-VERIFICATION.md).

## Assets and license

Original source code is covered by [LICENSE](LICENSE). **That license does not cover AC Milan/team marks, official portraits, archival photos, or other third-party assets.** They remain the property of their respective rights holders. Source URLs and credits are recorded in [ASSET-CREDITS.md](ASSET-CREDITS.md), player JSON and `public/data/official-assets-extra.json`. Obtain appropriate permission for public redistribution/commercial use, or replace restricted images with assets you own before publishing publicly.

## References

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Made as an independent portfolio concept celebrating football, design and front-end engineering.
