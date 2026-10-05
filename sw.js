const CACHE_NAME = 'brandweer-app-v2.2'; // Verhoog dit versienummer bij grote updates
const ASSETS = [
  './',
  './index.html',
  './home.html',
  './admin.html',
  './manifest.json'
];

// 1. Bij installatie: sla de nieuwste bestanden op en sla het wachten over
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Dwing de nieuwe service worker om direct actief te worden
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Bij activering: verwijder oude caches en claim direct alle geopende pagina's
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Neem direct controle over geopende tabbladen
  );
});

// 3. Netwerkverzoeken afhandelen (Network First met Cache Fallback voor altijd verse data)
self.addEventListener('fetch', (e) => {
  // Voor Firebase verzoeken laten we het netwerk altijd direct werken
  if (e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('firebase')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Indien succesvol, update de cache op de achtergrond
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Indien offline, gebruik de gecachte versie
        return caches.match(e.request);
      })
  );
});
