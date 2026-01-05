export function short(v?: string, head = 10, tail = 10) {
    if (!v) return "-";
    if (v.length <= head + tail + 3) return v;
    return `${v.slice(0, head)}...${v.slice(-tail)}`;
}