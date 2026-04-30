export const formatTitle = (title: string | null | undefined): string => {
    if (!title) return "";
    return title.toLowerCase().replace(/\s+/g, "_");
};