'use client';

import React, { useEffect, useState } from 'react';

// Fetched + normalized SVG markup, keyed by source URL. Each icon is fetched once.
const cache = new Map<string, string>();

function normalize(svg: string): string {
  return svg
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // strip fixed pixel dimensions so the svg scales to its container
    .replace(/\s(width|height)="[^"]*"/gi, '')
    // recolor the pixel glyphs (hardcoded near-black) to follow `color`
    .replace(/fill="(#000001|#000000|#000|black)"/gi, 'fill="currentColor"')
    // make the root svg fill the wrapper
    .replace(/<svg\b/i, '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet"');
}

function fetchInto(src: string): Promise<string | undefined> {
  if (cache.has(src)) return Promise.resolve(cache.get(src));
  return fetch(src)
    .then((r) => r.text())
    .then((text) => {
      const cleaned = normalize(text);
      cache.set(src, cleaned);
      return cleaned;
    })
    .catch(() => undefined);
}

/**
 * Eagerly fetch + normalize a batch of icon SVGs into the shared cache.
 * Call this at page load (well before any Figma capture) so that when the
 * page flips into capture mode, {@link InlineSvgIcon} finds markup in the
 * cache on its FIRST render and emits inline <svg> synchronously — no async
 * fetch in the capture critical path (which would serialize as empty boxes).
 */
export function warmInlineSvgCache(srcs: string[]): Promise<void> {
  return Promise.all(srcs.map(fetchInto)).then(() => undefined);
}

/**
 * Renders an icon SVG inline (vector) so Figma's html-to-design capture imports
 * it as editable vector nodes instead of a blank CSS-mask box.
 * See {@link useFigmaCapture} for when this path is used.
 */
export function InlineSvgIcon({
  src,
  markup: markupProp,
  size = 20,
  color = 'currentColor',
  title,
  rotation = 0,
  className,
  style,
}: {
  /** Pre-inlined, already-normalized SVG markup. Preferred — renders synchronously. */
  markup?: string;
  /** Fallback: a URL to fetch + normalize at runtime (legacy path). */
  src?: string;
  size?: number;
  color?: string;
  title?: string;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [markup, setMarkup] = useState<string | null>(
    () => markupProp ?? (src ? cache.get(src) ?? null : null),
  );

  useEffect(() => {
    if (markupProp || !src) return;
    if (cache.has(src)) {
      setMarkup(cache.get(src)!);
      return;
    }
    let active = true;
    fetchInto(src).then((cleaned) => {
      if (active && cleaned) setMarkup(cleaned);
    });
    return () => {
      active = false;
    };
  }, [src, markupProp]);

  const resolved = markupProp ?? markup;

  return (
    <span
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? 'img' : undefined}
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        flexShrink: 0,
        lineHeight: 0,
        color,
        ...style,
        transform: rotation ? `rotate(${rotation}deg)` : style?.transform,
      }}
      {...(resolved ? { dangerouslySetInnerHTML: { __html: resolved } } : {})}
    />
  );
}
