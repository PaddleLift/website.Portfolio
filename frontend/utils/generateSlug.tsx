export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/\(/g, "") // Remove parentheses
    .replace(/\)/g, "");
}
