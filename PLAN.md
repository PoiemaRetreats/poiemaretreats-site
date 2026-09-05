# Poiema Retreats — Rebuild Plan

Rebuild of poiemaretreats.org from an outdated WordPress site to **EmDash CMS** (Astro-native, TypeScript), deployed to **Cloudflare** (Workers + D1 + R2).

- **Repo:** https://github.com/ReubenBTalbott/poiemaretreats-site
- **Live site (to be replaced):** https://poiemaretreats.org (WordPress, Neve theme, WooCommerce)
- **Target stack:** EmDash CMS on Cloudflare Workers, D1 (database), R2 (images/media)
- **Strategy:** Clean-slate staging rebuild, then cutover. WordPress stays untouched until staging is approved.

---

## Finalized Architecture & Specifications

### 1. Retreat Registration & Giving
- **Provider:** EasyTithe / MinistryForms embedded scripts (`forms.ministryforms.net/embed.aspx?formId=...`).
- **Retreat Registrations:** Each retreat entry specifies an `easyTitheFormId`. Rendered directly inline on that retreat's detail page.
- **Funding / Giving:** Dedicated EasyTithe embed rendered on the `/funding` page.
- **WooCommerce Replacement:** Completely replaced by EasyTithe; no e-commerce cart/checkout code required on-site.

### 2. Automated Retreat Lifecycle
- **Fields:** `startDate`, `endDate`, `registrationDeadline` (optional), and `statusOverride` (optional: `automatic`, `sold_out`, `waitlist`, `canceled`).
- **Server-Rendered Status Logic:**
  - **Open:** Current date < `registrationDeadline` (or `startDate`) and not sold out → Renders active EasyTithe registration form.
  - **Closed / Waitlist:** Current date ≥ `registrationDeadline` but < `endDate` → Form hidden; displays registration closed / waitlist notice.
  - **Archived / Past:** Current date ≥ `endDate` → Automatically listed in the "Past Retreats" archive, form removed, recap/audio highlighted.

### 3. Visual Identity: *Coastal Dunes & Mountain Mist*
- **Aesthetic:** Contemplative, restful, dignified; honoring both the Outer Banks coast and Appalachian mountain settings.
- **Color Palette:**
  - Deep Coastal Navy / Slate (`--color-brand`)
  - Warm Sand / Linen Cream (`--color-bg`, `--color-surface`)
  - Muted Sage / Pine & Warm Ochre (`--color-accent`)
  - Charcoal Slate (`--color-text`)
- **Typography:**
  - Headings (`--font-heading`): Refined classical serif (Cormorant Garamond) for the Greek title *ποίημα* (Ephesians 2:10) and section headlines.
  - Body (`--font-body`): Clean, highly readable sans-serif (Plus Jakarta Sans).

### 4. Site Structure & Navigation
1. **Home (`/`):** Hero with mission statement, Ephesians 2:10 theme, featured upcoming retreats, core values (Encouragement, Communication, Joy, Life Together), testimonials.
2. **Retreats (`/retreats`, `/retreats/[slug]`):** Active retreat catalog, past retreat archive, full retreat details, and embedded EasyTithe form.
3. **Articles (`/articles`, `/articles/[slug]`):** Pastoral essays, letters, and theological writings from pastors.
4. **Media (`/media`):** Sermons, lectures, and podcast audio/video embeds.
5. **Funding (`/funding`):** Ministry support and scholarship info with embedded EasyTithe giving form.
6. **About (`/about`):** History, Saint Peter Presbyterian Church connection, leadership bios, worldview.
7. **Contact (`/contact`):** Direct `mailto:` client contact links and inquiry details.

---

## Roadmap

### Phase 1 — Schema & Configuration (In Progress)
- [x] Scaffold EmDash Cloudflare marketing starter
- [x] Pin toolchain via mise (`.mise.toml`)
- [x] Wire EmDash documentation MCP server
- [x] Define architecture & grill specifications
- [ ] Define content collections in `seed/seed.json` (`retreats`, `articles`, `media`, `pages`)
- [ ] Configure typography (Cormorant Garamond + Plus Jakarta Sans) and Coastal Dunes & Mountain Mist design tokens in `astro.config.mjs` & `src/styles/theme.css`
- [ ] Implement EasyTithe embed component & retreat lifecycle logic
- [ ] Implement templates: `/retreats`, `/retreats/[slug]`, `/articles`, `/articles/[slug]`, `/media`, `/funding`, `/about`, `/contact`

### Phase 2 — Content Seeding & Review
- [ ] Seed initial retreats (OBX, International / Poland, Mountain gatherings)
- [ ] Seed sample pastoral articles and sermons/media
- [ ] Set up navigation menus (`primary`, `footer`) in seed
- [ ] Test local build & verify responsive layout

### Phase 3 — Cloudflare Staging Deployment
- [ ] Configure D1 database (`DB`) and R2 bucket (`MEDIA`) in `wrangler.jsonc`
- [ ] Deploy to Cloudflare Workers on `staging.poiemaretreats.org`
- [ ] Set up passkey authentication in EmDash admin on staging
- [ ] Walkthrough with site leadership

### Phase 4 — Production Cutover
- [ ] Final content verification against poiemaretreats.org
- [ ] Point primary DNS to Cloudflare Workers
- [ ] Set up 301 redirects for legacy URLs
- [ ] Decommission legacy WordPress hosting
