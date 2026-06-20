# Icon System Rules

## Mandatory Source

All generated and hand-coded design-system UI must use icons from:

`src/app/components/icons`

This folder is the only approved icon asset source for Startup Valley design work. The current set is Streamline Pixel SVG and any new icon added to the project must visually match that same pixel-grid style.

## Strict Rules

- Use icons from `src/app/components/icons` only.
- Do not import `lucide-react`, Heroicons, Font Awesome, Material Icons, emoji, icon fonts, or CDN icon assets in design-system surfaces.
- Do not hand-draw replacement SVG path icons when a matching or near-matching icon exists in `src/app/components/icons`.
- Do not add a new icon package to solve a missing icon.
- If an icon is missing, add a Streamline Pixel-style SVG to `src/app/components/icons`, then expose it through the local icon wrapper or registry.
- Icons must be rendered through project-local wrappers so size, color, accessibility labels, and dark/light surface behavior stay consistent.
- Any icon gallery, icon picker, generated design-system page, or AI design output should reference the full icon folder or a registry generated from it, not only the icons currently used by the UI.

## Wrapper Contract

Design-system icons should be consumed through a local API, currently:

`src/app/components/PixelIcons.tsx`

The wrapper must support:

- `size`
- `color`
- `className`
- `style`
- `title` for accessible named icons

SVG assets may be rendered inline or through CSS masking, but the consumer API must stay stable.

## Visual Theme

Use a consistent Streamline Pixel-inspired language:

- Pixel-grid silhouette, compact 24-32px source geometry.
- Mostly solid, blocky shapes.
- No thin outline-only icon style in the design system.
- No mixed visual metaphors from rounded outline icon packs.
- Preserve crisp edges at 12px, 14px, 16px, 18px, 20px, and 24px UI sizes.
- Icons inherit semantic color tokens from the surrounding component.

## Color Rules

| Color | Token | Use |
|---|---|---|
| `#94A3B8` | `--game-text-muted` | Neutral/decorative icons |
| `#006E85` | `--game-teal-mid` | Interactive and active icons |
| `#156162` | `--game-positive` | Positive deltas and gain states |
| `#c65252` | `--game-negative` | Negative deltas and danger states |
| `#B45309` | `--game-warning` | Delayed, caution, and lag states |
| `white` | none | Icons on dark or filled surfaces |

## Size Scale

| Size | Usage |
|---|---|
| 11-12px | Inline deltas, compact badges |
| 13-14px | Card header labels and dense rows |
| 16px | Standard UI icons and section labels |
| 18px | Decision icons inside tinted boxes |
| 20px | Tabs, nav, prominent actions |
| 24px | Empty states and feature callouts |

## Enforcement Checklist

Before design-system work is accepted:

- Search changed files for `lucide-react`, `@mui/icons-material`, `heroicons`, `fontawesome`, and emoji usage.
- Confirm new icon usage resolves to `src/app/components/icons` or the local wrapper around that folder.
- Confirm colors are token-matched and not arbitrary icon colors.
- Confirm icons remain crisp at the smallest size used in the component.
- Confirm any new icon has a comparable Streamline Pixel visual theme.
