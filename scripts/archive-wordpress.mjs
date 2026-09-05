import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const origin = "https://poiemaretreats.org";
const outputRoot = join(process.cwd(), ".migration");
const maxBytes = 150 * 1024 * 1024;
const concurrency = 3;

async function fetchJson(url) {
	const response = await fetch(url, { headers: { "user-agent": "Poiema migration archiver/1.0" } });
	if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
	return { body: await response.json(), headers: response.headers };
}

async function fetchAll(endpoint) {
	const items = [];
	for (let page = 1; ; page += 1) {
		const url = `${origin}${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100&page=${page}`;
		const { body, headers } = await fetchJson(url);
		items.push(...body);
		const totalPages = Number(headers.get("x-wp-totalpages") || 1);
		if (page >= totalPages) break;
	}
	return items;
}

function localPathFor(sourceUrl) {
	const url = new URL(sourceUrl);
	if (url.origin !== origin) throw new Error(`Refusing non-WordPress origin: ${sourceUrl}`);
	if (!url.pathname.startsWith("/wp-content/")) throw new Error(`Unexpected media path: ${sourceUrl}`);
	return join(outputRoot, url.pathname);
}

async function archiveItem(item) {
	const sourceUrl = item.source_url;
	const record = {
		id: item.id,
		date: item.date,
		slug: item.slug,
		title: item.title?.rendered || "",
		caption: item.caption?.rendered || "",
		sourceUrl,
		status: "pending",
	};

	try {
		const response = await fetch(sourceUrl, { headers: { "user-agent": "Poiema migration archiver/1.0" } });
		if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
		const declaredBytes = Number(response.headers.get("content-length") || 0);
		if (declaredBytes > maxBytes) {
			await response.body?.cancel();
			return { ...record, status: "skipped-too-large", contentType: response.headers.get("content-type"), bytes: declaredBytes };
		}
		const bytes = new Uint8Array(await response.arrayBuffer());
		if (bytes.byteLength > maxBytes) return { ...record, status: "skipped-too-large", contentType: response.headers.get("content-type"), bytes: bytes.byteLength };
		const target = localPathFor(sourceUrl);
		await mkdir(dirname(target), { recursive: true });
		await writeFile(target, bytes);
		return { ...record, status: "downloaded", localPath: target.slice(process.cwd().length + 1), contentType: response.headers.get("content-type"), bytes: bytes.byteLength };
	} catch (error) {
		return { ...record, status: "failed", error: error instanceof Error ? error.message : String(error) };
	}
}

async function mapBounded(items, limit, task) {
	const results = new Array(items.length);
	let cursor = 0;
	async function worker() {
		while (cursor < items.length) {
			const index = cursor++;
			results[index] = await task(items[index]);
			process.stdout.write(`${index + 1}/${items.length} ${results[index].status} ${items[index].source_url}\n`);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
	return results;
}

await mkdir(outputRoot, { recursive: true });
const [pages, media] = await Promise.all([
	fetchAll("/wp-json/wp/v2/pages?_embed=1"),
	fetchAll("/wp-json/wp/v2/media"),
]);
await writeFile(join(outputRoot, "pages.json"), `${JSON.stringify(pages, null, 2)}\n`);

const files = await mapBounded(media, concurrency, archiveItem);
const manifest = {
	capturedAt: new Date().toISOString(),
	origin,
	limits: { concurrency, maxIndividualBytes: maxBytes },
	counts: {
		mediaMetadata: media.length,
		downloaded: files.filter((file) => file.status === "downloaded").length,
		failed: files.filter((file) => file.status === "failed").length,
		skippedTooLarge: files.filter((file) => file.status === "skipped-too-large").length,
	},
	files,
};
await writeFile(join(outputRoot, "media-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.counts));
if (manifest.counts.failed) process.exitCode = 1;
