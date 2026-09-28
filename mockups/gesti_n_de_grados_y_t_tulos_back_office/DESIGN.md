---
name: Gestión de Grados y Títulos Back-Office
colors:
  surface: '#fff8f7'
  surface-dim: '#f1d3d7'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f1'
  surface-container: '#ffe9eb'
  surface-container-high: '#ffe1e5'
  surface-container-highest: '#fadbdf'
  on-surface: '#27171a'
  on-surface-variant: '#554244'
  inverse-surface: '#3e2b2f'
  inverse-on-surface: '#ffecee'
  outline: '#887273'
  outline-variant: '#dbc0c2'
  surface-tint: '#9c3f50'
  primary: '#4f0319'
  on-primary: '#ffffff'
  primary-container: '#6d1b2d'
  on-primary-container: '#f28393'
  inverse-primary: '#ffb2bb'
  secondary: '#675b5e'
  on-secondary: '#ffffff'
  secondary-container: '#efdee1'
  on-secondary-container: '#6e6164'
  tertiary: '#4a0c19'
  on-tertiary: '#ffffff'
  tertiary-container: '#67222d'
  on-tertiary-container: '#e88993'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#ffb2bb'
  on-primary-fixed: '#400011'
  on-primary-fixed-variant: '#7e2839'
  secondary-fixed: '#efdee1'
  secondary-fixed-dim: '#d3c3c6'
  on-secondary-fixed: '#22191c'
  on-secondary-fixed-variant: '#4f4447'
  tertiary-fixed: '#ffdadc'
  tertiary-fixed-dim: '#ffb2b9'
  on-tertiary-fixed: '#3e0310'
  on-tertiary-fixed-variant: '#772e39'
  background: '#fff8f7'
  on-background: '#27171a'
  surface-variant: '#fadbdf'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  caption-medium:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
---

## Brand & Style

This design system targets institutional administrative officers, registrars, faculty deans, and academic compliance auditors handling critical degree issuance and title certification workflows. The operational context requires an environment of high authority, calm precision, meticulous tracking, and procedural certainty. 

The aesthetic is **Corporate / Modern Editorial**:
- Rigorous tabular structures paired with disciplined academic cues.
- Deep burgundy conveys university heritage, stability, and executive finality, while maintaining high functional clarity for high-density administrative operations.
- Clean separations, zero visual clutter, and strict containment prevent clerical cognitive fatigue during repetitive audits and diploma validation tasks.

## Colors

The system establishes an unambiguous distinction between institutional identity and operational semantics:

- **Primary Identity (`#6D1B2D`)**: Reserved for persistent global navigation (sidebar header/surface accents), authoritative call-to-actions (e.g., "Aprobar Expediente", "Emitir Resolución"), and selected system states.
- **Primary Hover (`#551420`)**: Deepened wine state for interactive clickables.
- **Soft Tint Surface (`#F4E3E6`)**: Subtle warm tint for active sidebar elements, row selection states, and secondary visual focus.
- **Neutral Core**:
  - Main Canvas / Cards: `#FFFFFF`
  - Subtle Layout Background: `#FAFAFA` with warm undertone `#FDFBFB`
  - Structural Borders: `#E9DEE0` (a desaturated grey infused with warm wine tone)
  - Text Primary: `#241417` (maximum legibility near-black with balanced contrast)
  - Text Secondary: `#665659` (calm metadata, breadcrumbs, labels)

### Status Semantics
Semantics are isolated exclusively to audit outcomes, deadline alerts, verification states, and document progress. They are strictly prohibited from being used as decorative or brand accents:
- **Success (`#166534` on `#DCFCE7`)**: Validated requirements, verified degrees, approved dossiers.
- **Warning (`#B45309` on `#FEF3C7`)**: Expiring documentation, missing advisor signatures, pending review periods.
- **Danger (`#C0392B` on `#FEE2E2`)**: Rejected graduation packets, plagiarism breaches, revoked certifications. Visually distinct from `#6D1B2D` brand wine by leaning toward vivid tomato-red.
- **Info (`#1D4ED8` on `#DBEAFE`)**: Ongoing external registrar synchronization (SUNEDU/Ministry), formal notices.

