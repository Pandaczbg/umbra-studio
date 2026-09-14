/** Serbian Latin matching: č/ć/š/ž and đ/dj share search keys. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "dj")
    .trim();
}
