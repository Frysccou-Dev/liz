import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p", "a", "span"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}
