import { serverDetails } from '@/src/config';

/** Product images are stored as file names and served by the backend at /files/<name>. */
export function fileUrl(name?: string | null): string {
    if (!name) return '';
    if (/^https?:\/\//i.test(name)) return name;
    const base = serverDetails.serverProxyURL.replace(/\/api$/, '');
    return `${base}/files/${encodeURIComponent(name)}`;
}

export const num = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};
