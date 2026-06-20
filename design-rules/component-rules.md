# Component Rules

## Cards

- Default card: `background: rgba(255,255,255,0.6)`, `border: 1.4px solid white`, `border-radius: 16px`, `padding: 20px`
- Active card: use `--sv-shadow-3` and a teal-tinted border
- Strategic card: use `--sv-gradient-strategic`

## Buttons

- Primary CTA: teal radial or directional gradient, white label, pill radius
- Secondary action: white surface, subtle border, dark text
- Press state: translate up by 1px at most

## Labels And Badges

- Small reference chips should use cyan tint backgrounds and teal text
- Keep uppercase metadata compact; do not overuse it in body content

## Metrics

- KPI value sizes should dominate the card
- Numeric data should use tabular figures
- Delta colors:
  - positive: `--sv-positive`
  - warning: `--sv-warning`
  - negative: `--sv-negative`

## Forms

- Inputs sit on `--sv-muted`
- Labels stay above fields
- Focus states use `--sv-cyan`

## Layout

- Prefer CSS Grid for major page sections
- Use asymmetric splits before equal-width dashboard columns
- Keep page containers capped at `1312px`

## Motion

- Use transform and opacity only
- Avoid bounce easings
- Danger states may pulse, but only when operationally meaningful
