export function toSlug(value: string): string {
  return encodeURIComponent(value.trim().toLowerCase()).replace(/%/g, '-');
}
