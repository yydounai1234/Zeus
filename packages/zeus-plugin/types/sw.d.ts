declare const scope: ServiceWorkerGlobalScope;
declare const targetHost = "sanzo.io";
declare const cacheVersion: number;
declare const cacheName: string;
/** Should retrieve resource from nodes */
declare function shouldRetrieveFromNodes(req: Request): boolean;
/** Get nodes with given resource url */
declare function resolveNodes(url: string): Promise<string[]>;
/** Construct new `Request` instance with given node & original request */
declare function withNode(originalReq: Request, node: string, init?: RequestInit): Request;
/** Check if node available */
declare function checkNode(node: string, req: Request): Promise<string>;
/** Get a readable summary of blob, for debug purpose. */
declare function summaryOfBlob(blob: Blob): Promise<string>;
/** Retrieve resource content from our nodes */
declare function retrieveFromNodes(request: Request): Promise<Response>;
/** Read response from cache for given request */
declare function readCache(request: Request): Promise<Response | undefined>;
/** Write response to cache for given request */
declare function writeCache(request: Request, response: Response): Promise<void>;
/** `Headers` instance -> object */
declare function normalizeHeaders(headers: Headers): Record<string, string>;
/** Parsed Info of request header `Range` */
interface Range {
    start?: number;
    end?: number;
}
declare function parseRangeHeader(v: string): Range;
/** Parsed Info of response header `Content-Range` */
interface ContentRange {
    size?: number;
    start?: number;
    end?: number;
}
declare function parseContentRangeHeader(v: string): ContentRange;
/** string -> number */
declare function atoi(v: string | undefined): number | undefined;
/** Get correct start / end for `Range` information based on given (total) size */
declare function normalizeRange({ start, end }: Range, size: number): {
    start: number;
    end: number;
};
/** Get correct start / end for `Content-Range` information based on given (total) size */
declare function normalizeContentRange({ start, end }: ContentRange, size: number): {
    start: number;
    end: number;
    size: number;
};
/** If given response matches given request range */
declare function matchRange(cacheItem: CacheItem, range: Range): boolean;
/** Create Partial Response based on given response and request range */
declare function createPartialResponse(cacheItem: CacheItem, range: Range): Promise<Response>;
/** DB instance */
declare let _db: IDBDatabase | undefined;
/** Get DB & initialize (if needed) */
declare function getDB(): Promise<IDBDatabase>;
interface CacheItem {
    url: string;
    headers: Record<string, string>;
    body: Blob;
}
declare function addCacheItem(item: CacheItem): Promise<void>;
declare function getCacheItems(url: string): Promise<CacheItem[]>;
