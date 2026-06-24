const CACHE_NAME = 'kidlearn-v3';
const OFFLINE_URL = '/KidLearnPro/offline.html';

const urlsToCache = [
  '/KidLearnPro/',
  '/KidLearnPro/index.html',
  '/KidLearnPro/manifest.json',
  '/KidLearnPro/icon-192.png',
  '/KidLearnPro/icon-512.png'
];

// ═══ INSTALL ═══════════════════════════════════════
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ═══ ACTIVATE ══════════════════════════════════════
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ═══ FETCH — Offline Support ════════════════════════
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/KidLearnPro/index.html');
        }
      });
    })
  );
});

// ═══ PUSH NOTIFICATIONS ════════════════════════════
self.addEventListener('push', event => {
  let data = {
    title: 'KidLearn Pro ⭐',
    body: 'Time to learn and play!',
    icon: '/KidLearnPro/icon-192.png',
    badge: '/KidLearnPro/icon-192.png'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/KidLearnPro/icon-192.png',
      badge: data.badge || '/KidLearnPro/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/KidLearnPro/' },
      actions: [
        { action: 'open', title: '▶ Play Now' },
        { action: 'close', title: '✖ Later' }
      ]
    })
  );
});

// ═══ NOTIFICATION CLICK ════════════════════════════
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data?.url || '/KidLearnPro/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ═══ BACKGROUND SYNC ═══════════════════════════════
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores());
  }
});

async function syncProgress() {
  try {
    const cache = await caches.open(CACHE_NAME);
    // Sync any pending progress data when back online
    console.log('KidLearn: Syncing progress data...');
  } catch (e) {
    console.log('KidLearn: Sync failed', e);
  }
}

async function syncScores() {
  try {
    console.log('KidLearn: Syncing scores...');
  } catch (e) {
    console.log('KidLearn: Score sync failed', e);
  }
}

// ═══ PERIODIC BACKGROUND SYNC ══════════════════════
self.addEventListener('periodicsync', event => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(showDailyReminder());
  }
});

async function showDailyReminder() {
  await self.registration.showNotification('KidLearn Pro ⭐', {
    body: "Don't forget to practice today! 🎮",
    icon: '/KidLearnPro/icon-192.png',
    badge: '/KidLearnPro/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: '/KidLearnPro/' }
  });
}

// ═══ MESSAGE ═══════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});
