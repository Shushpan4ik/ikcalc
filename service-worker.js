// Retire the old cache-first worker, including installations with cached HTML.
// Keep this URL available so browsers can update their existing registration.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter(name => name.startsWith('ikcalc-')).map(name => caches.delete(name)));
  await self.clients.claim();
  await self.registration.unregister();
  const windows = await self.clients.matchAll({type: 'window'});
  await Promise.all(windows.map(client => client.navigate(client.url).catch(() => {})));
})()));
// No fetch handler: all requests go straight to the network.
