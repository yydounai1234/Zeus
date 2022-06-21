// @ts-ignore
const scope = self as unknown as ServiceWorkerGlobalScope

const targetHost = 'sanzo.io'

// version for cached content
declare const cacheVersion: number
// name for Cache object
const cacheName = `sanzo@v${cacheVersion}`

scope.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== cacheName) {
            console.info('Deleting out of date cache:', name)
            return caches.delete(name)
          }
        })
      )
    })
  )
})

scope.addEventListener('fetch', async (event: FetchEvent) => {
  const { request } = event
  if (!shouldRetrieveFromNodes(request)) {
    return
  }

  event.respondWith(retrieveFromNodes(request))
})

/** Should retrieve resource from nodes */
function shouldRetrieveFromNodes(req: Request) {
  const { hostname } = new URL(req.url)
  const target = 'sanzo.io'
  return (
    hostname === target
    || hostname.endsWith('.' + target)
  )
}

/** Get nodes with given resource url */
async function resolveNodes(url: string): Promise<string[]> {
  const resp = await fetch('/api/resolve?url=' + encodeURIComponent(url))
  const ips = await resp.json()
  return ips
}

/** Construct new `Request` instance with given node & original request */
function withNode(
  originalReq: Request,
  node: string,
  init?: RequestInit
) {
  const {
    cache, credentials, headers, integrity, method,
    mode, redirect, referrer, referrerPolicy, body,
    url: originalUrl
  } = originalReq
  const urlObject = new URL(originalUrl)
  urlObject.hostname = node
  const req = new Request(urlObject.href, {
    mode: 'cors',
    credentials: 'omit',
    cache, integrity, method, redirect,
    referrer, referrerPolicy, headers, body,
    ...init
  })
  return req
}

/** Check if node available */
async function checkNode(node: string, req: Request) {
  const newReq = withNode(req, node, { method: 'HEAD' })
  await fetch(newReq)
  return node
}

/** Get a readable summary of blob, for debug purpose. */
async function summaryOfBlob(blob: Blob) {
  const start = new Uint8Array(await blob.slice(0, 5).arrayBuffer()).toString()
  const end = new Uint8Array(await blob.slice(blob.size - 5, blob.size).arrayBuffer()).toString()
  return `[]${blob.size}{${start},...,${end}}`
}

/** Retrieve resource content from our nodes */
async function retrieveFromNodes(request: Request) {
  const cached = await readCache(request)
  if (cached) {
    const cachedBody = await cached.clone().blob()
    const cachedBodySummary = await summaryOfBlob(cachedBody)
    console.info(
      'Hit:',
      request.url,
      request.headers.get('range'),
      cachedBodySummary
    )
    return cached
  }
  console.info('Miss:', request.url, request.headers.get('range'))

  const nodes = await resolveNodes(request.url)
  const node = await Promise.any(nodes.map(
    // TODO: abort pending requests
    node => checkNode(node, request)
  ))
  const newReq = withNode(request, node)
  const resp = await fetch(newReq)

  const respForCache = resp.clone()
  writeCache(request, respForCache).then(() => {
    console.info('Cache saved:', request.url, respForCache.headers.get('content-range'))
  },e => {
    console.warn('Save cache failed:', e)
  })

  return resp
}

/** Read response from cache for given request */
async function readCache(request: Request) {
  const cache = await caches.open(cacheName)

  // Normal (no-range) request
  const rangeHeader = request.headers.get('range')
  if (!rangeHeader) {
    return cache.match(request)
  }

  // Range request
  const range = parseRangeHeader(rangeHeader)
  const cached = await getCacheItems(request.url)
  console.info(`${cached.length} cached items found for ${request.url}`)
  for (const cachedItem of cached) {
    if (matchRange(cachedItem, range)) {
      return createPartialResponse(cachedItem, range)
    }
  }
}

/** Write response to cache for given request */
async function writeCache(request: Request, response: Response) {
  const cache = await caches.open(cacheName)

  // Normal (no-partial) response
  if (response.status != 206) {
    return cache.put(request, response.clone())
  }

  const body = await response.blob()
  const cacheItem: CacheItem = {
    url: request.url,
    headers: normalizeHeaders(response.headers),
    body
  }
  const bodySummary = await summaryOfBlob(body)
  console.log('addCacheItem', bodySummary)
  return addCacheItem(cacheItem)
}

/** `Headers` instance -> object */
function normalizeHeaders(headers: Headers) {
  const res: Record<string, string> = {}
  headers.forEach((value, key) => {
    res[key] = value
  })
  return res
}

/** Parsed Info of request header `Range` */
interface Range {
  start?: number
  end?: number
}

// Parse value of request header `Range`
function parseRangeHeader(v: string): Range {
  const normalized = v.trim().toLowerCase()
  if (!normalized.startsWith('bytes=')) {
    throw new Error(`Unit must be bytes: ${v}`)
  }

  // Specifying multiple ranges separate by commas is valid syntax, but this
  // library only attempts to handle a single, contiguous sequence of bytes.
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range#Syntax
  if (normalized.includes(',')) {
    throw new Error(`Multiple range: ${v}`)
  }

  const [, start, end] = /(\d*)-(\d*)/.exec(normalized) || []
  // We need either at least one of the start or end values.
  if (!start && !end) {
    throw new Error(`Invalid range values: ${v}`);
  }

  return {
    start: atoi(start),
    end: atoi(end)
  } as Range
}

