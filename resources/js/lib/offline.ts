export type CacheResult = {
    cached: number;
    failed: number;
};

export function getAssetUrlsFromDocument(): string[] {
    const urls: string[] = [];

    document
        .querySelectorAll('script[src], link[rel="stylesheet"][href], link[rel="modulepreload"][href]')
        .forEach((el) => {
            const element = el as HTMLScriptElement | HTMLLinkElement;
            const rawUrl = 'src' in element ? element.src : element.href;
            if (!rawUrl) {
                return;
            }
            try {
                const url = new URL(rawUrl, window.location.origin).toString();
                urls.push(url);
            } catch (error) {
                // ignore invalid URLs
            }
        });

    return urls;
}

export async function cacheUrls(urls: string[]): Promise<CacheResult> {
    if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported in this browser.');
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
        throw new Error('Offline cache is not ready yet. Please refresh and try again.');
    }

    return new Promise((resolve, reject) => {
        const timeout = window.setTimeout(() => {
            navigator.serviceWorker.removeEventListener('message', handleMessage);
            reject(new Error('Offline cache request timed out.'));
        }, 120000);

        const handleMessage = (event: MessageEvent) => {
            if (!event.data || event.data.type !== 'CACHE_COMPLETE') {
                return;
            }

            window.clearTimeout(timeout);
            navigator.serviceWorker.removeEventListener('message', handleMessage);
            resolve({
                cached: Number(event.data.cached ?? 0),
                failed: Number(event.data.failed ?? 0),
            });
        };

        navigator.serviceWorker.addEventListener('message', handleMessage);
        registration.active.postMessage({ type: 'CACHE_URLS', urls });
    });
}
