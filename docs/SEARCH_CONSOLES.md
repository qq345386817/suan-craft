# Search console submission

Observed on 2026-11-09 for `https://suan-craft.luopeike.com/`, using the existing signed-in Google and Bing accounts.

| Service | Ownership | Sitemap result |
| --- | --- | --- |
| Google Search Console | Verified using the official HTML file | `/sitemap.xml`: Success, 27 discovered pages, 0 videos; submitted and read on 2026-11-09 |
| Bing Webmaster Tools | Verified using a dedicated DNS CNAME | Full sitemap URL accepted; 1 known sitemap, Processing, 0 errors, 0 warnings, total discovered URLs 0 at this observation |

In Bing's individual sitemap row, last crawl and discovered URLs were still shown as `-`; those fields are pending, not confirmed zero. The summary above reports the separate aggregate counter exactly as displayed. Neither result proves that the 27 pages are indexed or ranked.

## Configuration to retain

- Canonical site property: `https://suan-craft.luopeike.com/`.
- Sitemap: `https://suan-craft.luopeike.com/sitemap.xml`.
- Google file: `public/google8bdd3bd447b6e703.html`, copied unchanged to the output root. Cloudflare Pages redirects its `.html` URL to the extensionless path; Google accepted this file verification.
- Bing file: `public/BingSiteAuth.xml`, copied unchanged to the output root. The live file matched the downloaded bytes, but Bing reported it could not access it. It is retained as a public verification asset, not treated as the successful verification method.
- Successful Bing DNS record: CNAME `3e48d0a44f761acc68eb56f04e379b7b.suan-craft.luopeike.com` → `verify.bing.com`, DNS-only, Auto TTL. Both `1.1.1.1` and `8.8.8.8` returned the expected CNAME.
- Existing website record remains CNAME `suan-craft.luopeike.com` → `suan-craft.pages.dev`, Proxied. The custom-domain redirect and other zone settings were not changed.

Verification files were published in website commit `840bb23f4b436fd5817f821336c78f8776d5d5e9`. The production `deployment.json` returned that commit and the expected repository; live verification files matched the source. Do not delete the files or DNS record after verification.

## Checks and scope

`npm run build` and `npm run check` passed: nine locales, 27 canonical home/help/privacy pages, internal links, anchors, assets and redirects. Live homepage and robots returned 200; homepage canonical matched the custom domain and had no `noindex`. Robots allowed crawling and referenced the correct sitemap. The live XML contained 27 unique canonical URLs, matching the local sitemap.

The first live sitemap request and the first deployment receipt request timed out during TLS setup; targeted retries succeeded. A Git remote read also had a transient TLS error, then returned commit `840bb23`. These failed attempts were retained in local evidence rather than described as a persistent site outage.

This work added the site properties, verification assets/record and sitemap submissions. It did not grant Bing new Google access, enable analytics or Clarity, configure IndexNow, alter existing security rules, or change product copy, privacy disclosures, App source or release metadata. Subsequent indexing and crawl results require a later console readback.

Console links: [Google sitemap report](https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fsuan-craft.luopeike.com%2F), [Bing sitemap report](https://www.bing.com/webmasters/sitemaps?siteUrl=https%3A%2F%2Fsuan-craft.luopeike.com%2F).
