# Widget QA — 25 September 2026

Validated the current local implementation using headless Chrome against the development server with intercepted, deterministic Places responses. Live Google search was not exercised by this visual audit.

- 75 combinations: all five formats, Signature / Editorial / Contrast, viewport widths 320 / 390 / 760 / 1024 / 1440 px.
- Screenshots captured for each combination; representative desktop and mobile screenshots visually inspected.
- No horizontal widget overflow detected in the 75 combinations.
- Photos and Local Guide filtering checked on both carousel and grid; only explicit Local Guide metadata qualifies.
- Empty review sets, empty filter results, missing metadata, long author/business names, English translation preference and review expansion checked at 320 and 1440 px.
- Mobile filter buttons use 44 px targets; keyboard focus and reduced-motion styles provided.
- Build, TypeScript and widget component lint pass.
- Existing test suite: 7 pass, 1 fails because the landing-page test still expects the previous offer copy “12 months of automatic Google review syncing”. This assertion concerns the existing landing page, outside the widget changes.

Implementation notes: widget interface copy is English. Review content prefers Google's localized `text` response, with original text only as a fallback when no localized text is supplied. Rating distributions and Local Guide status are no longer inferred. Cards fit their container rather than assuming the viewport width is the available widget width.

## Shared marketing examples

The hero example, the before/after comparison and the builder now import the same `ReviewWidget` component and `samplePlace` fixture, with carousel format and Signature styling. Removed the separate marketing card renderer and preview-specific scaling/typography. The comparison mock business now matches the shared dental fixture.

Checked all three locations at 320, 390, 760, 1024 and 1440 px. After equalizing the host width and allowing transitions to settle, both examples have identical normalized DOM and zero differences across the measured presentation properties (font, spacing, dimensions, colors, layout and alignment) compared with the builder. Carousel navigation and photo filters work independently in each instance. Natural-size screenshots checked; mobile wrappers reserve room for the card-edge arrows. Build, TypeScript and the shared component/wizard lint pass. Existing lint findings in the landing page and search builder remain outside this extraction.

The shared mobile widget was compacted to roughly 476 px tall at 320/390 px. The desktop hero-only instance is scaled independently and the first fold measures exactly one viewport at 1024×768, 1440×760 and 1440×900. Both examples are visibly labelled “Fictional demo data”, use the static fictional fixture, and link only to the generic Google Maps homepage. Carousel and grid footers now contain only “Powered by Google” on both desktop and mobile.
