const CACHE_NAME = 'migoportal-cache-v1';

// Explicitly cache all source files for the PWA to function in this environment
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './services/geminiService.ts',
  './services/pdfService.ts',
  './components/Assistant.tsx',
  './components/DashboardStats.tsx',
  './components/ReceiptUploader.tsx',
  './components/LandingPage.tsx',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://aistudiocdn.com/react@^19.2.1',
  'https://aistudiocdn.com/react-dom@^19.2.1/',
  'https://aistudiocdn.com/lucide-react@^0.556.0',
  'https://aistudiocdn.com/recharts@^3.5.1',
  'https://aistudiocdn.com/uuid@^13.0.0',
  'https://aistudiocdn.com/jspdf@^2.5.1',
  'https://aistudiocdn.com/jspdf-autotable@^3.8.2',
  'https://aistudiocdn.com/@google/genai@^1.32.0'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use no-cors for CDN assets to avoid opacity issues during cache
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log('Partial caching completed', err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Navigation Requests (HTML): Always serve index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch('./index.html').catch(() => {
           return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // 2. Ignore API calls
  if (url.hostname.includes('googleapis') || url.hostname.includes('generativelanguage')) {
    return;
  }

  // 3. Stale-While-Revalidate for all other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
         console.log('Network fetch failed', err);
      });

      return cachedResponse || fetchPromise;
    })
  );
});