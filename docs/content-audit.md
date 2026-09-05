# Poiema migration content audit

Audited 2026-09-05 against the public WordPress REST API and public page HTML.

## Seed changes

- All three retreat entries are drafts. The public site is internally inconsistent about OBX dates, and it does not verify the seeded Spring dates, venue, deadline, schedule, lodging, or descriptive prose.
- Removed the unsupported shared `easy_tithe_form_id`. Added separate registration and payment URL fields using links from each public registration page.
- Both seeded articles are drafts. WordPress exposes no posts, so the titles, prose, publication dates, and pastor/elder attribution have no public source.
- Removed unsupported recording speakers, recording timestamps, and editorial descriptions. Retained the public titles and media URLs.
- Added the ten public tracks missing from the starter. The seed now preserves all 14 tracks displayed on `/media/`.

## Main-page fixes still needed

- Do not show the Spring retreat, OBX dates, deadlines, schedules, lodging, or detailed retreat descriptions until the ministry confirms them.
- The live home page labels the event `Poiema obx 2026` but prints `August 3rd-7th, 2025`. Treat the year/date as unresolved.
- International is better supported: the home page says `Poiema International: Gdansk`, `MAY 29TH-JUNE 8TH | Poland`; its registration page is titled `Poiema International 2026 Registration` and links a live Jotform. Still review before publication.
- Registration must link to the external Google Form or Jotform, then EasyTithe. A UUID-style embedded form ID is not evidenced.
- Preserve the established home, about, funding, and contact copy. The existing seed contains verified excerpts, but the full funding page has additional donation uses and monthly-donor copy.
- Preserve old WordPress URL redirects for `/`, `/about/`, `/contact/`, `/retreats/`, `/media/`, `/funding/`, and the three registration pages listed in the snapshot.

## Archive assessment

The public posts endpoint returns an empty array. The public `wp/v2/product` endpoint and WooCommerce Store products endpoint also return empty arrays. The home page still links two `/product/.../` URLs, but both return 404. Those product links are stale, not recoverable product content. WordPress media exposes photographs and an Iceland 2023 PDF beyond the current page content; these should be downloaded or mirrored before the old host is retired.
