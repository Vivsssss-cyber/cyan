# Startup Valley Design Rules

This folder packages the current design DNA into reusable project assets.

## Files

- `design-system.html`: self-contained snapshot of the live `/design-system` route — all components, tokens, and patterns rendered in-browser
- `design-dna.md`: human-readable design system brief extracted from `DESIGN.md`
- `tokens.css`: portable CSS variable layer for any web stack
- `component-rules.md`: implementation rules for cards, buttons, metrics, layout, and motion
- `icon-system-rules.md`: strict icon source and visual-theme rules for Streamline Pixel SVG usage

## Recommended use

1. Import `tokens.css` before component styles.
2. Treat CSS variables as the source of truth; do not hardcode brand hex values in components.
3. Reuse the component rules as acceptance criteria during migration.
4. Use only icons from `src/app/components/icons` through local wrappers or registries.
