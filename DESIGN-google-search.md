---
version: alpha
name: Google-Search-design-analysis
description: A utility-first search experience built around extreme whitespace, a centered multicolor Google wordmark, and one dominant interaction surface: the rounded search field. The visual system is quieter than a typical product website. Most of the page is white canvas, dark neutral text, subtle grey borders, and compact Google-blue actions. Color is concentrated in the Google identity, account actions, active controls, and newer AI surfaces. Typography follows the Google Sans family for branded/product UI with Google Sans Text, Arial, and system sans-serif fallbacks for dense interface copy. The homepage is intentionally sparse; search-result pages shift to information density while preserving the same rounded controls, restrained elevation, and neutral surfaces.

colors:
  google-blue: "#4285f4"
  google-red: "#ea4335"
  google-yellow: "#fbbc04"
  google-green: "#34a853"
  action-blue: "#0b57d0"
  action-blue-hover: "#0842a0"
  action-blue-soft: "#e8f0fe"
  link-blue: "#1a0dab"
  link-visited: "#681da8"
  ink: "#202124"
  body: "#3c4043"
  muted: "#5f6368"
  muted-soft: "#70757a"
  hairline: "#dfe1e5"
  hairline-soft: "#dadce0"
  border-strong: "#bdc1c6"
  canvas: "#ffffff"
  surface-soft: "#f8f9fa"
  surface-hover: "#f1f3f4"
  footer: "#f2f2f2"
  on-action: "#ffffff"
  error: "#d93025"
  success: "#188038"
  scrim: "#000000"
  dark-canvas: "#202124"
  dark-surface: "#303134"
  dark-surface-hover: "#3c4043"
  dark-text: "#e8eaed"
  dark-muted: "#bdc1c6"
  dark-border: "#5f6368"

typography:
  display-logo-context:
    fontFamily: "'Google Sans', 'Google Sans Flex', Arial, sans-serif"
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.2px
  display-lg:
    fontFamily: "'Google Sans', 'Google Sans Flex', Arial, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: 0
  display-md:
    fontFamily: "'Google Sans', 'Google Sans Flex', Arial, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  title-lg:
    fontFamily: "'Google Sans', 'Google Sans Text', Arial, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  title-md:
    fontFamily: "'Google Sans Text', 'Google Sans', Arial, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  result-title:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  body-lg:
    fontFamily: "'Google Sans Text', Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  body-sm:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.38
    letterSpacing: 0
  caption:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  button-md:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0
  button-account:
    fontFamily: "'Google Sans Text', Arial, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0.1px
  nav-link:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.54
    letterSpacing: 0
  filter-label:
    fontFamily: "'Google Sans Text', Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  result-url:
    fontFamily: "Arial, 'Google Sans Text', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  search: 24px
  xl: 28px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  hero: 80px

