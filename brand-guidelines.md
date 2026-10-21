# QSC Solutions Brand Guidelines

This document captures the verified QSC Solutions brand information available in this repository and the official company website reference recorded in project documentation.

## Verified company reference
- Company name: QSC Solutions
- Official website: https://qscsolutions.co.in
- Tagline: QUALITY SPEED CONSISTENCY
- Brand document in repository: `QSC_BRAND_GUIDELINES.md`

## Verified palette from repository guidelines
The repository's authoritative brand tokens define these approved QSC Solution colours:

- Bright Orange / Coral: #FF7A38
- Vibrant Pink / Magenta: #FF1E67
- Deep Violet / Dark Purple: #5B1865
- Dark Charcoal: #111111
- Pure Black: #000000
- Clean White: #FFFFFF

CSS token source:

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

## Typography and design system
The repository documents the brand as a modern corporate style with generous whitespace, clean typographic hierarchy, and rounded, premium shapes.

Recommended fonts for this project:
- "Segoe UI"
- "Inter"
- "Helvetica Neue"
- Arial
- sans-serif

The design system token file defines these corner radii and spacing conventions:

```css
--qsc-radius-sm: 10px;
--qsc-radius-md: 18px;
--qsc-radius-lg: 28px;

--qsc-space-1: 0.25rem;
--qsc-space-2: 0.5rem;
--qsc-space-3: 0.75rem;
--qsc-space-4: 1rem;
--qsc-space-6: 1.5rem;
--qsc-space-8: 2rem;
--qsc-space-12: 3rem;
```

## Logo and placement guidance
The repository states that the official QSC Solutions logo is the approved brand asset and must not be replaced with a generic approximation. The current repository includes a branding folder and brand-readme, but not a final logo file in the checked assets list. For that reason, the application uses a branded circular monogram and text wordmark in the interface while preserving the exact approved palette and hierarchy. If the official logo file is later added to `assets/branding/`, it should replace the provisional mark without changing the interface layout.

## Brand usage for this app
- Header brand treatment: QSC Solutions wordmark with a circular colour-mark emblem.
- Primary actions: orange-to-magenta-to-violet gradient.
- Surface backgrounds: clean white and warm off-white backgrounds.
- Border treatment: soft violet borders and subtle grey lines.
- Shadows: restrained, modern card shadows with low opacity.
- Layout pattern: clear top navigation, search-first workflow, modular profile cards, and concise form panels.
- Accessibility: maintain strong contrast, readable spacing, and clear focus states.

## Notes on website access
This project uses the official website reference recorded in the repository (`https://qscsolutions.co.in`) and the QSC Solutions design-token specifications. No live website inspection was claimed in this project, and no official logo asset was supplied in the repository at the time of implementation. The application therefore uses the verified palette and design system while identifying the logo area as a replaceable official asset when the final logo file is provided.
