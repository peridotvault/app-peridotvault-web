export function short(v?: string, head = 5, tail = 4) {
    if (!v) return "-";
    if (v.length <= head + tail + 3) return v;
    return `${v.slice(0, head)}...${v.slice(-tail)}`;
}