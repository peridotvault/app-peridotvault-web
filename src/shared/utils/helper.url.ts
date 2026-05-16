const LOCAL_HOSTS = new Set(["localhost", "0.0.0.0", "127.0.0.1", "[::1]"]);

function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.PUBLIC_API_BASE_URL ??
    "https://api.peridotvault.com"
  );
}

export function normalizeAssetUrl(url: string | null): string {
  if (!url) return url ?? "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  try {
    const parsed = new URL(url);
    if (LOCAL_HOSTS.has(parsed.hostname)) {
      const base = getApiBaseUrl();
      const newUrl = new URL(base);
      parsed.protocol = newUrl.protocol;
      parsed.hostname = newUrl.hostname;
      parsed.port = newUrl.port;
      return parsed.toString();
    }
  } catch {
    // invalid URL — return as-is
  }

  return url;
}

export function getAssetUrl(key: string | null): string {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return normalizeAssetUrl(key);
  }

  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/storage/files/${key}`;
}