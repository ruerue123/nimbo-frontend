/* eslint-disable no-restricted-globals */

// Hand-rolled service worker for Nimbo. No Workbox dependency — keeps the CRA
// build untouched. Strategies, in order of preference per request:
//   - Navigation requests: network-first, fall back to cached app shell
//   - Same-origin static assets (JS/CSS/fonts): cache-first
//   - Cross-origin images (Cloudinary etc.): cache-first with cap
//   - API GETs: stale-while-revalidate (and pass through POST/PUT/DELETE)
//
// Bump CACHE_VERSION whenever this file or the app shell needs a fresh start;
// old caches are dropped in `activate`.

const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `nimbo-shell-${CACHE_VERSION}`;
const STATIC_CACHE    = `nimbo-static-${CACHE_VERSION}`;
const IMAGE_CACHE     = `nimbo-img-${CACHE_VERSION}`;
const API_CACHE       = `nimbo-api-${CACHE_VERSION}`;

const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.png',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-512-maskable.png'
];

const IMAGE_CACHE_LIMIT = 80;
const API_CACHE_LIMIT = 40;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const expected = new Set([APP_SHELL_CACHE, STATIC_CACHE, IMAGE_CACHE, API_CACHE]);
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => !expected.has(k)).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

// Trim a cache to a max number of entries, evicting oldest first.
const trimCache = async (cacheName, max) => {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length <= max) return;
    for (const req of keys.slice(0, keys.length - max)) {
        await cache.delete(req);
    }
};

const isImageRequest = (request) =>
    request.destination === 'image' ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|avif)(?:\?|$)/i.test(request.url);

const isStaticAsset = (url) =>
    /\/static\//.test(url.pathname) ||
    /\.(?:js|css|woff2?|ttf|otf|eot)(?:\?|$)/i.test(url.pathname);

const isApiRequest = (url) =>
    /\/api\//.test(url.pathname) || url.hostname.includes('onrender.com');

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Only ever handle GET — never cache mutating requests.
    if (request.method !== 'GET') return;

    // Navigation: network-first so users see fresh HTML; fall back to cached
    // shell when offline. CRA emits a single index.html for client-routed URLs.
    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const fresh = await fetch(request);
                const cache = await caches.open(APP_SHELL_CACHE);
                cache.put('/index.html', fresh.clone());
                return fresh;
            } catch {
                const cached = await caches.match('/index.html');
                return cached || Response.error();
            }
        })());
        return;
    }

    // Cross-origin images (Cloudinary product photos) — cache-first.
    if (isImageRequest(request)) {
        event.respondWith((async () => {
            const cache = await caches.open(IMAGE_CACHE);
            const cached = await cache.match(request);
            if (cached) return cached;
            try {
                const fresh = await fetch(request);
                if (fresh.ok || fresh.type === 'opaque') {
                    cache.put(request, fresh.clone());
                    trimCache(IMAGE_CACHE, IMAGE_CACHE_LIMIT);
                }
                return fresh;
            } catch {
                return cached || Response.error();
            }
        })());
        return;
    }

    // Same-origin JS/CSS/fonts — cache-first; CRA hashes filenames so a new
    // build naturally invalidates.
    if (url.origin === self.location.origin && isStaticAsset(url)) {
        event.respondWith((async () => {
            const cache = await caches.open(STATIC_CACHE);
            const cached = await cache.match(request);
            if (cached) return cached;
            const fresh = await fetch(request);
            if (fresh.ok) cache.put(request, fresh.clone());
            return fresh;
        })());
        return;
    }

    // API GETs — stale-while-revalidate. Auth-sensitive endpoints (logout,
    // me) are still GETs but are short-lived; the cap and SWR keep them
    // from going stale.
    if (isApiRequest(url)) {
        event.respondWith((async () => {
            const cache = await caches.open(API_CACHE);
            const cached = await cache.match(request);
            const fetchPromise = fetch(request).then((fresh) => {
                if (fresh.ok) {
                    cache.put(request, fresh.clone());
                    trimCache(API_CACHE, API_CACHE_LIMIT);
                }
                return fresh;
            }).catch(() => cached);
            return cached || fetchPromise;
        })());
        return;
    }

    // Everything else: pass through.
});

// Allow the page to trigger an immediate update when a new SW is waiting.
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
