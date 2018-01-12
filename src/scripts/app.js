if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('./service-worker.js', {scope: './'})
    .then((registration)=> {
        console.log('service worker registered');
    })
    .catch((err) => console.log(err))
}