/** Parsed Info of response header `Content-Range` */
interface ContentRange {
  size?: number
  start?: number
  end?: number
}

// Parse value of response header `Content-Range`
function parseContentRangeHeader(v: string): ContentRange {
  const normalized = v.trim().toLowerCase()
  const [unit, rest] = normalized.split(/\s+/)

  if (unit !== 'bytes') {
    throw new Error(`Unit must be bytes: ${v}`)
  }

  const [range, size] = rest.split('/')
  const sizeNum = size === '*' ? undefined : atoi(size)
  const [start, end] = range.includes('-') ? range.split('-') : []

  return {
    size: sizeNum,
    start: atoi(start),
    end: atoi(end)
  }
}

/** string -> number */
function atoi(v: string | undefined) {
  return !v ? undefined : Number(v)
}

/** Get correct start / end for `Range` information based on given (total) size */
function normalizeRange({ start, end }: Range, size: number) {
  if ((end && end > size) || (start && start < 0)) {
    throw new Error(`Range conflict with size: ${start}-${end}, ${size}`)
  }

  let effectiveStart = 0
  let effectiveEnd = 0

  if (start != null && end != null) {
    effectiveStart = start
    // Range values are inclusive, so add 1 to the value.
    effectiveEnd = end + 1
  } else if (start != null && end == null) {
    effectiveStart = start
    effectiveEnd = size
  } else if (end != null && start == null) {
    effectiveStart = size - end
    effectiveEnd = size
  }

  return {
    start: effectiveStart,
    end: effectiveEnd
  }
}

/** Get correct start / end for `Content-Range` information based on given (total) size */
function normalizeContentRange({ start, end }: ContentRange, size: number) {
  return {
    start: start ?? 0,
    end: end != null ? (end + 1) : size,
    size
  }
}

/** If given response matches given request range */
function matchRange(cacheItem: CacheItem, range: Range) {
  const contentRangeHeader = cacheItem.headers['content-range']
  if (contentRangeHeader == null) return false
  const contentRange = parseContentRangeHeader(contentRangeHeader)
  const size = contentRange.size
  if (size == null) return false
  const { start: reqStart, end: reqEnd } = normalizeRange(range, size)
  const { start: respStart, end: respEnd } = normalizeContentRange(contentRange, size)
  console.info(`Match ${reqStart}-${reqEnd} with ${respStart}-${respEnd}`)
  return (
    respStart <= reqStart
    && respEnd >= reqEnd
  )
}

/** Create Partial Response based on given response and request range */
async function createPartialResponse(cacheItem: CacheItem, range: Range) {
  const originalBlob = cacheItem.body
  const contentRangeHeader = cacheItem.headers['content-range']
  const contentRange = parseContentRangeHeader(contentRangeHeader!)
  const size = contentRange.size
  if (size == null) {
    throw new Error('Invalid size in Content-Range')
  }
  const { start: offset } = normalizeContentRange(contentRange, size)
  const { start, end } = normalizeRange(range, size)

  const slicedBlob = originalBlob.slice(start - offset, end - offset)

  const slicedHeaders = new Headers(cacheItem.headers)
  slicedHeaders.set('Accept-Ranges', 'bytes')
  slicedHeaders.set('Content-Length', String(slicedBlob.size))
  slicedHeaders.set('Content-Range', `bytes ${start}-${end - 1}/${size}`)
  slicedHeaders.set('X-Service-Worker', 'sliced')

  const slicedResponse = new Response(slicedBlob, {
    status: 206,
    statusText: 'Partial Content',
    headers: slicedHeaders
  })

  return slicedResponse
}

/** DB instance */
let _db: IDBDatabase | undefined = undefined

/** Get DB & initialize (if needed) */
async function getDB() {
  if (_db != null) return _db
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = scope.indexedDB.open('sanzo', cacheVersion)
    req.addEventListener('error', e => {
      console.warn('Load DB failed:', e)
      reject(e)
    })
    req.addEventListener('success', () => {
      console.info('DB initialized.')
      _db = req.result
      resolve(_db)
    })
    req.addEventListener('upgradeneeded', e => {
      const upgradedDB = req.result
      upgradedDB.addEventListener('error', e => {
        console.warn('DB error:', e)
      })
      let objectStore = upgradedDB.createObjectStore('cache', { autoIncrement: true })
      objectStore.createIndex('url', 'url', { unique: false })
      console.log('Object store created.')
    })
  })
}

interface CacheItem {
  url: string
  headers: Record<string, string>
  body: Blob
}

async function addCacheItem(item: CacheItem) {
  const db = await getDB()
  return new Promise<void>((resolve, reject) => {
    const req = db.transaction(['cache'], 'readwrite')
      .objectStore('cache')
      .add(item)

    req.addEventListener('success', e => resolve())
    req.addEventListener('error', e => reject(e))
  })
}

async function getCacheItems(url: string): Promise<CacheItem[]> {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const index = db.transaction(['cache'], 'readonly')
      .objectStore('cache')
      .index('url')
    const request = index.getAll(url)
    request.addEventListener('success', () => {
      resolve(request.result)
    })
    request.addEventListener('error', e => {
      reject(e)
    })
  })
}
