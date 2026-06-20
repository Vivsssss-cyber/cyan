import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@anthropic-ai/sdk"],
  webpack(config) {
    // SVGR: import *.svg as inline React components (real <svg> vectors).
    // This is what makes icons survive Figma html-to-design capture — inline
    // SVG serializes as editable vector nodes, unlike CSS mask-image (which
    // Figma drops) or runtime-fetched markup (which races the capture).
    // Use *.svg?url anywhere a plain URL string is still needed.
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: { test?: (s: string) => boolean } }) =>
        rule.test?.test?.(".svg"),
    ) as { test?: RegExp; exclude?: RegExp; issuer?: unknown; resourceQuery?: { not?: RegExp[] } } | undefined;

    config.module.rules.push(
      // Keep the original asset loader, but only for *.svg?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      // Everything else: *.svg -> React component, fills become currentColor
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not ?? []), /url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              dimensions: false, // let width/height props control size
              svgoConfig: {
                plugins: [
                  { name: "preset-default", params: { overrides: { removeViewBox: false } } },
                  { name: "convertColors", params: { currentColor: true } },
                ],
              },
            },
          },
        ],
      },
    );

    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
