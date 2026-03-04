/**
 * Convert megabytes to human readable string.
 *
 * Rules:
 * - < 1024 MB  -> show MB
 * - >= 1024 MB -> show GB
 *
 * @param mb number (megabytes)
 * @param fractionDigits optional precision (default: 2)
 */
export function formatStorageFromMB(
    mb: number,
    fractionDigits = 2
): string {
    if (!Number.isFinite(mb) || mb < 0) {
        throw new Error("Invalid storage value");
    }

    if (mb < 1024) {
        return `${mb.toFixed(fractionDigits).replace(/\.00$/, "")} MB`;
    }

    const gb = mb / 1024;

    return `${gb
        .toFixed(fractionDigits)
        .replace(/\.00$/, "")} GB`;
}
