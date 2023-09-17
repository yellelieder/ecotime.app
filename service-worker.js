var cacheName = "v1";

var cacheFiles = [
  "./",
  "./index.html",
  "./logo.png",
  "./style.css",
  "./main.js",
  "./apple-touch-icon.png",
  "./favicon-32x32.png",
  "./favicon-16x16.png",
  "./manifest.json",
  "./safari-pinned-tab.svg",
  "./favicon.ico",
  "./mstile-144x144.png",
  "./browserconfig.xml",
];

self.addEventListener("install", function (e) {
  console.log("[ServiceWorker] Installed");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[ServiceWorker] Caching cacheFiles");
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("activate", function (e) {
  console.log("[ServiceWorker] Activated");

  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (thisCacheName) {
          if (thisCacheName !== cacheName) {
            console.log(
              "[ServiceWorker] Removing Cached Files from Cache - ",
              thisCacheName
            );
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  console.log("[ServiceWorker] Fetch", e.request.url);
  e.respondWith(
    caches
      .match(e.request)

      .then(function (response) {
        if (response) {
          console.log(
            "[ServiceWorker] Found in Cache",
            e.request.url,
            response
          );
          return response;
        }
        var requestClone = e.request.clone();
        return fetch(requestClone)
          .then(function (response) {
            if (!response) {
              console.log("[ServiceWorker] No response from fetch ");
              return response;
            }

            var responseClone = response.clone();
            caches.open(cacheName).then(function (cache) {
              cache.put(e.request, responseClone);
              console.log("[ServiceWorker] New Data Cached", e.request.url);
              return response;
            });
          })
          .catch(function (err) {
            console.log(
              "[ServiceWorker] Error Fetching & Caching New Data",
              err
            );
          });
      })
  );
});
