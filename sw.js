const CACHE_NAME = 'kidlearn-v3';

const urlsToCache = [
  '/KidLearnPro/',
  '/KidLearnPro/index.html',
  '/KidLearnPro/manifest.json',
  '/KidLearnPro/icon-192.png',
  '/KidLearnPro/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        if(response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // OFFLINE FALLBACK
        if(event.request.destination === 'document') {
          return caches.match('/KidLearnPro/index.html');
        }
        // Offline image placeholder
        if(event.request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#aaa" font-size="12">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        // Offline JSON placeholder
        if(event.request.headers.get('accept').includes('application/json')) {
          return new Response('{"offline":true}', { headers: { 'Content-Type': 'application/json' } });
        }
      });
    })
  );
});

self.addEventListener('push', event => {
  let data = { title: 'KidLearn Pro ⭐', body: 'Time to learn and play!' };
  if(event.data) { try { data = event.data.json(); } catch(e) { data.body = event.data.text(); } }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/KidLearnPro/icon-192.png',
      badge: '/KidLearnPro/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/KidLearnPro/' },
      actions: [{ action: 'open', title: '▶ Play Now' }, { action: 'close', title: '✖ Later' }]
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if(event.action === 'close') return;
  const url = event.notification.data?.url || '/KidLearnPro/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for(const client of list) {
        if(client.url === url && 'focus' in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('sync', event => {
  if(event.tag === 'sync-progress') event.waitUntil(syncData());
});

async function syncData() {
  console.log('KidLearn: Syncing data when back online...');
}

self.addEventListener('periodicsync', event => {
  if(event.tag === 'daily-reminder') event.waitUntil(dailyReminder());
});

async function dailyReminder() {
  await self.registration.showNotification('KidLearn Pro ⭐', {
    body: "Don't forget to practice today! 🎮",
    icon: '/KidLearnPro/icon-192.png',
    vibrate: [200, 100, 200]
  });
}

self.addEventListener('message', event => {
  if(event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
