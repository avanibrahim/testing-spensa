// public/sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/irigasitetes'));
});

// optional: nanti kalau pakai Web Push dari server
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data?.json?.() || {}; } catch {}
  const title = data.title || 'Pemberitahuan';
  const body  = data.body  || '';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag: data.tag || 'push',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    })
  );
});
