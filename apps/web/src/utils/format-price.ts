export function formatPriceFrom(value: string): string {
  if (!value.trim()) return "";

  const withoutPrefix = value.replace(/^₹\s*/, "").trimStart();
  if (!withoutPrefix) return "";

  const formatted = withoutPrefix.replace(/\b(l|cr|k)\b/gi, (match) => match.toUpperCase());
  return `₹ ${formatted}`;
}
