(function(){"use strict";const h=self,w=`sanzo@v${cacheVersion}`;h.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(n=>Promise.all(n.map(t=>{if(t!==w)return console.info("Deleting out of date cache:",t),caches.delete(t)}))))}),h.addEventListener("fetch",async e=>{const{request:n}=e;!$(n)||e.respondWith(L(n))});function $(e){const{hostname:n}=new URL(e.url),t="sanzo.io";return n===t||n.endsWith("."+t)}async function z(e){return await(await fetch("/api/resolve?url="+encodeURIComponent(e))).json()}function g(e,n,t){const{cache:r,credentials:o,headers:c,integrity:s,method:a,mode:i,redirect:f,referrer:d,referrerPolicy:v,body:P,url:x}=e,E=new URL(x);return E.hostname=n,new Request(E.href,{mode:"cors",credentials:"omit",cache:r,integrity:s,method:a,redirect:f,referrer:d,referrerPolicy:v,headers:c,body:P,...t})}async function C(e,n){const t=g(n,e,{method:"HEAD"});return await fetch(t),e}async function m(e){const n=new Uint8Array(await e.slice(0,5).arrayBuffer()).toString(),t=new Uint8Array(await e.slice(e.size-5,e.size).arrayBuffer()).toString();return`[]${e.size}{${n},...,${t}}`}async function L(e){const n=await S(e);if(n){const a=await n.clone().blob(),i=await m(a);return console.info("Hit:",e.url,e.headers.get("range"),i),n}console.info("Miss:",e.url,e.headers.get("range"));const t=await z(e.url),r=await Promise.any(t.map(a=>C(a,e))),o=g(e,r),c=await fetch(o),s=c.clone();return B(e,s).then(()=>{console.info("Cache saved:",e.url,s.headers.get("content-range"))},a=>{console.warn("Save cache failed:",a)}),c}async function S(e){const n=await caches.open(w),t=e.headers.get("range");if(!t)return n.match(e);const r=U(t),o=await N(e.url);console.info(`${o.length} cached items found for ${e.url}`);for(const c of o)if(j(c,r))return D(c,r)}async function B(e,n){const t=await caches.open(w);if(n.status!=206)return t.put(e,n.clone());const r=await n.blob(),o={url:e.url,headers:H(n.headers),body:r},c=await m(r);return console.log("addCacheItem",c),I(o)}function H(e){const n={};return e.forEach((t,r)=>{n[r]=t}),n}function U(e){const n=e.trim().toLowerCase();if(!n.startsWith("bytes="))throw new Error(`Unit must be bytes: ${e}`);if(n.includes(","))throw new Error(`Multiple range: ${e}`);const[,t,r]=/(\d*)-(\d*)/.exec(n)||[];if(!t&&!r)throw new Error(`Invalid range values: ${e}`);return{start:l(t),end:l(r)}}function y(e){const n=e.trim().toLowerCase(),[t,r]=n.split(/\s+/);if(t!=="bytes")throw new Error(`Unit must be bytes: ${e}`);const[o,c]=r.split("/"),s=c==="*"?void 0:l(c),[a,i]=o.includes("-")?o.split("-"):[];return{size:s,start:l(a),end:l(i)}}function l(e){return e?Number(e):void 0}function p({start:e,end:n},t){if(n&&n>t||e&&e<0)throw new Error(`Range conflict with size: ${e}-${n}, ${t}`);let r=0,o=0;return e!=null&&n!=null?(r=e,o=n+1):e!=null&&n==null?(r=e,o=t):n!=null&&e==null&&(r=t-n,o=t),{start:r,end:o}}function R({start:e,end:n},t){return{start:e!=null?e:0,end:n!=null?n+1:t,size:t}}function j(e,n){const t=e.headers["content-range"];if(t==null)return!1;const r=y(t),o=r.size;if(o==null)return!1;const{start:c,end:s}=p(n,o),{start:a,end:i}=R(r,o);return console.info(`Match ${c}-${s} with ${a}-${i}`),a<=c&&i>=s}async function D(e,n){const t=e.body,r=e.headers["content-range"],o=y(r),c=o.size;if(c==null)throw new Error("Invalid size in Content-Range");const{start:s}=R(o,c),{start:a,end:i}=p(n,c),f=t.slice(a-s,i-s),d=new Headers(e.headers);return d.set("Accept-Ranges","bytes"),d.set("Content-Length",String(f.size)),d.set("Content-Range",`bytes ${a}-${i-1}/${c}`),d.set("X-Service-Worker","sliced"),new Response(f,{status:206,statusText:"Partial Content",headers:d})}let u;async function b(){return u!=null?u:new Promise((e,n)=>{const t=h.indexedDB.open("sanzo",cacheVersion);t.addEventListener("error",r=>{console.warn("Load DB failed:",r),n(r)}),t.addEventListener("success",()=>{console.info("DB initialized."),u=t.result,e(u)}),t.addEventListener("upgradeneeded",r=>{const o=t.result;o.addEventListener("error",s=>{console.warn("DB error:",s)}),o.createObjectStore("cache",{autoIncrement:!0}).createIndex("url","url",{unique:!1}),console.log("Object store created.")})})}async function I(e){const n=await b();return new Promise((t,r)=>{const o=n.transaction(["cache"],"readwrite").objectStore("cache").add(e);o.addEventListener("success",c=>t()),o.addEventListener("error",c=>r(c))})}async function N(e){const n=await b();return new Promise((t,r)=>{const c=n.transaction(["cache"],"readonly").objectStore("cache").index("url").getAll(e);c.addEventListener("success",()=>{t(c.result)}),c.addEventListener("error",s=>{r(s)})})}})();
