const CACHE_NAME = 'mp-offline-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key)),
            );
            await clients.claim();
        })(),
    );
});

async function cacheRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(request);
    if (!response || !response.ok) {
        return false;
    }
    await cache.put(request, response.clone());
    return true;
}

async function cacheUrls(entries) {
    const results = { cached: 0, failed: 0 };

    for (const entry of entries) {
        try {
            if (typeof entry === 'string') {
                const ok = await cacheRequest(new Request(entry, { credentials: 'same-origin' }));
                results[ok ? 'cached' : 'failed'] += 1;
                continue;
            }

            if (entry && entry.url) {
                const request = new Request(entry.url, {
                    credentials: 'same-origin',
                    headers: entry.headers ?? {},
                });
                const ok = await cacheRequest(request);
                results[ok ? 'cached' : 'failed'] += 1;
                continue;
            }
        } catch (error) {
            results.failed += 1;
        }
    }

    return results;
}

self.addEventListener('message', (event) => {
    if (!event.data || event.data.type !== 'CACHE_URLS') {
        return;
    }

    const entries = Array.isArray(event.data.urls) ? event.data.urls : [];

    event.waitUntil(
        (async () => {
            const results = await cacheUrls(entries);
            const clientList = await clients.matchAll({
                type: 'window',
                includeUncontrolled: true,
            });
            for (const client of clientList) {
                client.postMessage({
                    type: 'CACHE_COMPLETE',
                    cached: results.cached,
                    failed: results.failed,
                });
            }
        })(),
    );
});

async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    }

    const response = await fetch(request);
    if (response && response.ok) {
        await cache.put(request, response.clone());
    }

    return response;
}

async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request)
        .then((response) => {
            if (response && response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    return cached ?? fetchPromise;
}

async function handleRangeRequest(request) {
    const rangeHeader = request.headers.get('range');
    if (!rangeHeader) {
        return null;
    }

    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (!cached) {
        return null;
    }

    const arrayBuffer = await cached.clone().arrayBuffer();
    const total = arrayBuffer.byteLength;
    const match = /bytes=(\\d+)-(\\d*)/.exec(rangeHeader);

    if (!match) {
        return cached;
    }

    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : total - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
        return cached;
    }

    const sliced = arrayBuffer.slice(start, end + 1);
    const headers = new Headers(cached.headers);
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Length', String(sliced.byteLength));

    return new Response(sliced, {
        status: 206,
        statusText: 'Partial Content',
        headers,
    });
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(networkFirst(request));
        return;
    }

    if (request.headers.get('X-Inertia')) {
        event.respondWith(networkFirst(request));
        return;
    }

    if (request.destination === 'video') {
        event.respondWith(
            (async () => {
                const ranged = await handleRangeRequest(request);
                if (ranged) {
                    return ranged;
                }
                return cacheFirst(request);
            })(),
        );
        return;
    }

    if (['script', 'style', 'font', 'image'].includes(request.destination)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    event.respondWith(staleWhileRevalidate(request));
});
