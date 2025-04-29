self.addEventListener("install", function (event) {
  const offlinePage = new Response(
    '<!DOCTYPE html><html><head><title>Offline</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
    {
      headers: { "Content-Type": "text/html" },
    }
  );

  event.waitUntil(
    caches.open("offline-cache").then(function (cache) {
      return cache.put("/offline", offlinePage);
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match("/offline");
      })
    );
  }
});
