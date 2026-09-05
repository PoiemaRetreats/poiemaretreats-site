import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
	...handler,
	async fetch(request: Request<unknown, IncomingRequestCfProperties>, bindings: Record<string, unknown>, ctx: ExecutionContext) {
		const url = new URL(request.url);
		const legacy = new Set(['/poiema-obx-2025-registration', '/poiema-international-2025-registration', '/poiema-spring-2026-registration', '/product/poiema-obx-2026', '/product/poiema-international-2026']);
		const path = url.pathname.replace(/\/$/, '');
		if (legacy.has(path)) return Response.redirect(new URL('/retreats', url).toString(), 301);
		if (['/cart', '/checkout', '/my-account'].includes(path)) return Response.redirect(new URL('/contact', url).toString(), 301);
		if (url.pathname === '/robots.txt') return new Response(bindings.ENVIRONMENT === 'production' ? 'User-agent: *\nDisallow: /_emdash/\nDisallow: /designs/\nSitemap: https://poiemaretreats.org/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain' } });
		if (url.pathname === '/sitemap.xml') return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ['/', '/about', '/retreats', '/funding', '/media', '/contact'].map(path => `<url><loc>https://poiemaretreats.org${path}</loc></url>`).join('') + '</urlset>', { headers: { 'Content-Type': 'application/xml' } });
		// Preserve original WordPress attachment URLs after the site moves.
		if (url.pathname.startsWith("/wp-content/uploads/") && ["GET", "HEAD"].includes(request.method)) {
			const bucket = bindings.MEDIA as R2Bucket;
			const object = await bucket.get(decodeURIComponent(url.pathname.slice(1)), { range: request.headers });
			if (!object) return new Response("Not found", { status: 404 });
			const headers = new Headers();
			object.writeHttpMetadata(headers);
			headers.set("ETag", object.httpEtag);
			headers.set("Accept-Ranges", "bytes");
			headers.set("Cache-Control", "public, max-age=86400");
			let responseStatus = 200;
			if (object.range && "offset" in object.range && "length" in object.range) {
				const { offset = 0, length = object.size } = object.range;
				headers.set("Content-Range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
				headers.set("Content-Length", String(length));
				responseStatus = 206;
			} else headers.set("Content-Length", String(object.size));
			return new Response(request.method === "HEAD" ? null : object.body, { status: responseStatus, headers });
		}
		// Protect first-admin creation before the owner finishes the passkey wizard.
		if (url.pathname.startsWith("/_emdash/") && url.searchParams.has("setup_key")) {
			const key = String(bindings.SITE_SETUP_KEY || "");
			if (!key || url.searchParams.get("setup_key") !== key) return new Response("Not found", { status: 404 });
			url.searchParams.delete("setup_key");
			return new Response(null, { status: 303, headers: { Location: url.toString(), "Set-Cookie": `poiema_setup=${key}; HttpOnly; Secure; SameSite=Strict; Path=/_emdash; Max-Age=3600`, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
		}
		if (url.pathname.startsWith("/_emdash/api/setup")) {
			const cookie = request.headers.get("Cookie")?.split(";").map(p => p.trim()).find(p => p.startsWith("poiema_setup="))?.slice(13);
			if (!bindings.SITE_SETUP_KEY || cookie !== bindings.SITE_SETUP_KEY) return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
		}
		const response = await handler.fetch!(request, bindings, ctx);
		if (bindings.ENVIRONMENT === 'staging') {
			const result = new Response(response.body, response);
			result.headers.set('X-Robots-Tag', 'noindex, nofollow');
			return result;
		}
		return response;
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler<Record<string, unknown>>;
