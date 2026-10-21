/* Service worker: оболочка приложения кэшируется при установке, schedule.json — «сеть, затем кэш» (чтобы расписание было свежим, а офлайн — доступным) */
const V = 'ipek-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'schedule.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'fonts/manrope-cyrillic.woff2', 'fonts/manrope-latin.woff2'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))));
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
const put = (r, res) => { if (res && res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); } return res; };
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('/schedule.json')) { e.respondWith(fetch(r).then(res => put(r, res)).catch(() => caches.match(r))); return; }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => {
    const net = fetch(r).then(res => put(r, res)).catch(() => hit || (r.mode === 'navigate' ? caches.match('index.html') : undefined));
    return hit || net;
  }));
});
