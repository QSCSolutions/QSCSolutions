# QSC Solutions Brand Guidelines

This document is the authoritative brand reference for QSC Solutions work in this repository.

## 1. Company identity

- Company name: QSC Solutions
- Official website: https://qscsolutions.co.in
- Tagline: QUALITY SPEED CONSISTENCY
- Primary contact: Rohit Pethkar
- Professional email: rohit.pethkar@qscsolutions.co.in

These details are the source of truth for brand use in this repository. Do not invent or infer additional company, client, service, service-area, or certification details without explicit confirmation.

## 2. Official logo

The official QSC Solutions logo is the repository's approved brand asset. The logo includes:

- Wordmark: “QSC Solutions” in black
- Distinctive circular dotted symbol
- Orange/coral, pink/magenta, and deep violet/purple dots
- Tagline: “QUALITY SPEED CONSISTENCY”

Rules:

- Preserve the original logo proportions, colours, typography, and tagline exactly.
- Never stretch, distort, crop, redraw, or replace it with a text-only approximation.
- Use the original logo asset whenever it is available.
- If the official logo asset is missing from the repository, ask the repository owner to provide it instead of creating a substitute.
- Keep the logo readable and avoid placing it on visually conflicting backgrounds.
- Do not misspell the tagline as “QUALITY SPEED CONSISTENT.”
- Apply the logo only in suitable contexts and preserve its clear legibility.

Official assets should live in a dedicated folder such as `assets/branding/`. Do not overwrite an existing approved asset without review.

## 3. Brand colour palette

Use these exact HEX values as the only approved QSC Solutions brand colours.

| Colour name | HEX | Intended use |
|---|---|---|
| Bright Orange / Coral | #FF7A38 | Highlights, calls to action, accent shapes |
| Vibrant Pink / Magenta | #FF1E67 | Emphasis, gradients, decorative accents |
| Deep Violet / Dark Purple | #5B1865 | Brand depth, headings, gradient endpoints |
| Dark Charcoal | #111111 | Primary text and strong contrast |
| Pure Black | #000000 | Official wordmark and selected text |
| Clean White | #FFFFFF | Backgrounds, whitespace, contrast |

CSS variable source of truth:

```css
:root {
  --qsc-orange: #FF7A38;
  --qsc-magenta: #FF1E67;
  --qsc-violet: #5B1865;
  --qsc-charcoal: #111111;
  --qsc-black: #000000;
  --qsc-white: #FFFFFF;
}
```

Do not silently change the values or substitute visually similar colours. Use tokens rather than hardcoded values when building code-based assets.

## 4. Visual design language

QSC Solutions uses a modern, bright, premium corporate visual style.

Preferred characteristics:

- Clean white or light-coloured backgrounds
- Generous whitespace
- Clear typographic hierarchy
- Rounded flowing ribbons and curved colour bands
- Elegant orange, pink, and violet gradients
- Dotted circular patterns inspired by the official logo
- Minimal, modern icons
- Subtle geometric patterns
- High-quality realistic corporate photography
- Well-balanced layouts with strong readability
- Professional and approachable presentation

Preferred gradient direction, where appropriate:

```css
linear-gradient(120deg, #FF7A38 0%, #FF1E67 50%, #5B1865 100%)
```

This is a reusable design suggestion, not a requirement to apply the gradient everywhere.

Prefer bright, clean corporate environments over heavily dark or black-dominant interfaces unless a specific design requirement calls for it.

Avoid excessive decoration, generic templates, unrelated colour schemes, heavy shadows, crowded layouts, and inconsistent typography.

## 5. Design implementation rules

When creating or modifying any website, interface, HTML/CSS design, or branded digital asset:

1. Inspect the repository structure and reuse existing conventions.
2. Read this guideline before making design decisions.
3. Use the official design tokens.
4. Preserve existing functionality unless a user explicitly requests new behaviour.
5. Use reusable components and shared variables.
6. Maintain consistent typography, spacing, buttons, cards, borders, and backgrounds.
7. Ensure responsive behaviour across desktop, tablet, and mobile.
8. Maintain readable contrast and accessible interaction states.
9. Use the official logo asset, not a recreation.
10. Validate that important text, brand elements, and layouts remain visible and unclipped.

For social media creatives, keep the format platform-appropriate. For LinkedIn covers, account for profile photo overlap and keep critical text in a safe area.

Do not assume every deliverable needs the same layout. Maintain the brand identity while adapting the composition to the task.

## 6. Marketing and content context

QSC Solutions creates professional business communications, recruitment campaigns, corporate greetings, branded digital content, and technology education materials.

One established educational initiative is Tech Made Simple, which explains technology concepts such as data centres, cloud computing, IT infrastructure, backup, and disaster recovery for non-technical audiences.

For this initiative, use:

- Clear and accessible explanations
- Bright, clean technology visuals
- Consistent QSC branding
- Concise on-screen text
- Professional and approachable presentation

These are known contexts, not a guaranteed exhaustive list of all company services.

## 7. AI-generated brand ambassador

If the repository contains an approved QSC Solutions fictional AI brand ambassador reference image, use it as the visual reference for related creatives.

Preserve the established character’s identity as closely as the available tools allow. Change only the requested outfit, pose, setting, or campaign elements.

Do not invent or substitute a different approved avatar when no reference asset exists. Request the approved reference when needed.

## 8. Accessibility and responsive requirements

- Maintain sufficient contrast between text and backgrounds.
- Keep interactive states obvious and accessible.
- Prefer readable type sizes and clear hierarchy.
- Design for desktop, tablet, and mobile layouts.
- Do not allow critical text or logo elements to be cropped or hidden.
- Keep decorative patterns subtle so they support rather than overpower content.

## 9. Appropriate and inappropriate usage

Appropriate usage:

- Clean white or light backgrounds with QSC accent colours used sparingly and intentionally
- Strong headings, premium gradients, rounded shapes, and branded cards
- Corporate content using the exact palette and consistent type rhythm
- Clear QSC Solutions brand treatment in educational, communication, and campaign graphics

Inappropriate usage:

- Replacing the logo with a generic or text-only approximation
- Altering the official tagline spelling
- Using random or unrelated colour schemes
- Overusing dark backgrounds in places where a bright corporate palette is more appropriate
- Stretching or distorting the logo
- Creating inconsistent design tokens or repeating hardcoded colours instead of using the official palette

## 10. Source of truth

For all future QSC Solutions work in this repository:

- `QSC_BRAND_GUIDELINES.md` is the authoritative brand reference.
- `styles/qsc-design-tokens.css` is the authoritative token source for branded CSS values.
- `.github/copilot-instructions.md` is the repository-wide coding instruction file.

If instructions conflict, preserve the official logo and exact palette, follow the latest explicit user requirement, and request clarification when necessary.
