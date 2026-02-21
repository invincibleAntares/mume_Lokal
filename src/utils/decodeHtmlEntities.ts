const ENTITIES: Record<string, string> = {
  "&quot;": '"',
  "&amp;": "&",
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&nbsp;": " ",
};

/**
 * Decode HTML entities in API-sourced text (e.g. JioSaavn returns &quot; for ")
 */
export function decodeHtmlEntities(str: string | undefined | null): string {
  if (str == null || typeof str !== "string") return "";
  let out = str;
  for (const [entity, char] of Object.entries(ENTITIES)) {
    out = out.split(entity).join(char);
  }
  // Numeric decimal: &#123;
  out = out.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  // Numeric hex: &#x1F;
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );
  return out;
}
