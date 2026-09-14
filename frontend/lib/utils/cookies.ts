/**
 * Browser cookie utilities
 *
 * Centralised so that every module reads cookies consistently.
 * The name is regex-escaped to prevent ReDoS from caller-supplied
 * special characters (e.g. ".", "+", "(" in cookie names).
 */

/**
 * Reads a cookie by name from `document.cookie`.
 * Returns `null` on the server (SSR/Edge) or when the cookie is absent.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  // Escape regex metacharacters in the cookie name
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(
    new RegExp('(^|;\\s*)' + escapedName + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[2]) : null;
}
