const cacheName = 'v2';
const cacheFiles = [
    './',
    './index.html'
];

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
    console.log('[ServiceWorker] Fetching', e.request.url);

    e.respondWith(
        caches.match(e.request)
            .then((response) => {
                if (response) {
                    console.log('[ServiceWorker] found in cache', e.request.url);
                    return response;
                }
                if (!navigator.onLine) {
                    return caches.match(new Request('./offline.html'))
                }
                return fetch(e.request);
            })
    )
});

// five common caching patterns for service workers
// network only pattern - you don't really need a service worker
// if you need specific data from a live connection
// e.respondWith(
//     fetch(e.request);
// )

// cache only pattern
// lower power state mode on a device
// e.respondWith(
//     caches.match(e.request);
// )

// cache first pattern / read through cache
// checks the cache first, if a match use the cache entry return to the browser
// if it doesnt match the cache go to the network and write the network back to the cache

// e.respondWith(
//     caches.match(e.request).then(function(cResponse) {
//         if (cResponse) {
//             // if match in cache return the cached response
//             return cResponse;
//         }
//         // fetch from the network
//         return fetch(e.request).then(function(fResponse) {
//             // when then fetch returns
//             // open the cache
//             return caches.open('v1').then(function(cache) {
//                 // clone the open cached version and put this into the cache
//                 return cache.put(e.request, fResponse.clone()).then(function() {
//                     // return the new cached version
//                     return fResponse;
//                 });
//             });
//         });
//     })
// )

// network first pattern
// flaws with connection lo-fi could cause the response to be slow
// e.respondWith(
//     fetch(e.request).then(function(fResponse) {
//         return caches.open('v1').then(function(cache) {
//             if (!fResponse.ok) {
//                 return cache.match(e.request);
//             } else {
//                 cache.put(e.request, fResponse.clone());
//                 return fResponse;
//             }
//         });
//     })
// )

// fastest pattern
// requests are sent to the cache and the network
// which every response first will (usually the cache)
// when the network responsed it will update the cache
// the downside to this is a network request are made all the time
// when offline the request will fail
// e.respondWith(() => {
    // create an array the first promise goes to the cache
    // the second goes to the network
//     var promises = [
//         caches.match(e.request),
//         fetch(e.request)
//     ]; 
//     return new Promise((resolve, reject) => { // promise.race doesn't work well here...
//         promises.map(p => promise.resolve(promise));
//         promises.forEach(p => p.then(resolve));
//         promises.reduce((a, b) => a.catch(() => b))
//         .catch(() => reject(new Error('Both promises failed.')));
//     })
// })