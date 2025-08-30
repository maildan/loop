// Utilities to process avatar images: resize/compress, gzip, base64 encode/decode
export async function fileToStoredAvatar(file: File, options?: {
    maxSizeBytes?: number;
    maxWidth?: number;
    quality?: number;
}): Promise<string> {
    const maxSizeBytes = options?.maxSizeBytes ?? 5 * 1024 * 1024; // 5MB
    const maxWidth = options?.maxWidth ?? 512;
    const quality = options?.quality ?? 0.75;

    // accept GIFs: keep original if gif
    const isGif = file.type === 'image/gif';

    // helper to read blob to uint8array
    const blobToUint8 = async (b: Blob) => {
        const ab = await b.arrayBuffer();
        return new Uint8Array(ab);
    };

    let targetBlob: Blob;

    if (isGif) {
        // For GIF, do not attempt canvas re-encoding (animated GIFs would lose frames)
        targetBlob = file;
    } else {
        // Load image into canvas to resize and convert to jpeg/webp
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });

        const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer webp where available, fall back to jpeg
        const mime = 'image/webp';
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve as any, mime, quality));
        targetBlob = blob || (await new Promise(resolve => canvas.toBlob(resolve as any, 'image/jpeg', quality)));
    }

    // If still too large, try lower quality iterations
    let finalBlob = targetBlob;
    if ((await finalBlob.arrayBuffer()).byteLength > maxSizeBytes && finalBlob.type !== 'image/gif') {
        // degrade quality
        let q = quality;
        while (q > 0.3) {
            q -= 0.15;
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const i = new Image();
                i.onload = () => resolve(i);
                i.onerror = reject;
                i.src = URL.createObjectURL(file);
            });
            const scale = Math.min(1, (options?.maxWidth ?? 512) / Math.max(img.width, img.height));
            const width = Math.round(img.width * scale);
            const height = Math.round(img.height * scale);
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) break;
            ctx.drawImage(img, 0, 0, width, height);
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve as any, 'image/webp', q));
            if (!blob) break;
            finalBlob = blob;
            if ((await finalBlob.arrayBuffer()).byteLength <= maxSizeBytes) break;
        }
    }

    // If still too large and is gif, reject
    if ((await finalBlob.arrayBuffer()).byteLength > maxSizeBytes) {
        throw new Error('Avatar exceeds maximum size after compression');
    }

    // gzip compress if available (CompressionStream)
    const inputBytes = await blobToUint8(finalBlob);

    let stored: string;
    if (typeof (window as any).CompressionStream === 'function') {
        // browser CompressionStream returns a stream of compressed bytes
        const cs = new (window as any).CompressionStream('gzip');
        const writer = cs.writable.getWriter();
        writer.write(inputBytes);
        writer.close();
        const compressedStream = cs.readable;
        const resp = new Response(compressedStream);
        const compressedBlob = await resp.blob();
        const compressedBytes = await blobToUint8(compressedBlob);
        const b64 = arrayBufferToBase64(compressedBytes);
        // prefix to indicate gzipped base64 storage
        stored = `gz+base64:${finalBlob.type}:${b64}`;
    } else {
        // Fallback: store as data URL (base64)
        const dataUrl = await blobToDataURL(finalBlob);
        stored = `data:${finalBlob.type};base64,${dataUrl.split(',')[1]}`;
    }

    return stored;
}

export async function storedAvatarToObjectURL(stored: string): Promise<string> {
    if (!stored) return '';
    if (stored.startsWith('gz+base64:')) {
        const parts = stored.split(':');
        const mime = parts[1] ?? 'application/octet-stream';
        const b64 = parts[2] ?? '';
        const compressed = base64ToUint8(b64);
        if (typeof (window as any).DecompressionStream === 'function') {
            const ds = new (window as any).DecompressionStream('gzip');
            const uint8 = compressed;
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(uint8);
                    controller.close();
                }
            });
            const dsReadable = stream.pipeThrough(ds);
            const resp = new Response(dsReadable);
            const blob = await resp.blob();
            return URL.createObjectURL(blob);
        } else {
            // cannot decompress in this environment; return empty string
            throw new Error('Decompression not supported in this runtime');
        }
    }

    if (stored.startsWith('data:')) {
        return stored;
    }

    // unknown format
    return stored;
}

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
    });
}

function arrayBufferToBase64(u8: Uint8Array): string {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < u8.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + chunk)) as any);
    }
    return btoa(binary);
}

function base64ToUint8(b64: string): Uint8Array {
    const binary = atob(b64);
    const len = binary.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        u8[i] = binary.charCodeAt(i);
    }
    return u8;
}
