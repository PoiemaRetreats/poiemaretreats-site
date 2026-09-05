# Poiema modernization

## Scope

About and Funding photo restoration: all five original About photos and both Funding photos are restored from the archived WordPress uploads, encoded as WebP without enlargement. About opens with the uncropped waterfront group photo and includes the meal, friends, and two leader portraits. Funding opens with its group photo and retains the shirt photo beside giving. Copy and giving URLs are unchanged. Sources under `/wp-content/uploads/2021/10/`: `IMG_2846-scaled-e1633985563938.jpg`, `IMG_2851.jpg`, `IMG_2866.jpg`, `IMG_2293-scaled.jpg`, `Lobster.jpg`, `IMG_2890.jpg`, and `IMG_2865-e1633980750295.jpg`.

Live registration verification: the review Worker's `no-referrer` policy left the provider iframe blank. Authorized asset responses now use `strict-origin-when-cross-origin`, allowing the form's parent-origin handshake without exposing the invitation key. The key-exchange redirect retains `no-referrer`. The deployed OBX form now displays Step 1 of 5, its fields, and Next. No registration or payment was submitted.

Retreat grouping: the media archive now renders separate retreat sections and a Retreat dropdown alongside the other filters. Current source titles establish Poiema OBX 2024 and Spring Poiema 2023; no exact event dates were invented. Unidentified material remains under Other recordings. Newest/oldest sorting orders the retreat groups, and numbered talks stay in sequence. Verified Spring 2023 plus Lecture returns talks 1 through 4, title search narrows to one, reset restores all 14, and query selections survive a reload.

Media and signup update: media now has search, year/type filters, newest/oldest/title sorting, a live result count, no-results state, reset, and shareable filter query parameters. Known title years provide year-level sorting where exact recording dates are absent; undated recordings sort last. Existing recording content is unchanged.

Reuben confirmed MinistryForms as the current registration provider. Retreat detail pages no longer prefer archived Google/Jotform/payment links. The `easy_tithe_form_id` field now configures each retreat's MinistryForms form. His supplied ID is specifically titled Poiema OBX 2026 and shows a $400 fee in the provider UI, so it is assigned to OBX only. Other retreats require their corresponding form IDs rather than being silently sent to OBX. The `/registration` page embeds this OBX form and is linked by the homepage's OBX button. The component includes a direct-form fallback. The provider's form rendered on desktop/mobile; no registration or payment was submitted.

Preview access clarification: unauthenticated requests now return a 403 page explaining that the full invitation link is needed, rather than a misleading 404. The access key is still required and the preview remains noindex/private. The preview is deployed using Wrangler to Cloudflare Workers, not through a Cloudflare MCP.

Main-only scope correction: alternate design work is stopped. The main homepage now preserves the original eight-section order, all 33 source text blocks, all five testimonials, six CTA buttons, and six image placements. Both original retreat panels are retained with their original printed dates plus a separate date-confirmation note. Their formerly broken product links now reach the existing corresponding registration pages. The unpublished CMS seed events remain drafts. Run `node scripts/check-home-copy.mjs` to prevent omissions, or set `POIEMA_REVIEW_ORIGIN=https://review.poiemaretreats.org` to test the private deployed snapshot.

Copy correction, 2026-09-05: the homepage and all three concepts now reuse original WordPress wording through `src/data/original-copy.ts`. Removed the replacement marketing headlines and paragraphs. Restored the original headline, Scripture quotation, full value descriptions, donation wording, and all five testimonials on the main page. Only layout, short navigation labels, and the empty-state contact prompt differ where needed. Uncertain event dates remain unpublished rather than being rewritten.

Hero image check: WordPress media item 747 identifies `DA2A4259.jpg` as 1334 by 885 pixels at full size. The downloaded photo and direct JPEG both have those dimensions. The listed derivatives are smaller, and no larger duplicate was found in the archived media inventory. The same photo is retained without artificial enlargement.

