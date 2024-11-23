import queryString from 'query-string';

const cacheName = 'nuxt-cache';

async function isUrlCached (url: string, ttl: number): Promise<boolean> {
  const cache = await caches.open(cacheName);

  const cachedResponse = await cache.match(url);
  if (!cachedResponse) return false;

  const rawTimestamp = cachedResponse?.headers.get('x-sw-cache-timestamp');
  if (!rawTimestamp) return false;

  const timestamp = new Date(rawTimestamp).getTime();
  const curTimestamp = new Date(Date.now()).getTime();
  const diff = Math.abs(curTimestamp - timestamp);
  if (diff / (1000 * 60) > ttl) {
    return false;
  }

  return true;
}

function resolveUrl (url: string, options: { query: Record<string, unknown> }): string {
  return `${url}?${queryString.stringify(options.query || {})}`;
}

const inflightRequests = new Map<string, Promise<Response>>();

export default defineNuxtPlugin(() => {
  const cachedFetch = async (url: string, options: Parameters<typeof $fetch>[1] & { ttl?: number } = {}) => {
    async function fetch (): Promise<Response> {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(resolvedUrl);

      if (await isUrlCached(resolvedUrl, options.ttl || 0)) {
        cachedResponse?.headers.set('x-sw-cache-timestamp', new Date(Date.now()).toString());
        return cachedResponse!;
      }

      const response = await $fetch.raw(url, options);

      if (response.status < 400) {
        return response;
      }

      const clonedResponse = new Response(JSON.stringify(response._data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      clonedResponse.headers.append('x-sw-cache-timestamp', new Date(Date.now()).toString());
      await cache.put(resolvedUrl, clonedResponse);

      return clonedResponse;
    }

    const resolvedUrl = resolveUrl(url, options as any);
    if (inflightRequests.has(resolvedUrl)) {
      const response = await inflightRequests.get(resolvedUrl)!;
      return response._data;
    }

    const fetchOp = fetch();
    inflightRequests.set(resolvedUrl, fetchOp);
    const response = await fetchOp;
    inflightRequests.delete(resolvedUrl);

    return response._data;
  };

  return {
    provide: {
      cachedFetch,
    },
  };
});
