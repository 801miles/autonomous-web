const CACHE_NAME = 'archon-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionally cache the response here
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(response => {
          return response || new Response("Offline Mode", { 
            status: 503,
            statusText: "Service Unavailable"
          });
        });
      })
  );
});
