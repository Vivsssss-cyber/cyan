import { useEffect, useState } from 'react';

/**
 * True while the page is being captured for Figma (html-to-design).
 * The capture toolbar appends `#figmacapture=…` to the URL hash, so we
 * watch the hash and flip into a capture-friendly render path.
 *
 * Why this exists: icons normally render as CSS `mask-image` spans (instant,
 * recolorable), but CSS masks are NOT serialized by Figma's capture — they
 * land as blank boxes. In capture mode we swap to real inline <svg> so Figma
 * imports them as editable vector nodes.
 */
export function useFigmaCapture() {
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    const check = () => setCapturing(/figmacapture/i.test(window.location.hash));
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  return capturing;
}
