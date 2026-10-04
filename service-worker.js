// ==========================================================
// BWH 2.0 - Service Worker
// ==========================================================

// VERHOOG DIT NUMMER BIJ EEN NIEUWE APP-VERSIE
const CACHE_NAME = "bwh-2.0-v1";


// Bestanden die lokaal beschikbaar moeten zijn
const APP_FILES = [

  "./",

  "./index.html",
  "./home.html",

  "./css/style.css",

  "./js/index.js",

  "./manifest.json"

];


// ==========================================================
// INSTALL
// ==========================================================

self.addEventListener("install", event => {

  console.log(
    "[BWH SW] Nieuwe service worker installeren..."
  );

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(APP_FILES);

      })

      .then(() => {

        console.log(
          "[BWH SW] App-bestanden opgeslagen."
        );

        // Nieuwe service worker meteen klaarzetten
        return self.skipWaiting();

      })

  );

});


// ==========================================================
// ACTIVATE
// ==========================================================

self.addEventListener("activate", event => {

  console.log(
    "[BWH SW] Service worker geactiveerd."
  );

  event.waitUntil(

    caches.keys()

      .then(cacheNames => {

        return Promise.all(

          cacheNames

            .filter(cacheName => {

              return (
                cacheName.startsWith("bwh-2.0-") &&
                cacheName !== CACHE_NAME
              );

            })

            .map(cacheName => {

              console.log(
                "[BWH SW] Oude cache verwijderen:",
                cacheName
              );

              return caches.delete(cacheName);

            })

        );

      })

      .then(() => {

        // Neem onmiddellijk controle over geopende pagina's
        return self.clients.claim();

      })

  );

});


// ==========================================================
// FETCH
// ==========================================================

self.addEventListener("fetch", event => {

  // Alleen GET-verzoeken behandelen
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        // Geldige response opslaan in cache
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {

          const responseClone =
            response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {

              cache.put(
                event.request,
                responseClone
              );

            });

        }

        return response;

      })

      .catch(() => {

        // Internet niet beschikbaar:
        // probeer de cache

        return caches
          .match(event.request)

          .then(cachedResponse => {

            if (cachedResponse) {

              return cachedResponse;

            }

            // Als index.html gevraagd wordt,
            // probeer die als fallback

            if (
              event.request.mode === "navigate"
            ) {

              return caches.match(
                "./index.html"
              );

            }

            return new Response(
              "Geen internetverbinding.",
              {
                status: 503,
                headers: {
                  "Content-Type":
                    "text/plain; charset=utf-8"
                }
              }
            );

          });

      })

  );

});
