const cacheName = 'v1';
const cacheFiles = [
    './',
    './index.html'            
]

self.addEventListener('install', (e) => {
   console.log('[ServiceWorker] Installed');
   e.waitUntil(
       caches.open(cacheName)
       .then((cache) => {
           console.log('[ServiceWorker] caching cacheFiles');
           return cache.addAll(cacheFiles);
       })
   )
});

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activated');
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((thisCacheName) => {
                    if (thisCacheName !== cacheName) {
                        console.log('[ServiceWorker] removing cached files from', thisCacheName);
                        return caches.delete(thisCacheName);
                    }
                })
            )
        })
    )
 });

 self.addEventListener('fetch', (e) => {
    // console.log('[ServiceWorker] Fetching', e.request.url);

    // e.respondWith(
    //     caches.match(e.request)
    //     .then((response) => {
    //         if (response) {
    //             console.log('[ServiceWorker] found in cache', e.request.url);
    //             return response;
    //         }
    //     })
    // )
 });