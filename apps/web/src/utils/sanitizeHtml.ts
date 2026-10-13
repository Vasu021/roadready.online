/**
 * Conservative HTML sanitiser for the small blocks of rich text the API
 * serves (country facts).
 *
 * The content is authored by us today, but it arrives over the network and is
 * injected with dangerouslySetInnerHTML, so it is treated as untrusted. The
 * approach is allowlist-only: the markup is parsed, then rebuilt keeping just
 * the permitted tags and *no attributes at all*, which removes event handlers,
 * javascript: URLs and style-based vectors by construction.
 */

const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "UL",
  "OL",
  "LI",
  "STRONG",
  "B",
  "EM",
  "I",
  "SPAN",
  "H3",
  "H4",
]);

export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== "string" || dirty.length === 0) return "";

  // No DOM (SSR or a test runner): fall back to plain text.
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return dirty.replace(/<[^>]*>/g, "");
  }

  const parsed = new DOMParser().parseFromString(dirty, "text/html");
  const out = document.createElement("div");

  function walk(source: Node, target: Node): void {
    source.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        target.appendChild(document.createTextNode(child.textContent ?? ""));
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) return;

      const element = child as Element;

      // Not on the allowlist: drop the tag but keep its text content.
      if (!ALLOWED_TAGS.has(element.tagName)) {
        if (
          element.tagName === "SCRIPT" ||
          element.tagName === "STYLE" ||
          element.tagName === "IFRAME" ||
          element.tagName === "OBJECT" ||
          element.tagName === "EMBED"
        ) {
          return; // Drop these entirely, text and all.
        }
        walk(element, target);
        return;
      }

      // Rebuilt without any attributes.
      const clean = document.createElement(element.tagName.toLowerCase());
      walk(element, clean);
      target.appendChild(clean);
    });
  }

  walk(parsed.body, out);
  return out.innerHTML;
}
