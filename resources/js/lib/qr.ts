export function buildQrUrl(cardId: number, size = 200) {
    const clampedSize = Math.max(100, Math.min(2000, size));
    const params = new URLSearchParams({ size: clampedSize.toString() });

    return `/cards/${cardId}/qr-image?${params.toString()}`;
}