components:
  google-wordmark:
    backgroundColor: transparent
    heightDesktop: 92px
    heightMobile: 56px
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 60px
    padding: 6px 16px
  nav-text-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
  apps-button:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    height: 40px
    width: 40px
  account-button:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.on-action}"
    typography: "{typography.button-account}"
    rounded: "{rounded.sm}"
    padding: 9px 23px
    height: 40px
  search-field-home:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.search}"
    height: 46px
    maxWidth: 584px
    padding: 5px 14px
  search-field-results:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    borderColor: transparent
    rounded: "{rounded.search}"
    height: 46px
    maxWidth: 690px
    padding: 5px 14px
  search-icon:
    textColor: "{colors.muted}"
    size: 20px
  voice-button:
    backgroundColor: transparent
    textColor: "{colors.google-blue}"
    rounded: "{rounded.full}"
    height: 40px
    width: 40px
  lens-button:
    backgroundColor: transparent
    textColor: "{colors.google-blue}"
    rounded: "{rounded.full}"
    height: 40px
    width: 40px
  search-submit-button:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 0 16px
    height: 36px
  lucky-button:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.button-md}"
    rounded: "{rounded.xs}"
    padding: 0 16px
    height: 36px
  quick-action-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 14px
    minHeight: 36px
  ai-mode-chip:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 14px
    minHeight: 36px
  language-link:
    backgroundColor: transparent
    textColor: "{colors.link-blue}"
    typography: "{typography.body-sm}"
  homepage-footer:
    backgroundColor: "{colors.footer}"
    textColor: "{colors.muted-soft}"
    typography: "{typography.body-md}"
  footer-country-row:
    backgroundColor: "{colors.footer}"
    textColor: "{colors.muted-soft}"
    typography: "{typography.body-md}"
    height: 48px
  footer-links-row:
    backgroundColor: "{colors.footer}"
    textColor: "{colors.muted-soft}"
    typography: "{typography.body-md}"
    minHeight: 48px
  results-header:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    minHeight: 64px
  results-filter-strip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.muted}"
    typography: "{typography.filter-label}"
    minHeight: 48px
  filter-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline-soft}"
    typography: "{typography.filter-label}"
    rounded: "{rounded.full}"
    padding: 8px 14px
  filter-chip-active:
    backgroundColor: "{colors.action-blue-soft}"
    textColor: "{colors.action-blue}"
    borderColor: transparent
    rounded: "{rounded.full}"
  result-block:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    maxWidth: 652px
  result-site-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  result-title-link:
    backgroundColor: transparent
    textColor: "{colors.link-blue}"
    typography: "{typography.result-title}"
  result-snippet:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
  ai-overview-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-soft}"
    rounded: "{rounded.lg}"
    padding: 20px
  expandable-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-soft}"
    rounded: "{rounded.md}"
    padding: 12px 16px
  knowledge-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-soft}"
    rounded: "{rounded.sm}"
    padding: 16px
  dark-search-field:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-text}"
    borderColor: "{colors.dark-border}"
    rounded: "{rounded.search}"
    height: 46px
---

## Overview

Google Search is a utility-first interface whose strongest visual decision is restraint. The homepage uses a mostly empty `{colors.canvas}` white field, a centered Google wordmark, and one dominant interactive surface: `{component.search-field-home}`. The interface avoids decorative containers, large editorial headlines, and persistent side navigation. The product is the search box.

The multicolor Google identity carries brand recognition, while the operational UI is almost entirely neutral. `{colors.ink}` and `{colors.body}` carry content, `{colors.hairline}` defines controls, `{colors.surface-soft}` supports secondary actions, and `{colors.action-blue}` is reserved for sign-in, active controls, and modern Google action states.

The live Google homepage in September 2026 also exposes AI-oriented entry points such as AI Mode and image-generation actions. These sit near the search interaction rather than replacing it, preserving search as the primary mental model.

The search-results experience changes the density dramatically. The same rounded search field moves into the top header, filters form a compact horizontal strip, and the main content column becomes a vertical rhythm of result blocks, answer modules, AI summaries, media, and knowledge surfaces.

### Key Characteristics

- Extreme whitespace on the homepage. The blank canvas is structural, not decorative.
- The Google logo is the primary brand moment. UI chrome stays neutral.
- One rounded search surface is the dominant control.
- Secondary buttons use near-white grey rather than brand blue.
- Google blue is concentrated in account actions, active states, selected filters, and selected links.
- Search-result links retain the familiar blue-link convention.
- The homepage is centered. Search results are left-biased inside a constrained reading column.
- Elevation is low. Search fields and menus gain shallow shadow on interaction, but most content stays flat.
- The system supports both light and dark themes.
- AI surfaces inherit the Search system instead of introducing a separate visual language.

## Colors

### Google Identity

