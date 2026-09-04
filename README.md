# poiemaretreats-site

Rebuild of [poiemaretreats.org](https://poiemaretreats.org) — a Christian young-adult retreats ministry site — on **EmDash CMS** (Astro-native, TypeScript), deployed to **Cloudflare** (Workers + D1 + R2).

## Why

The current WordPress site is badly out of date. EmDash is Cloudflare's Astro-native CMS: type-safe structured content, sandboxed plugins, passkey auth, native edge deployment. The current site runs WordPress + Neve theme + WooCommerce; retreats were sold as WooCommerce products, and donations come in via an **easytithe** embed (carried over as an embed block).

## Stack

- **CMS/Framework:** EmDash CMS 0.36 (Astro 7, end-to-end TypeScript)
- **Hosting:** Cloudflare Workers (`src/worker.ts`)
- **Database:** Cloudflare D1 (binding `DB`)
- **Media:** Cloudflare R2 (binding `MEDIA`)
- **Donations:** easytithe form embed
- **Auth:** EmDash admin with passkeys

## Branches

- `master` — production-bound code
- `staging` — deploys to the staging site (`staging.poiemaretreats.org`)

## Development

Toolchain is managed with [mise](https://mise.jdx.dev) (see `.mise.toml`):

```bash
mise install          # installs pinned Node
npm install
npm run dev           # http://localhost:4321
npm run deploy        # astro build && wrangler deploy
```

- Admin UI: `http://localhost:4321/_emdash/admin` (dev bypass for local dev)
- Site MCP server: `http://localhost:4321/_emdash/api/mcp`
- Schema + content seed: `seed/seed.json`
- Regenerate types: `npx emdash types`

## Agent tooling

- Official EmDash skills in `.agents/skills/` (`building-emdash-site`, `creating-plugins`, `emdash-cli`)
- Docs MCP (`.mcp.json` → `https://docs.emdashcms.com/mcp`) — use `search_docs` to verify APIs instead of guessing
- Template notes in `AGENTS.md`

## Migration

Content comes from the live WordPress site via WXR export (pages, WooCommerce products → retreats, media → R2). Slugs preserved where possible with redirects. See [PLAN.md](PLAN.md) for the full phased plan.