## Typography

Typography is set entirely in **Inter** to ensure dense tabular alignment, strict baseline calibration, and dependable clarity for legal and identification strings (such as national identity documents, university codes, and act numbers).

- **H1 / Headline Large (24px, Semi-Bold)**: Main workspace headers, executive report dashboards, and screen titles.
- **H2 / Headline Medium (18px, Semi-Bold)**: Section cards, modal headers, slide-over titles, and major table groupings.
- **Body Regular & Medium (14px)**: Primary operational level for data rows, form fields, tab headers, and contextual metadata.
- **Caption & Small Labels (12px / 11px)**: Micro-data, timestamp audits, table footers, column sub-sorts, and uppercase section trackers.

## Layout & Spacing

The administrative layout uses a fixed lateral structure anchored by a 240px persistent navigation panel, coupled with a fluid workspace area that scales across desktop resolutions (1280px, 1440px, 1920px).

- **Spacing Rhythm**: Governed by an exact 4px unit increment scale:
  - `4px` (`space-xs`): Micro badge padding, inline icon-to-text separation.
  - `8px` (`space-sm`): Input group vertical gaps, tight button padding, stack spacing.
  - `12px`: Standard table cell vertical density, filter stack margins.
  - `16px` (`space-md`): Standard component interior padding (cards, form columns).
  - `20px` (`space-lg`): Section breaks within drawers and complex form fieldsets.
  - `24px` (`space-xl` / `margin`): Workspace edge offsets, container outer gutters.
  - `32px`: High-level division between summary analytical indicators and operative data tables.

- **Breakpoints**:
  - **Desktop Core (≥1280px)**: 240px static sidebar, fluid body content with 24px outer margin.
  - **Compact Desktop / Tablet (1024px – 1279px)**: 240px sidebar transforms into an overlay drawer; body retains 16px outer margin.

## Elevation & Depth

Visual hierarchy prioritizes surface boundaries via **subtle borders (`#E9DEE0`)** over high-cast shadows, reducing screen glare in prolonged daylight usage:

- **Surface Layer 0 (Canvas Base)**: `#FAFAFA` / `#FDFBFB` backdrop supporting administrative layout structures.
- **Surface Layer 1 (Cards, Panel Blocks, Tables)**: Pure `#FFFFFF` resting directly on the canvas, bounded by a 1px solid `#E9DEE0` border. Zero elevation cast.
- **Surface Layer 2 (Sticky Headers, Popovers, Dropdowns)**: `#FFFFFF` bounded by `#E9DEE0` with an ambient shadow: `0 4px 12px -2px rgba(36, 20, 23, 0.06), 0 2px 6px -1px rgba(36, 20, 23, 0.04)`.
- **Surface Layer 3 (Drawers & Modals)**: Fixed 480px slide-over panels and centered dialogs; elevation: `0 12px 32px -4px rgba(36, 20, 23, 0.12), 0 4px 12px -2px rgba(36, 20, 23, 0.08)`. Accompanied by a semi-transparent backdrop overlay: `rgba(36, 20, 23, 0.40)`.

## Shapes

The geometric architecture pairs precise administrative utility with calibrated comfort:

- **8px (`rounded-md` / Base Component Radius)**: The foundational curvature used across content cards, data table wrappers, active search bars, form text inputs, and filter container panels.
- **12px (`rounded-lg` / Dialog Radius)**: Reserved for high-elevation floating structures including centered confirmation modals and interactive 480px slide-out drawers.
- **4px (`rounded-sm` / Micro Radius)**: Applied to status tags, system tags, and micro badges to maintain sharp legibility without rounding off text bounds.
- **Pill Shape (`rounded-full`)**: Exclusively reserved for status indicators (e.g., "Sustentado", "En Trámite"), filter toggle chips, and numeric badge counters.

