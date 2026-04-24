# Leica Contact Us Online — Single Page Migration

## Execution Readiness

This plan is fully researched and ready for implementation. **Execute mode is required** to proceed — all remaining steps involve creating files and running scripts. Please switch to Execute mode to begin.

## Overview

| Property | Value |
|----------|-------|
| **Mode** | Single Page |
| **Source URL** | `https://www.leica-microsystems.com/contact/contact-us-online/` |
| **Project Type** | xwalk (Universal Editor) |
| **Block Library** | `sta-xwalk-boilerplate` |

## Page Structure (pre-analyzed)

| # | Section | Original Content | EDS Block |
|---|---------|-----------------|-----------|
| 1 | Contact Categories | 4 icon-cards in 2x2 grid (Product Info, Service & Repair, App Support, Careers) with SVG icons, h3 headings, descriptions, links | **Cards** block (`cards-contact` variant) |
| 2 | Local Contact Finder | H2 heading + interactive office-finder widget with country/partner/application filters, map/list toggle, office result listings | **Default content** (h2) + **Embed** block (dynamic widget) |

## Checklist

- [ ] **Step 0: Initialize Migration Plan** — Create `migration-work/migration-plan.md`
- [ ] **Step 1: Project Setup** — Verify `.migration/project.json` via `excat-project-expert` (already configured)
- [ ] **Step 2: Site Analysis** — Create `page-templates.json` skeleton via `excat-site-analysis`
- [ ] **Step 3: Page Analysis** — Analyze sections and block variants via `excat-page-analysis`
- [ ] **Step 4: Block Mapping** — Map DOM selectors to EDS blocks via `block-mapping-manager`
- [ ] **Step 5: Import Infrastructure** — Generate parsers + transformers via `excat-import-infrastructure`, then bundle via `excat-import-script`
- [ ] **Step 6: Content Import** — Execute import via `excat-content-import`, generate HTML content file

## Skill Delegation Plan

| Step | Skill | Input | Output |
|------|-------|-------|--------|
| 1 | `excat-project-expert` | `fstab.yaml` | `.migration/project.json` |
| 2 | `excat-site-analysis` | Source URL | `tools/importer/page-templates.json` |
| 3 | `excat-page-analysis` | Source URL | `migration-work/authoring-analysis.json` |
| 4 | `block-mapping-manager` | analysis JSON + cleaned HTML | Updated `page-templates.json` with block mappings |
| 5 | `excat-import-infrastructure` + `excat-import-script` | analysis JSON + cleaned HTML | `parsers/*.js`, `transformers/*.js`, `import-*.js` |
| 6 | `excat-content-import` | URLs + import script | `content/contact/contact-us-online.html` |

## Available Project Blocks

Existing local blocks: accordion, carousel, columns, columns-info, embed, form, fragment, hero, hero-banner, modal, quote, search, table, tabs

Library blocks: Tabs, Accordion, Cards, Carousel, Columns, Embed, Hero, Search, Table, Video

---

*All checklist items require file creation and script execution. **Switch to Execute mode to begin implementation.***
