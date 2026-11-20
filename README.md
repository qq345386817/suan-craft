# SuanCraft website

Official product, help and privacy pages for SuanCraft. This is an independent Git repository, separate from the native App repository above it. The native source is [`qq345386817/SuanCraft`](https://github.com/qq345386817/SuanCraft); this website is [`qq345386817/suan-craft`](https://github.com/qq345386817/suan-craft). Commit and push each repository separately.

## Local development

Node.js 22; no runtime or build dependencies.

```sh
npm ci
npm run build
npm run check
npm start
```

Open <http://127.0.0.1:4173>. The preview server does not emulate Cloudflare redirects or headers; verify those on the deployed site.

## Languages and App alignment

English (US) is the source language at `/`. The additional App locales are `zh-Hans`, `zh-Hant`, `es`, `de`, `fr`, `ko`, `ja`, `ms`, `ar`, `hi`, `ru`. Every locale has its own home, help and privacy page. Language switching preserves the current page and anchor; no preference cookie is used.

`content/app.json` is a committed snapshot of the native App's locales, minimum OS versions and release version. While this repository is checked out inside the native project, run `npm run sync:app` after changing those settings or Fastlane metadata and `npm run check:app` to detect drift. Cloudflare builds are independent of the parent checkout. Translated copy lives in `content/<locale>.json`; validation rejects missing or empty keys.

## Cloudflare Pages

- GitHub repository: `qq345386817/suan-craft`, production branch `main`
- Project: `suan-craft`
- Build command: `npm run build && npm run check`
- Output directory: `dist`
- Node version: 22 via `.node-version`
- Canonical domain: <https://suan-craft.luopeike.com>

Add the custom domain in the Pages project before creating its Cloudflare DNS record. Use an account-level Cloudflare Bulk Redirect list and enabled rule for `suan-craft.pages.dev` → `https://suan-craft.luopeike.com` with status 301. Enable Preserve query string, Subpath matching and Preserve path suffix; leave Include subdomains disabled to retain preview URLs. Domain-level sources are not supported in Pages `_redirects`. `public/_redirects` keeps English and legacy support/privacy path aliases. `public/_headers` adds basic response headers. A real `404.html` prevents SPA fallback.

For support and privacy questions, email `cameoshell09@gmail.com`.

## Search engine verification

Use the canonical property `https://suan-craft.luopeike.com/` and submit `https://suan-craft.luopeike.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. The sitemap contains the 36 canonical home, help and privacy URLs across twelve locales; the Pages default domain redirects to this custom domain.

`public/google8bdd3bd447b6e703.html` and `public/BingSiteAuth.xml` are the official, publicly served ownership files downloaded from the existing Google and Bing accounts. Keep both files unchanged and tracked after verification so future deployments retain ownership. `build.mjs` copies them to the output root; they are not product pages and are not added to the sitemap. Submission acceptance and actual indexing are separate results.

Google verified the HTML file. Bing's XML fetch failed, so ownership uses a dedicated DNS-only CNAME: `3e48d0a44f761acc68eb56f04e379b7b.suan-craft.luopeike.com` → `verify.bing.com`. Keep that verification record as well as the existing proxied website CNAME. Both sitemaps were submitted on 2026-11-09; the observed results and evidence boundaries are recorded in [Search consoles](docs/SEARCH_CONSOLES.md).

## Assets and privacy

`public/assets/abacus.jpg` is the retained crop of the real App's completed 987654321 demonstration, captured during the 2026-11-05 iPhone QA session. The original QA screenshot was removed during the parent project's storage cleanup; this published product asset remains tracked here. It is a product image, not an interactive browser abacus. The icon is the App's existing icon. The site loads no third-party fonts, analytics or advertising scripts. Generated visual concepts and QA evidence are kept outside this repository. Keep the product image and icon tracked; exclude `dist/`, local credentials and generated QA captures from commits.

## Product copy, SEO and release facts

Maintain SEO titles and descriptions in all twelve content files. The four game names come from the App catalog. Help and privacy pages describe the counting rod board and the saved short practice. Arabic pages read right to left and render equations left to right. Each language has a local help and privacy URL plus a localized 404 page. JSON-LD features match the visible home text.

content/store-metadata.json is a snapshot of local Fastlane copy, explicitly not proof of live App Store metadata. The parent-only check:app also detects metadata drift. Cloudflare builds use committed snapshots without the parent repo. No public price, rating, download link or released version is inferred from a source build. deployment.json identifies the actual website commit built by Cloudflare for production readback.

The Arabic website uses `/ar/`, while the store metadata uses `ar-SA`. Hindi and Russian use `/hi/` and `/ru/` on the site and `hi` and `ru` in store metadata. Run `npm run sync:app` from this repo to refresh the manifests after changing translations in the parent repo.
