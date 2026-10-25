const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function compactCount(n: number): string {
  return compactFormatter.format(n);
}
