export function getAssetUrl(key: string): string {

    // If it's already a full URL, return as-is
    if (key.startsWith('http://') || key.startsWith('https://')) {
        return key;
    }

    // Construct URL using backend storage endpoint
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    return `${baseUrl}/storage/files/${key}`;
}