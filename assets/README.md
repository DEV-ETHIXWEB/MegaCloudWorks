# MegaCloudWorks Assets

A curated, de-duplicated set of the highest-quality version of every real asset
used across the MegaCloudWorks project (original site, redesign, About-page
source design files, and design reference material). Built by walking the
entire `A:\Megacloudworks` tree, matching each production asset back to its
original high-resolution source where one exists, and re-encoding that source
as high-quality WebP (quality ~90, original dimensions preserved). Where no
higher-resolution source existed anywhere in the project, the existing
production file was copied through unchanged rather than invented or upscaled.

`MegaCloudWorks-redesign/public/` was found to be almost entirely byte-identical
copies of `MegaCloudWorks/public/` (confirmed via MD5) and is not a separate
source — its assets are already covered by the single canonical copy below.
Anything under `raw-assets/dead-assets/` and the stray `desktop.ini` file were
excluded per instructions.

## Folder guide

- **brand/** — Logo marks (SVG, vector, kept as-is), the Ethixweb sub-brand
  lockups, and every favicon/app-icon size (ICO, PNG, maskable icons). These
  are purpose-built at exact pixel dimensions or already vector, so all are
  copied as-is — no higher-res source exists or would make sense for them.

- **hero/** — Full-bleed hero and section-background imagery.
  `about-hero.webp` and `about-footer.webp` are re-encoded from genuine
  high-resolution source PNGs (5364x3572 and 2946x1224) found in
  `about/drive-download-.../`, a real resolution upgrade over the production
  webps. `home-hero-background.webp`, `about-background.webp`, and
  `contact-background.webp` have no larger source anywhere in the project, so
  the existing production webp is copied as-is.

- **photography/** — The red-tinted mountain/sky photography used behind the
  "sky" sections (welcome, studios, process, ready, contact) and the About
  page sky panels. No higher-resolution originals exist for these, so all are
  copied as-is (the production webp is already the best available version).
  Also includes two bonus high-res assets found only in `raw-assets/` with no
  production usage: a "dashboard on rock" mockup (`dashboard-on-rock-bonus.webp`)
  and four standalone decorative cloud-puff graphics (`cloud-element-*.webp`),
  re-encoded from their PNG sources.

- **work-cards/** — The illustrated cards for the "Design / Development /
  Brand" services and work-showcase sections. Re-encoded from their true
  high-resolution sources (`image 23/24/25.png` in raw-assets, ~1000px wide,
  vs. the 640px production webp). The `work-*.webp` variants are re-encoded
  from same-resolution PNG masters (no resolution gain there, but a cleaner
  single-generation encode instead of a re-compressed webp).

- **icons/** — The four "How We Work" process-step icons (Understand, Design,
  Build, Ship) as SVG, kept as vector, no re-encoding needed.

- **screens-and-references/** — Design references, style comparisons, and
  QA/documentation screenshots. Not production assets, but real project
  material worth preserving. Includes:
  - `original-site/` — 15 full-page/mobile screenshots of the live original
    site (from `raw-assets/screenshots/`).
  - `design-explorations/` — early section-mockup exports and About-page sky
    explorations that were superseded by the final production assets (kept
    for historical reference, all re-encoded to WebP).
  - Top-level reference screenshots from `NEW THINGS REFERNECE/`: page
    references (about, contact form, contact-us page), three "Style Reference
    Implementation" comparison exports, seven dated UI screenshots, and a
    work-concepts board. `readytobuild.png` was found to be byte-identical
    (same MD5) to `hero img.png` and was not duplicated here — see
    `hero/about-hero.webp`.
  - `about-page-final-mockup.webp` — the finished About-page design frame
    (`END result Frame 19.png`).
  - Note: `reference-contact-us-page.webp` was downscaled from its 21635x18025
    source to 16383x13649 because that exceeds WebP's hard 16383px-per-side
    limit — still full reference resolution in practice.

- **3d-models/** — The interactive phone model used in the hero section:
  `phone.glb` / `phone.obj` (the primary exported model) plus an alternate
  `phone-model-alt.obj` / `.mtl` pair found in `raw-assets/phone-model/`. All
  copied as-is per instructions (3D models are not re-encoded). The project's
  `.zip` (`Phone by Alex Safayan - ...zip`) was inspected and found to contain
  exactly this alternate `.obj`/`.mtl` pair already present in
  `phone-model/`, so it was not extracted separately — it's fully redundant.

- **fonts/** — `Geologica-Variable.woff2`, the site's variable webfont.
  Copied as-is (fonts are never re-encoded).

- **audio/** — `click.wav`, the UI click sound. `public/click.wav` and
  `raw-assets/audio.wav` are byte-identical (same MD5); only one copy is kept.

## Re-encoding summary

- 51 images re-encoded from higher-resolution (or same-resolution-but-cleaner)
  PNG sources to WebP at quality 90, dimensions preserved (no upscaling or
  downscaling, except the one WebP-dimension-limit case noted above).
- 34 files copied through unchanged: SVGs, favicons/app icons with no larger
  source, sky/background photography with no larger source, the font, the 3D
  models, and the audio file.
- 0 files failed to process.
