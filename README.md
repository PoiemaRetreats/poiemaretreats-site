# poiemaretreats-site

Rebuild of [poiemaretreats.org](https://poiemaretreats.org) — a Christian young-adult retreats ministry site — on **EmDash CMS** (Astro-native, TypeScript) deployed to **Cloudflare** (Workers + D1 + R2).

## Why

The current WordPress site is badly out of date. EmDash is Cloudflare's Astro-native CMS: type-safe structured content, sandboxed plugins, passkey auth, and native edge deployment — a clean successor to the WordPress setup.

## Status

Planning phase. See [PLAN.md](PLAN.md) for the full rebuild plan. Staging site will live at `staging.poiemaretreats.org`.

## Stack

- **CMS/Framework:** EmDash CMS (Astro 6, end-to-end TypeScript)
- **Hosting:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite at the edge)
- **Media:** Cloudflare R2
- **CI/CD:** GitHub Actions → `wrangler deploy`
- **Auth:** EmDash admin with passkeys

## Development

To be scaffolded from the EmDash marketing template (Phase 1 in PLAN.md). Local dev runs Astro + SQLite; no PHP anywhere.

## Migration

Content comes from the live WordPress site via WXR export (pages, posts, WooCommerce products → retreats, media → R2). Slugs preserved where possible with redirects.