The main design keeps the Greek wordmark, gold accents, existing group photography, purpose copy, and testimonials. It replaces the starter's spacing, typography, colors, navigation, and homepage layout. Shared styles clean up the other pages. Mobile navigation and light/dark controls work without paid plugins.

Three independent homepage concepts live at `/designs/coast`, `/designs/gather`, and `/designs/heritage`. They have no public navigation links. A secret link exchanges its access key for an HTTP-only cookie. Unauthenticated requests return 404. Responses prohibit indexing and caching.

## Current deployment boundary

Cloudflare account access and GitHub access work. Both empty D1 databases are provisioned and configured. R2 is not enabled, and the invited account role cannot activate its subscription. The existing WordPress production and staging hosts have not been replaced.

The separate `poiema-design-review` Worker hosts a static snapshot of the new pages, including the three concepts. It runs in Poiema's Cloudflare account, uses no R2 or paid CMS plugin, and requires the review key for every page and asset. This is a design review deployment, not the live EmDash CMS. Audio still points to the existing WordPress host in this snapshot.

## Local verification and review snapshots

Verified on 2026-09-05: typecheck passed with zero errors and warnings; production build passed. The live review pages render on desktop and mobile, with no horizontal overflow. Main mobile Menu opens and Escape closes it. All ten review routes return 404 without the key and 200 with it after normal slash redirects. Key exchange redirects to a clean URL and sets an HTTP-only cookie. The media page contains all 14 audio players. Contact and giving targets match the WordPress source. No design links appear in main navigation. Screenshots are saved locally in `.artifacts/screenshots`.

Review hostname: `https://review.poiemaretreats.org`. Share links require the key from the ignored `.dev.vars.review` file. The deployment also has a workers.dev hostname; that newly registered hostname initially had a TLS provisioning delay, so the verified custom hostname is preferred.

Use Node 24. `npm run typecheck` checks the project and `npm run build` builds the EmDash Worker. `npm run preview` starts the local Cloudflare simulation. The seed includes 14 verified recordings and keeps uncertain retreats and unsupported articles in draft.

After the local database is initialized with seed content, `node scripts/export-review.mjs` exports the review snapshot. Deploy it with `npx wrangler deploy --config wrangler.review.jsonc --secrets-file .dev.vars.review`. The ignored file contains only `DESIGN_PREVIEW_KEY`. Never commit access keys.

An existing local database created before schema changes will not gain new fields through seed's skip-conflict mode. The local test database was backed up to `.migration/local-d1-before-schema-update-20260905` and initialized fresh. The remote databases are empty. Do not repeat this on a populated remote database; use CMS schema migrations instead.

## Remaining production work

1. The account owner enables R2. Create `poiemaretreats-media-staging` and `poiemaretreats-media-prod`.
2. Upload the archived attachment paths to R2. All 98 files are preserved locally under `.migration/wp-content/uploads`, with a manifest and page/API snapshots. Keep original keys so old links continue to work. Optimized audio copies are available separately; do not overwrite originals without choosing that tradeoff.
3. Configure distinct `DESIGN_PREVIEW_KEY` and `SITE_SETUP_KEY` secrets in staging and production. The setup key protects the first-admin wizard and must never be shared as a design-review link.
4. Build with the target `CLOUDFLARE_ENV`. The deploy scripts set this explicitly because an environment flag given only to Wrangler after an Astro build does not select the intended database configuration.
5. Deploy staging, initialize seed content through the protected setup flow, and complete owner/admin authentication. Verify editing, registration links, giving, all audio paths, mobile navigation, redirects, and media upload.
6. Before switching production DNS, retain the old records and WordPress backup. Deploy production, initialize its database, verify the same flows, and then replace the old host. Do not retire WordPress until attachment checks pass.

The Worker preserves WordPress attachment URLs through R2 and redirects stale registration/product URLs to retreats. Former cart, checkout, and account routes lead to contact. Staging is noindex. The main sitemap excludes private designs and unpublished content.

See `content-audit.md` and `public-source-snapshot.md` for conflicting dates, source links, and registration/payment evidence.