## Components

### Global Navigation Sidebar
- **Geometry**: Fixed 240px width, full viewport height.
- **Styling**: `#6D1B2D` background with subtle contrast borders (`rgba(255, 255, 255, 0.12)`).
- **Header**: University crest and system lockup ("Gestión de Grados y Títulos") rendered in `#FFFFFF`.
- **Items (5 Main Modules)**: `Inicio`, `Expedientes`, `Docentes`, `Reportes`, `Administración`.
  - Inactive: `#F4E3E6` text with 75% opacity, matching icon tone.
  - Active: `#FFFFFF` font weight 500, `#551420` surface background with a 3px solid `#FFFFFF` active indicator on the left border.

### Buttons & Interactive Controls
- **Primary Action**: Solid `#6D1B2D` fill, `#FFFFFF` label, 8px radius. Hover: `#551420`. Active: `#3F0E17`. Focus ring: 2px solid `#6D1B2D` with 2px offset.
- **Secondary Action**: Solid `#FFFFFF` fill, 1px border `#E9DEE0`, `#241417` text. Hover: `#FDFBFB` fill with `#6D1B2D` text/border accent.
- **Tertiary / Ghost**: Transparent fill, `#665659` text. Hover: `#F4E3E6` soft background tint, `#6D1B2D` text.

### Data Tables
- **Container**: 8px rounded corners, 1px solid `#E9DEE0` border, overflow hidden.
- **Header (`<thead>`)**: Background `#FDFBFB`, 12px height padding, `#665659` uppercase 11px semi-bold font with integrated sort arrows. Sticky positioning on scroll.
- **Rows (`<tr>`)**: Pure `#FFFFFF` background, 1px horizontal dividers `#E9DEE0`. Hover state triggers `#FAFAFA`. Selected row triggers `#F4E3E6` at 35% opacity.
- **Cell Content**: 14px typography with numeric tabular figures (`font-variant-numeric: tabular-nums`).
- **Pagination Footer**: Dedicated bar with current page state, record range display (e.g., "1–25 de 1,420 expedientes"), and segmented page buttons.

### Status Badges
- **Shape**: Pill-shaped (`rounded-full`), padding 2px 10px, 12px font size with medium weight.
- **States**:
  - *Registrado / Pendiente*: Warning tone (`#B45309` on `#FEF3C7`).
  - *En Revisión / Trámite*: Info tone (`#1D4ED8` on `#DBEAFE`).
  - *Aprobado / Titulado*: Success tone (`#166534` on `#DCFCE7`).
  - *Observado / Rechazado*: Danger tone (`#C0392B` on `#FEE2E2`).

### Drawers & Modals
- **480px Slide-Over Drawer**: Slides from right edge for reviewing academic packets without context switching. Header contains the student's name, DNI/code, and approval milestone checklist. 
- **Modals**: Centered, 12px radius, max-width 560px for critical sign-offs (e.g., "Aprobar Emisión de Diploma"). Primary confirmation button adopts destructive or primary styling depending on action severity.

### Alert Cards with Progress Trackers
- **Structure**: Surface `#FFFFFF`, 8px radius, bordered left with a 4px semantic vertical indicator.
- **Deadline Bar**: Embedded progress bar tracking statutory resolution deadlines (e.g., 30-day legal response period). Background `#E9DEE0` with dynamic fill tracking days remaining (switching from Info `#1D4ED8` to Danger `#C0392B` if < 48 hours remain).

### Filter Panels
- **Layout**: Horizontal action ribbon featuring an autocomplete search input, faculty/program dropdown selects, and a horizontal cluster of multi-select pill chips.
- **Pill Chips**: 4px vertical, 12px horizontal padding. Selected state adopts `#6D1B2D` with white text; unselected state uses `#FAFAFA` with `#E9DEE0` border.