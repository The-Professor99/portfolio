const staticCache = 'static-site-ii';
const dynamicCache = 'dynamic-site-ii';
const assets = [
  '/',
  '/offline',

  '/images/icons/filled/apple-touch-icon.png',
  '/images/icons/filled/android-chrome-512x512.png',
  '/images/icons/white/android-chrome-512x512.png',

  '/images/static/author.png',
  '/images/static/about.svg',
  '/images/static/skills.svg',
  '/images/static/resume.pdf',

  '/fonts/Gabriola.ttf',
  '/fonts/LibreBaskerville-Regular.ttf',
  '/fonts/Montserrat-Regular.ttf',
  '/fonts/Philosopher-Regular.ttf',

  '/css/style.css',
  '/js/app.js',
  '/js/main.js',
  '/js/modules/ui.js',
  'https://kit.fontawesome.com/885fbd8d84.js'
];

const limitCacheSize = (name, size) => {
  caches
    .open(name)
    .then(cache => {
      cache.keys().then(keys => {
        if (keys.length > size) {
          cache.delete(keys[0]).then(limitCacheSize(name, size));
        }
      });
    })
    .catch(error => console.log('Error while reducing files', error));
};

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(staticCache)
      .then(cache => {
        return cache.addAll(assets);
      })
      .catch(error => console.log('Error caching files', error))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== staticCache && key !== dynamicCache)
            .map(key => caches.delete(key))
        );
      })
      .catch(error => console.log('Error deleting cache', error))
  );
});

self.addEventListener('fetch', e => {
  if (!(e.request.url.indexOf('http') === 0)) return;

  e.respondWith(
    caches
      .match(e.request)
      .then(cacheResponse => {
        return (
          cacheResponse ||
          fetch(e.request).then(fetchResponse => {
            return caches
              .open(dynamicCache)
              .then(cache => {
                cache.put(e.request.url, fetchResponse.clone());
                limitCacheSize(dynamicCache, 50);
                return fetchResponse;
              })
              .catch(error => console.log('Error adding file to cache', error));
          })
        );
      })
      .catch(() => caches.match('/offline'))
  );
});