- **Google Blue** (`{colors.google-blue}` — #4285f4): part of the multicolor Google wordmark and product identity.
- **Google Red** (`{colors.google-red}` — #ea4335): wordmark identity color.
- **Google Yellow** (`{colors.google-yellow}` — #fbbc04): wordmark identity color.
- **Google Green** (`{colors.google-green}` — #34a853): wordmark identity color.

These colors are brand-signature colors rather than general interface fills. The Search homepage does not distribute all four colors through buttons and cards.

### Action Blue

- **Action Blue** (`{colors.action-blue}` — #0b57d0): primary action color used by current Google product surfaces for account and active UI states.
- **Action Blue Hover** (`{colors.action-blue-hover}` — #0842a0): darker active/pressed interpretation.
- **Action Blue Soft** (`{colors.action-blue-soft}` — #e8f0fe): selected filter, highlighted control, or blue-tinted contextual surface.

### Search Links

- **Link Blue** (`{colors.link-blue}` — #1a0dab): classic organic-result title color in light mode.
- **Visited Link** (`{colors.link-visited}` — #681da8): visited search-result state.

The distinction between Google-brand blue and result-link blue matters. Search links are functional web-navigation signals, not brand buttons.

### Neutral Surfaces

- **Canvas** (`{colors.canvas}` — #ffffff): homepage and light-theme page floor.
- **Surface Soft** (`{colors.surface-soft}` — #f8f9fa): search buttons, quiet controls, secondary chip surfaces.
- **Surface Hover** (`{colors.surface-hover}` — #f1f3f4): hover/focus background for icon buttons and secondary controls.
- **Footer** (`{colors.footer}` — #f2f2f2): footer band separating legal/navigation utilities from the blank homepage body.

### Text

- **Ink** (`{colors.ink}` — #202124): primary text, input text, headings, and strong labels.
- **Body** (`{colors.body}` — #3c4043): secondary interface text and result snippets.
- **Muted** (`{colors.muted}` — #5f6368): icons, filter labels, metadata, and secondary copy.
- **Muted Soft** (`{colors.muted-soft}` — #70757a): footer links and tertiary metadata.

### Borders

- **Hairline** (`{colors.hairline}` — #dfe1e5): homepage search-field outline and light separators.
- **Hairline Soft** (`{colors.hairline-soft}` — #dadce0): control boundaries, menus, cards, and search-result module separators.
- **Border Strong** (`{colors.border-strong}` — #bdc1c6): stronger neutral boundary for disabled or emphasized controls.

### Semantic

- **Error** (`{colors.error}` — #d93025): validation and account/form error messaging across Google UI.
- **Success** (`{colors.success}` — #188038): positive and completed states.

### Dark Theme

- **Dark Canvas** (`{colors.dark-canvas}` — #202124): principal dark Search background.
- **Dark Surface** (`{colors.dark-surface}` — #303134): dark search field and raised neutral surfaces.
- **Dark Surface Hover** (`{colors.dark-surface-hover}` — #3c4043): hover/active neutral surface.
- **Dark Text** (`{colors.dark-text}` — #e8eaed): primary dark-mode text.
- **Dark Muted** (`{colors.dark-muted}` — #bdc1c6): secondary dark-mode copy.
- **Dark Border** (`{colors.dark-border}` — #5f6368): dark-mode outline and separator.

## Typography

### Font Family

Google’s current type system centers on the Google Sans family. Google Design states that Google Sans is used across Google products, including Search, while Google Sans Text was developed to improve smaller interface text and readability.

For reconstruction work, use:

`'Google Sans', 'Google Sans Flex', 'Google Sans Text', Arial, sans-serif`

For dense legacy Search-result text, Arial remains a useful fallback because historical Search UI has relied heavily on Arial-like metrics.

### Hierarchy

| Token | Size | Weight | Line Height | Typical Use |
|---|---:|---:|---:|---|
| `{typography.display-logo-context}` | 32px | 400 | 1.25 | Branded contextual headings near Google identity |
| `{typography.display-lg}` | 28px | 400 | 1.29 | AI / answer-module headings |
| `{typography.display-md}` | 24px | 400 | 1.33 | Major result-module headings |
| `{typography.title-lg}` | 20px | 500 | 1.4 | Card and module headings |
| `{typography.title-md}` | 18px | 400 | 1.33 | Secondary module titles |
| `{typography.result-title}` | 20px | 400 | 1.3 | Organic result title links |
| `{typography.body-lg}` | 16px | 400 | 1.5 | Search input and prominent body copy |
| `{typography.body-md}` | 14px | 400 | 1.43 | Result snippets and default UI copy |
| `{typography.body-sm}` | 13px | 400 | 1.38 | URL/site rows and metadata |
| `{typography.caption}` | 12px | 400 | 1.33 | Fine metadata |
| `{typography.button-md}` | 14px | 500 | 1.43 | Search buttons and chips |
| `{typography.button-account}` | 14px | 500 | 1.43 | Sign-in/account CTA |
| `{typography.nav-link}` | 13px | 400 | 1.54 | Homepage top navigation |
| `{typography.filter-label}` | 14px | 400 | 1.43 | Search result tabs and filters |

### Principles

Google Search does not build hierarchy through heavy typography. Weight stays restrained. Scale changes are moderate. The Google logo, whitespace, result ordering, and module grouping carry most of the hierarchy.

Result titles need enough size to scan quickly but avoid headline-style display treatment. Supporting text remains compact because Search is a reading and comparison interface.

### Font Notes

Google Sans Flex is now part of Google’s modern type direction and offers variable axes for weight, width, optical size, slant, grade, and roundness. For a practical Search recreation, Google Sans Text is the closest fit for UI labels and Google Sans for larger product headings.

## Shape Language

Google Search uses circles and pills for high-frequency controls, but keeps ordinary buttons slightly rounded rather than fully pill-shaped.

- Search bar: `{rounded.search}` 24px.
- Icon controls: `{rounded.full}`.
- Filter chips: `{rounded.full}`.
- Account button: `{rounded.sm}` 8px.
- Search buttons: `{rounded.xs}` 4px.
- Information cards: 8–18px depending on emphasis.

This creates a clear distinction between input/navigation controls and content modules.

## Layout

### Homepage Structure

The desktop homepage is vertically simple:

1. Top utility navigation.
2. Flexible blank space.
3. Google wordmark.
4. Search field.
5. Search actions and current quick actions.
6. Language line when present.
7. Flexible blank space.
8. Footer fixed to the lower page flow.

The search interaction is centered horizontally. `{component.search-field-home}` caps near 584px on desktop, wide enough for natural-language queries but narrow enough to remain visually dominant.

### Top Navigation

`{component.top-nav}` is approximately 60px tall. Left-side links are lightweight. Right-side utilities carry stronger interaction weight through the Google apps grid and account/sign-in control.

The top bar has no persistent bottom divider on the classic homepage. It appears to float on the white page because the same surface continues beneath it.

### Search Results Layout

Search results move away from central symmetry. The page becomes a constrained reading layout with the main result column left of center.

Typical desktop geometry:

- Search/header field: up to ~690px.
- Primary result column: ~600–652px.
- Main content start: offset from the left viewport edge rather than centered in the full page.
- Optional secondary knowledge column appears on wide screens.

This keeps line length short enough for scanning snippets while leaving room for side modules.

### Spacing System

The system works well with a 4px base and 8px primary rhythm.

- `{spacing.xs}` 4px: icon/text micro gaps.
- `{spacing.sm}` 8px: compact control spacing.
- `{spacing.md}` 12px: chip and metadata spacing.
- `{spacing.base}` 16px: standard content gutters.
- `{spacing.lg}` 24px: module gaps.
- `{spacing.xl}` 32px: larger result groups.
- `{spacing.xxl}` 48px: footer and major homepage separation.
- `{spacing.hero}` 80px: large flexible homepage breathing zone.

### Whitespace Philosophy

On the homepage, whitespace communicates focus. The lack of cards and marketing sections removes competition around the search field.

On result pages, whitespace switches role. It separates answers and result groups rather than dominating the page. The product becomes denser without becoming visually boxed-in.

## Elevation

Google Search uses low elevation.

### Flat Baseline

Most homepage and result content has no shadow. Footer, result blocks, tabs, and body regions remain flat.

### Search Field Hover / Focus

The homepage search field typically shifts from a simple border to a shallow floating state on hover or focus. A close reconstruction is:

`box-shadow: 0 1px 6px rgba(32,33,36,0.28)`

The border becomes visually less important once the shadow appears.

### Menus and Popovers

Google apps menus, suggestion panels, account menus, and modal surfaces use stronger but still soft elevation. Use a neutral shadow rather than a colored glow.

### Scrim

Use `{colors.scrim}` with variable opacity for modal backdrops. Search itself rarely blocks the full page with scrim outside account, settings, consent, or specialized overlays.

## Components

### Google Wordmark

`{component.google-wordmark}` is the homepage anchor. The logo should remain an image/SVG asset rather than reconstructed from ordinary text. The multi-color sequence is part of the identity.

Desktop wordmark height is around 92px in the classic homepage composition. Mobile uses a smaller mark near 56px.

### Top Navigation

`{component.top-nav}` is a white, borderless utility row.

Left side commonly includes lightweight text navigation. Right side groups product utilities, apps, and account access.

`{component.nav-text-link}` uses small dark text and underline on hover rather than a button surface.

### Google Apps Button

`{component.apps-button}` is a circular 40×40px hit area containing the 3×3 apps grid icon. The icon is visually smaller than the hit target.

Hover adds a neutral circular background using `{colors.surface-hover}`.

### Account Button

`{component.account-button}` is the strongest filled control on the homepage. Blue fill, white label, 8px radius, approximately 40px height.

Logged-in states often replace the text button with a circular profile avatar.

### Homepage Search Field

`{component.search-field-home}` is the signature component.

Structure:

- Left search icon.
- Flexible text input.
- Optional voice search icon.
- Google Lens icon.
- Rounded 24px outline.
- 46px total height.
- Max width around 584px desktop.

The field sits on white and starts with a 1px `{colors.hairline}` border. Hover/focus adds the shallow Search shadow.

### Search Suggestions

When autocomplete opens, the search field visually merges into a suggestion panel beneath it. The upper corners stay rounded, while the dropdown shares the same white surface and shadow.

Suggestion rows are compact, icon-led, and use dark text with muted supporting metadata where applicable.

### Search Action Buttons

`{component.search-submit-button}` and `{component.lucky-button}` use near-white grey surfaces, dark text, small 4px radii, and 36px heights.

They intentionally avoid Google blue. This keeps the query field more prominent than the submit action.

### AI / Quick Action Chips

The 2026 homepage can surface modern entry points such as AI Mode and image-related actions around the main search experience.

`{component.quick-action-chip}` and `{component.ai-mode-chip}` use pill geometry with quiet neutral fills. Brand/AI iconography supplies the stronger visual signal.

These controls should remain secondary to the search field.

### Language Link

`{component.language-link}` uses conventional blue link styling. The line is small and quiet, often placed below search actions.

### Homepage Footer

`{component.homepage-footer}` uses a light grey background distinct from the white content canvas.

The footer generally has two conceptual rows:

- Country/location row.
- Utility/legal/business links row.

`{component.footer-country-row}` and `{component.footer-links-row}` are separated by a light divider.

Footer links use `{colors.muted-soft}` rather than primary ink.

## Search Results Components

### Results Header

`{component.results-header}` moves the brand and search interaction into a compact top region.

The Google mark becomes smaller and left-aligned. `{component.search-field-results}` stays pill-shaped but gets a broader max width than the homepage field.

The header favors horizontal efficiency over homepage symmetry.

### Results Search Field

`{component.search-field-results}` keeps the same 46px physical height and 24px rounding. It often appears with an always-on shallow shadow or stronger surface separation than the homepage field.

Voice and Lens actions stay on the right edge.

### Filter Strip

`{component.results-filter-strip}` holds dynamically ordered search categories and tools. Google’s own help notes that filter types and ordering depend on the query.

Examples include Web, Images, Maps, News, Shopping, Videos, Short videos, Forums, and Books.

Use `{component.filter-chip}` for bordered rounded refinements and `{component.filter-chip-active}` for selected/highlighted refinements where the interface uses chips.

### Organic Result Block

`{component.result-block}` is not a conventional card. It is a vertical text group on the page canvas.

Typical structure:

1. Site identity row.
2. Result title link.
3. Snippet text.
4. Optional sitelinks, media, structured metadata, or secondary actions.

The lack of a container border keeps the result list visually continuous.

### Site Identity Row

`{component.result-site-row}` combines favicon, site name, and URL/breadcrumb data in small text.

The favicon sits in a small circular or square frame depending on source asset.

### Result Title Link

`{component.result-title-link}` uses the classic blue result-link convention and regular weight around 20px.

Hover underlines the title. Visited state can move to `{colors.link-visited}`.

### Result Snippet

`{component.result-snippet}` uses 14px dark-grey copy with comfortable line-height. Snippets should wrap to a readable width, not stretch across the viewport.

### AI Overview

`{component.ai-overview-card}` represents the newer generative answer surface in Search.

The structure commonly combines:

- AI label or icon treatment.
- Generated answer body.
- Source links/citations.
- Expand/collapse behavior.
- Follow-up interactions.

Keep the surface visually integrated with Search. Use white or theme-matched backgrounds, restrained borders, rounded corners, and Google Sans-family headings.

### Expandable Question Card

`{component.expandable-card}` fits People Also Ask and similar accordion modules.

Rows rely on separators, compact typography, and a chevron icon. Avoid heavy shadows.

### Knowledge Panel

`{component.knowledge-panel}` occupies a secondary column on wider desktop layouts when entity information is available.

The panel uses small grouped cards, imagery, factual rows, and source links. It does not compete with the main result column through saturated backgrounds.

## Interaction States

### Search Field Default

- White background.
- 1px `{colors.hairline}` outline.
- Search icon in `{colors.muted}`.
- Input text in `{colors.ink}`.

### Search Field Hover

- Border visually softens.
- Shallow neutral shadow appears.
- No scale transform.

### Search Field Focus

- Same elevated shell as hover.
- Cursor and typed text remain dark.
- Autocomplete panel can attach below.

### Secondary Button Hover

- Slightly stronger neutral border and/or `{colors.surface-hover}` fill.
- No large movement.

### Icon Button Hover

- Circular `{colors.surface-hover}` background.

### Link Hover

- Underline for text navigation and search titles where appropriate.

## Dark Mode

Google Search supports a dark theme in Search settings.

### Dark Homepage

- Canvas becomes `{colors.dark-canvas}`.
- Search field becomes `{colors.dark-surface}`.
- Main text becomes `{colors.dark-text}`.
- Muted text becomes `{colors.dark-muted}`.
- Borders move to `{colors.dark-border}`.
- Google logo remains full color.

### Dark Result Pages

Result hierarchy stays unchanged. Link colors shift brighter for contrast. Cards and answer modules use dark surfaces rather than pure black.

Do not invert the Google logo colors.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Small Mobile | < 480px | Smaller wordmark, search field nearly full-width, compact top utilities, search buttons may reduce prominence, results become one full-width column. |
| Mobile | 480–767px | Search field uses 16px side gutters, Lens/voice remain accessible, result modules stack, knowledge panels collapse into inline modules. |
| Tablet | 768–1023px | Homepage remains centered, search width stays capped, result content widens while side knowledge content becomes conditional. |
| Desktop | 1024–1439px | Full homepage geometry, ~584px search field, desktop footer rows, results column with optional right-side modules. |
| Wide | >= 1440px | Search results keep constrained reading width; additional viewport width becomes whitespace or secondary knowledge/module space. |

### Touch Targets

- Apps button: 40×40px.
- Voice/Lens controls: target around 40×40px.
- Account button: ~40px tall.
- Mobile interactive controls should preserve at least ~44px practical hit areas even when the visible icon is smaller.

### Collapsing Strategy

The homepage does not need a heavy breakpoint strategy because the composition is already narrow and centered.

On smaller screens:

- Search width becomes `calc(100% - 32px)`.
- Logo scales down.
- Top navigation removes or compresses lower-priority text links.
- Footer links wrap across multiple lines.
- Search-result side panels move inline.
- Filter strips become horizontally scrollable.

## Accessibility

### Contrast

Primary text uses `{colors.ink}` on white, giving strong contrast. Muted greys are reserved for secondary information.

### Focus

Keyboard focus should remain visible on links, buttons, chips, search fields, and account controls. Do not rely on hover alone.

### Labels

Voice Search, Lens, Apps, Settings, and account actions require accessible names independent of icon recognition.

### Motion

Search interactions need minimal motion. Prefer opacity, surface, and short positional transitions over decorative animation.

## Implementation Notes

### Recommended CSS Stack

Use the Google Sans family when licensed/available for the intended environment. Otherwise use Arial or a neutral system sans-serif for Search-like metrics.

Suggested stack:

`font-family: 'Google Sans Text', 'Google Sans', Arial, sans-serif;`

For organic result text where metric similarity matters:

`font-family: Arial, 'Google Sans Text', sans-serif;`

### Search Field Shadow

Recommended recreation:

`box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);`

Use it on hover/focus for the homepage field and as a subtle persistent elevation on results if needed.

### Width Tokens

Suggested implementation constants:

- Homepage search max-width: `584px`.
- Results search max-width: `690px`.
- Result text column: `600px–652px`.
- Homepage outer horizontal padding: `16px` mobile, `24px` desktop.

### Iconography

Use Google Material Symbols or equivalent simple outlined icons. Keep default icon sizes around 18–24px inside larger hit targets.

### Logo Handling

Use an approved Google logo asset. Do not reconstruct the Google wordmark from Google Sans text. The logotype is a distinct brand asset.

## Source Basis

This file is modeled after the supplied Airbnb DESIGN.md structure and depth.

Public references checked for the Google analysis:

- Current Google Search homepage, Italian locale, checked 2026-09-25.
- Google Search Help documentation for dynamic result filters.
- Google Search Help documentation for AI Overview and AI Mode-related Search surfaces.
- Google Design documentation on Google Sans, Google Sans Text, and Google Sans Flex.
- Google Design documentation on the Google identity system and multicolor logotype.
- Google Brand Resource Center product guidance.

## Known Gaps

- Google Search is personalized by locale, account state, experiments, query, device, and rollout cohort. A single homepage capture is not a complete representation of every live variation.
- Doodles temporarily replace or modify the standard wordmark and are not modeled as a fixed design token.
- Exact AI Mode gradients, sparkle icon treatments, and generative-animation states can change independently from the core Search design system.
- Search-result modules are query-dependent. Shopping, local, sports, finance, travel, video, image, and knowledge modules each add specialized component systems not fully enumerated here.
- Exact hover and focus shadow values can vary across current experiments. The shadow token in this file is a close reconstruction of the long-running Google Search field treatment.
- Organic result typography has changed incrementally across Search generations and locales. The file intentionally preserves Arial-compatible metrics where exact Google Sans deployment is uncertain.
- Consent banners and regional privacy surfaces are excluded because they vary by jurisdiction.
- Logged-in personalization and signed-out Search differ in top-nav and homepage recommendations.
- Google brand assets have usage restrictions. This document describes the visual system; it does not grant trademark or logo-use rights.
