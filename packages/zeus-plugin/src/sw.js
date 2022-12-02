let filesCacheName = zeus_cacheVersion

let appShellFiles = zeus_appShellFiles

let patten = zeus_patten

self.addEventListener('install', function (e) {
  self.skipWaiting()
  e.waitUntil(
    caches.open(filesCacheName).then((cache) => {
      console.debug('[zeus] 缓存所有文件:' + JSON.stringify(appShellFiles))
      return cache.addAll(appShellFiles)
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    self.clients.claim().then(() => {
      return caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (cacheName) {
              return cacheName != filesCacheName
            })
            .map(function (cacheName) {
              return caches.delete(cacheName)
            })
        )
      })
    })
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(proxyRequest(e.request))
})

const isCacheSource = (url) => {
  return patten.test(url)
}

const proxyRequest = async (request) => {
  if (isCacheSource(request.url)) {
    return caches.match(request).then(function (response) {
      if (response) {
        console.debug('[zeus] 命中资源:' + request.url)
        return response
      } else {
        return fetch(request).then((response) => {
          return caches.open(filesCacheName).then((cache) => {
            console.debug('[zeus] 缓存新资源:' + request.url)
            cache.put(request, response.clone())
            return response
          })
        })
      }
    })
  } else {
    return fetch(request)
  }
}
