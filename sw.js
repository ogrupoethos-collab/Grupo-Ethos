const CACHE = 'ethos-v4';
const ASSETS = [
  '/Grupo-Ethos/manifest.json',
  '/Grupo-Ethos/icon-192.png',
  '/Grupo-Ethos/icon-512.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first para a página (HTML) — garante que atualizações apareçam sempre.
// Cache-first para os demais assets (ícones, libs).
self.addEventListener('fetch', e => {
  const req = e.request;
  const isHTML = req.mode === 'navigate' ||
    (req.method === 'GET' && req.headers.get('accept') && req.headers.get('accept').includes('text/html'));

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then(res => { caches.open(CACHE).then(c => c.put(req, res.clone())); return res; })
        .catch(() => caches.match(req).then(c => c || caches.match('/Grupo-Ethos/index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=>cached))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Grupo Ethos', body: 'Nova notificação' };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/Grupo-Ethos/icon-192.png',
    badge: '/Grupo-Ethos/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/Grupo-Ethos/' },
    actions: [{ action: 'abrir', title: 'Abrir Hub' }]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/Grupo-Ethos/';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    const c = cs.find(w => w.url === url);
    return c ? c.focus() : clients.openWindow(url);
  }));
});
