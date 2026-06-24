const CACHE = 'ethos-v1';
const ASSETS = [
  '/Grupo-Ethos/',
  '/Grupo-Ethos/index.html',
  '/Grupo-Ethos/manifest.json',
  '/Grupo-Ethos/icon-192.png',
  '/Grupo-Ethos/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/Grupo-Ethos/')))
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
