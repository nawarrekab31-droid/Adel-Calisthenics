const CACHE_NAME = 'calisthenics-v1.3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
];

// تثبيت ملفات التطبيق الأساسية
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل وتنظيف الكاش القديم
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
    }).then(() => self.clients.claim())
  );
});

// التقاط الطلبات وتفادي أخطاء Firebase والشبكة
self.addEventListener('fetch', (e) => {
  // تجنب اعتراض طلبات Firebase أو الروابط الخارجية لتفادي تعارض الشبكة
  if (e.request.url.includes('firestore.googleapis.com') || 
      e.request.url.includes('firebase') || 
      !e.request.url.startsWith('http')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // حماية من إنهيار الطلب في حال انقطاع الشبكة
        return new Response('Network error occurred', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});