# SuanCraft website

Official product, help and privacy pages for SuanCraft. This is an independent Git repository, separate from the native App repository above it.

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

English (US) is the source language at `/`. Eight additional locales match the App: `zh-Hans`, `zh-Hant`, `es`, `de`, `fr`, `ko`, `ja`, `ms`. Every locale has its own home, help and privacy page. Language switching preserves the current page and anchor; no preference cookie is used.

`content/app.json` is a committed snapshot of the native App's locales, minimum OS versions and release version. While this repository is checked out inside the native project, run `npm run sync:app` after changing those settings and `npm run check:app` to detect drift. Cloudflare builds are independent of the parent checkout. Translated copy lives in `content/<locale>.json`; validation rejects missing or empty keys.

## Cloudflare Pages

- GitHub repository: `qq345386817/suan-craft`, production branch `main`
- Project: `suan-craft`
- Build command: `npm run build && npm run check`
- Output directory: `dist`
- Node version: 22 via `.node-version`
- Canonical domain: <https://suan-craft.luopeike.com>

Add the custom domain in the Pages project before creating its Cloudflare DNS record. Use an account-level Cloudflare Bulk Redirect list and enabled rule for `suan-craft.pages.dev` → `https://suan-craft.luopeike.com` with status 301. Enable Preserve query string, Subpath matching and Preserve path suffix; leave Include subdomains disabled to retain preview URLs. Domain-level sources are not supported in Pages `_redirects`. `public/_redirects` keeps English and legacy support/privacy path aliases. `public/_headers` adds basic response headers. A real `404.html` prevents SPA fallback.

There is currently no public App Store listing or public TestFlight join link. Do not add a download button until distribution is verified. Public support and privacy contact: `cameoshell09@gmail.com`.

## Assets and privacy

`public/assets/abacus.jpg` is a crop of the real App's completed 987654321 demonstration, from the parent project's `docs/verification/chant-and-silent-audio-20261105/iphone-chant-demo-complete.png`. It is a product image, not an interactive browser abacus. The icon is the App's existing icon. The site loads no third-party fonts, analytics or advertising scripts. Generated visual concepts and QA evidence are kept outside this repository.
