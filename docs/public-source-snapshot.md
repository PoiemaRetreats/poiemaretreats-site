# Public WordPress source snapshot

Captured 2026-09-05 from `https://poiemaretreats.org`.

## Public pages

| WordPress ID | Original URL | Evidence worth preserving |
|---:|---|---|
| 84 | https://poiemaretreats.org/ | Purpose copy, testimonials, retreat cards, ministry values |
| 80 | https://poiemaretreats.org/about/ | About and purpose copy; Laurence Windham and David Cooper biographies |
| 82 | https://poiemaretreats.org/retreats/ | Upcoming-retreat archive route; little rendered body content |
| 165 | https://poiemaretreats.org/media/ | 14-track audio archive |
| 505 | https://poiemaretreats.org/funding/ | Donation uses, plans, monthly donor offer, church oversight |
| 83 | https://poiemaretreats.org/contact/ | Laurence Windham, 423-366-2079, sppcpastor@gmail.com |
| 799 | https://poiemaretreats.org/poiema-obx-2025-registration/ | Google Form, $325 instructions, EasyTithe |
| 793 | https://poiemaretreats.org/poiema-international-2025-registration/ | Page title says 2026; Jotform, $550 instructions, EasyTithe |
| 614 | https://poiemaretreats.org/poiema-spring-2026-registration/ | Google Form, $350 instructions, EasyTithe |
| 565 | https://poiemaretreats.org/cart/ | Legacy WooCommerce route |
| 568 | https://poiemaretreats.org/checkout/ | Legacy WooCommerce route |
| 570 | https://poiemaretreats.org/my-account/ | Legacy WooCommerce route |

## Forms and payment

- OBX form: https://forms.gle/P56eUTsuWHw5aBHK7
- International form: https://form.jotform.com/260655039743158
- Spring form: https://forms.gle/k3swRTybmL68G1dC6
- Registration and donation payment: https://app.easytithe.com/app/giving/sppc

## Audio dependencies

- `wp-content/uploads/2025/01/Poiema-Talk-1.m4a` through `Poiema-Talk-4.m4a`
- `wp-content/uploads/2025/01/Poeima-Talk-5.m4a` (source filename is misspelled)
- `wp-content/uploads/2025/01/Poiema-Talk-6.m4a`
- `wp-content/uploads/2023/05/Spring-Poiema-2023-Lecture-1.m4a` through `-4.m4a`
- `wp-content/uploads/2023/05/Spring-Poiema-2023-Evening-Devotion-and-singing-1.m4a` through `-3.m4a`
- `wp-content/uploads/2023/05/yahweh-to-my-Lord-hath-spoken.m4a`

All use the origin `https://poiemaretreats.org/`. The public API supplies titles and durations but no speakers or event-day timestamps.

## Other media to inventory before cutover

The attachment API exposes retreat photography from 2021 through 2025 and `wp-content/uploads/2022/11/Iceland-Trip-Information-for-Sept-13-21-2023.pdf`. The new site can omit unused theme-demo assets, but original Poiema photos and the PDF should be archived before the WordPress host is removed.

## API results

- `GET /wp-json/wp/v2/pages?per_page=100`: 12 public pages.
- `GET /wp-json/wp/v2/posts?per_page=100`: 0 posts.
- `GET /wp-json/wp/v2/product?per_page=100`: 0 products.
- `GET /wp-json/wc/store/v1/products?per_page=100`: 0 products.
- Home-linked `/product/poiema-obx-2026/` and `/product/poiema-international-2026/`: HTTP 404 on capture date.
