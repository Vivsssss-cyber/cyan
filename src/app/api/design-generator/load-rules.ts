import fs from "fs";
import path from "path";

let cached: string | null = null;

export function loadDesignRules(): string {
  if (cached) return cached;

  const base = path.join(process.cwd(), "design-rules");

  const files = [
    { name: "design-dna.md", label: "DESIGN DNA (CHARACTER BRIEF)" },
    { name: "DESIGN.md", label: "MASTER DESIGN REFERENCE" },
    { name: "component-rules.md", label: "COMPONENT RULES" },
    { name: "tokens.css", label: "CSS DESIGN TOKENS (--sv-* variables)" },
  ];

  const sections = files.map(({ name, label }) => {
    const content = fs.readFileSync(path.join(base, name), "utf-8");
    return `=== ${label} ===\n${content}`;
  });

  cached = sections.join("\n\n");
  return cached;
}

export function loadTokensCss(): string {
  return fs.readFileSync(
    path.join(process.cwd(), "design-rules", "tokens.css"),
    "utf-8"
  );
}
