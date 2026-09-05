interface Env { ASSETS: Fetcher; DESIGN_PREVIEW_KEY: string }
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' };
    if (url.pathname === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { headers });
    const cookie = request.headers.get('Cookie')?.split(';').map(s => s.trim()).find(s => s.startsWith('poiema_review='))?.slice(14);
    const supplied = url.searchParams.get('key');
    if (!env.DESIGN_PREVIEW_KEY || (supplied !== env.DESIGN_PREVIEW_KEY && cookie !== env.DESIGN_PREVIEW_KEY)) return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Private Poiema preview</title><style>body{font:18px/1.6 system-ui;margin:12vh auto;padding:24px;max-width:620px;color:#243329;background:#faf9f5}h1{font-size:32px}</style><h1>Private Poiema preview</h1><p>This preview is deployed and available through its invitation link.</p><p>Open the complete link Adam shared, including the access key. Copying the address after opening the preview leaves out that key.</p></html>', { status: 403, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
    if (supplied) {
      url.searchParams.delete('key');
      return new Response(null, { status: 303, headers: { ...headers, Location: url.toString(), 'Set-Cookie': `poiema_review=${env.DESIGN_PREVIEW_KEY}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` } });
    }
    const response = await env.ASSETS.fetch(request);
    const output = new Response(response.body, response);
    for (const [name, value] of Object.entries(headers)) output.headers.set(name, value);
    return output;
  }
} satisfies ExportedHandler<Env>;
