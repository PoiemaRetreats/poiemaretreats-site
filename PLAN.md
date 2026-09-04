# Poiema Retreats — Rebuild Plan

Rebuild of poiemaretreats.org from an outdated WordPress site to **EmDash CMS** (Astro-native, TypeScript), deployed to **Cloudflare** (Workers + D1 + R2).

- **Repo:** https://github.com/ReubenBTalbott/poiemaretreats-site
- **Live site (to be replaced):** https://poiemaretreats.org (WordPress, Neve theme, WooCommerce)
- **Target stack:** EmDash CMS on Cloudflare Workers, D1 (database), R2 (images/media)
- **Strategy:** Staging first, then cutover. WordPress stays live and untouched until staging is approved.

## Current site inventory (from live WordPress)

| Area | Notes |
|---|---|
| Home | Hero + mission statement, testimonials, featured retreats, values (Encouragement, Communication, Joy, Life Together) |
| Retreats | `/retreats/` archive + individual retreat pages (WooCommerce products, e.g. Poiema OBX 2026, Poiema International Gdansk) |
| Funding | `/funding/` — donation info |
| About | `/about/` |
| Media | `/media/` — sermons, podcasts, lectures, articles |
| Contact | `/contact/` |
| Products | Retreats modeled as WooCommerce products (registration + payment) |

## Phase 0 — Decisions & accounts

- [ ] EmDash version pin (currently early release — track releases before going live)
- [ ] Cloudflare account: create **D1 database** (staging + production) and **R2 bucket** for media
- [ ] Confirm WordPress export: run EmDash **WXR exporter** plugin (or export WXR from WP admin) — includes pages, posts, products, media
- [ ] Decide registration/payment story for retreats (WooCommerce replacement):
  - Options: EmDash payment support if mature, a checkout provider (Stripe), or external ticketing link
  - **Needed input from site owner:** how registrations/payments currently happen
- [x] Donation flow: **easytithe form embed** (carried over from current site)
- [x] Scaffold EmDash from the `cloudflare:marketing` template — done on `master`

## Phase 1 — Scaffold (staging)

- [x] Scaffolded with `npm create emdash@latest . -- --template cloudflare:marketing --pm npm --yes --force`
- [x] Official EmDash agent skills + docs MCP wired in (`.agents/skills/`, `.mcp.json`)
- [x] Toolchain pinned with mise (`.mise.toml`)
- [ ] Define content model (seed file):
  - `retreats` — title, slug, dates, location, hero image, price, registration link, excerpt, body, status (upcoming/past)
  - `testimonials` — quote, name (optional), context
  - `media` — type (sermon/podcast/lecture/article), embed/audio URL, date, series
  - `pages` — About, Funding, Contact
  - `site` settings — mission statement, values, verse of the day header (Ephesians 2:10)
- [ ] Design/theme: keep Poiema branding (Greek title ποίημα, logo, photo treatment), responsive, dark/light optional
- [ ] Local dev: `npm run dev` with SQLite; content as structured JSON

## Phase 2 — Content migration

- [ ] Import WXR into staging; map WooCommerce products → `retreats` collection
- [ ] Migrate media (wp-content uploads → R2); fix image sizes/formats (WebP/AVIF)
- [ ] Rewrite/clean stale content — opportunity to refresh copy per page
- [ ] Rebuild testimonials as structured entries
- [ ] SEO: preserve URL slugs where possible; set up redirects for changed URLs; sitemap + meta descriptions
- [ ] Forms: Contact form working on Workers (no PHP) — Workers-native form handling + email delivery

## Phase 3 — Staging deployment (Cloudflare)

- [ ] `wrangler` config with **staging environment**: separate D1 database + R2 bucket
- [ ] Staging URL: `staging.poiemaretreats.org` (Cloudflare DNS + route)
- [ ] Admin access on staging: passkey auth, add site owner(s)
- [ ] GitHub Actions: on push to `main` → deploy to staging; on release/tag → production
- [ ] Secrets via `wrangler secret put` (never in repo)
- [ ] Basic staging checks: pages render, images load, forms send, admin works

## Phase 4 — Review & QA

- [ ] Site owner walkthrough of staging + admin (content editing UX)
- [ ] Mobile/responsive pass
- [ ] Lighthouse/Core Web Vitals check (should be a huge win vs. current WP)
- [ ] Content freeze plan: date of final WP export before cutover (so no content is lost between Phase 2 and launch)

## Phase 5 — Production cutover

- [ ] Final WXR export + diff against staging content
- [ ] Deploy production Workers; point `poiemaretreats.org` DNS/routes at it
- [ ] Redirects live (old WP URLs → new); WordPress kept up temporarily as fallback
- [ ] Monitor: Cloudflare analytics, error rates, form submissions
- [ ] Decommission WordPress hosting after a stable period; archive full WP backup (DB + wp-content) before shutting down

## Phase 6 — Post-launch

- [ ] Ongoing content workflow for the site owner (EmDash admin / round-trip markdown)
- [ ] Update cadence for EmDash versions (pre-1.0 — watch breaking changes)
- [ ] Backups: scheduled D1 export + R2 object versioning

## Open questions

1. How are retreat registrations and payments handled today (WooCommerce checkout? external provider?)
2. Who donates through the site and via which platform (current donation link provider)?
3. Who are the content editors? (drives admin accounts + training)
4. Do we keep the `poiemaretreats.org/retreats/` URL structure or simplify?
5. Any email newsletter integration (currently?) worth migrating?
