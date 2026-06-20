import Anthropic from "@anthropic-ai/sdk";
import { loadDesignRules, loadTokensCss } from "./load-rules";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const OUTPUT_FORMAT_INSTRUCTIONS = `
## OUTPUT INSTRUCTIONS

You are generating a screen design in the Startup Valley design language.

CRITICAL RULES:
1. Return ONLY HTML inside <html-output> tags. Nothing else outside those tags.
2. Write only the <body> content — no <html>, <head>, or <style> tags.
3. Use ONLY var(--sv-*) CSS custom properties for all colors, fonts, radius, and shadows. NEVER hardcode hex values.
4. Do NOT use Tailwind class names — the iframe does not have Tailwind loaded.
5. Use inline styles or a single <style> block at the top of your body output.
6. Font is already loaded: use font-family: var(--sv-font-ui) everywhere.
7. The canvas background is already set: do not set background on <body>.
8. Do NOT import React, JSX, or any external scripts.
9. Do NOT use emojis. Use only text labels and geometric shapes for icons.
10. No 3-equal-column grids. Use asymmetric CSS Grid layouts.

DESIGN RULES TO FOLLOW:
- All cards: background rgba(255,255,255,0.6), border: 1.4px solid white, border-radius: var(--sv-radius-2xl), padding: 20px
- Typography: Outfit only, sizes from 10px (badges) to 32px (display)
- KPI numbers: font-variant-numeric: tabular-nums
- Primary accent: var(--sv-cyan)
- Section labels: small eyebrow chip (--sv-cyan-tint bg, --sv-teal-mid text, 10px 700) + title (15px 700)
- Positive delta: color var(--sv-positive)
- Negative delta: color var(--sv-negative)
- Warning: color var(--sv-warning)
- Max page width: var(--sv-max-page-width) = 1312px

LAYOUT PRINCIPLES:
- Design for 1280px viewport width
- Use CSS Grid for major sections
- Hero: left 60% dominant + right 40% secondary
- No centered layouts — left-align or split screen
- Content fills the full viewport height (min-height: 100vh)

BANNED PATTERNS:
- No emojis
- No Inter, Georgia, serif fonts
- No pure black — use var(--sv-ink) or var(--sv-foreground)
- No purple in UI chrome (charts only)
- No 3-equal-column grids
- No floating labels
- No AI copywriting clichés (Elevate, Seamless, Unleash, Next-Gen)
- No broken image links — use colored div blocks or SVG shapes instead
- No hardcoded hex colors

FIGMA-FRIENDLY HTML REQUIREMENTS:
- Use semantic HTML elements: <header>, <main>, <section>, <article>, <nav>, <aside>, <footer>
- Every visible text must be real DOM text nodes — no text in CSS content: "" pseudo-elements
- No canvas, no WebGL, no video backgrounds
- Minimize ::before / ::after pseudo-elements with decorative text; use real elements instead
- All layout via CSS Grid or Flexbox — no absolute positioning for primary content
- No CSS animations that would confuse static capture (transitions OK, keyframe loops avoid)
- SVG charts/icons must be inline SVG with real <path> / <rect> / <text> elements
- Each logical section wrapped in a named element with a descriptive class (e.g. class="kpi-ribbon", class="main-chart-card")
- Use explicit width/height on SVG elements

OUTPUT FORMAT:
<html-output>
<!-- your body HTML here -->
</html-output>

Do not write anything before or after the <html-output> tags.
`;

function buildIframeShell(bodyHtml: string, tokensCss: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
${tokensCss}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--sv-font-ui);
      background-color: var(--sv-background);
      background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent calc(var(--sv-grid-size) - 1px),
        rgba(35,35,35,0.03) var(--sv-grid-size)
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent calc(var(--sv-grid-size) - 1px),
        rgba(35,35,35,0.03) var(--sv-grid-size)
      );
      color: var(--sv-text);
      min-height: 100vh;
    }
    .sv-tabular { font-variant-numeric: tabular-nums; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function extractHtmlOutput(text: string): string | null {
  const match = text.match(/<html-output>([\s\S]*?)<\/html-output>/);
  return match ? match[1].trim() : null;
}

function sendEvent(
  controller: ReadableStreamDefaultController,
  event: string,
  data: unknown
) {
  const encoder = new TextEncoder();
  controller.enqueue(
    encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const brief = formData.get("brief") as string;
  const file = formData.get("file") as File | null;

  if (!brief?.trim()) {
    return new Response(JSON.stringify({ error: "Brief is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const designRules = loadDesignRules();
  const tokensCss = loadTokensCss();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Build user message content
        const userContent: Anthropic.MessageParam["content"] = [];

        // Add image if provided
        if (file) {
          sendEvent(controller, "status", { phase: "uploading_file" });

          const mimeType = file.type as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp";
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");

          userContent.push({
            type: "image",
            source: { type: "base64", media_type: mimeType, data: base64 },
          });

          userContent.push({
            type: "text",
            text: "The image above is a reference for content, structure, and intent — NOT for visual style. Reinterpret it through the Startup Valley design language.",
          });
        }

        userContent.push({
          type: "text",
          text: `DESIGN BRIEF:\n${brief.trim()}`,
        });

        sendEvent(controller, "status", { phase: "generating" });

        // Stream from Claude
        const claudeStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          system: [
            {
              type: "text",
              text: `You are an expert UI designer who implements screens in the Startup Valley design language.\n\n${designRules}\n\n${OUTPUT_FORMAT_INSTRUCTIONS}`,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userContent }],
        });

        let fullText = "";

        for await (const chunk of claudeStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            fullText += chunk.delta.text;
            sendEvent(controller, "delta", { text: chunk.delta.text });
          }
        }

        // Extract and wrap HTML
        const bodyHtml = extractHtmlOutput(fullText);

        if (!bodyHtml) {
          sendEvent(controller, "error", {
            message:
              "No HTML output found in response. The AI may not have followed the format instructions.",
          });
          controller.close();
          return;
        }

        const iframeHtml = buildIframeShell(bodyHtml, tokensCss);

        sendEvent(controller, "done", {
          html: iframeHtml,
          bodyHtml,
          jsx: null,
          designSummary: null,
          ruleCheck: null,
          warnings: [],
        });

        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        sendEvent(controller, "error", { message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
