const staticCacheName = "cache-v1";
//ajout fichier en cache pour la rapidité
self.addEventListener("install", (e) => {
  console.log("Service worker installed");
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return fetch("/pwa/index.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Response not OK");
          }
          return cache.put("/pwa/index.html", response);
        })
        .catch((error) => {
          console.error("Cache fetch error:", error);
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Cloner la requête.
      // Une requete est un flux et est à consommation unique
      // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function (response) {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
        const responseToCache = response.clone();

        caches.open(staticCacheName).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Supprimer caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});
