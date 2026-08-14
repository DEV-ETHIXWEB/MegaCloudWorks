/**
 * Generates src/components/site/world-countries.ts from Natural Earth data
 * (world-atlas, public domain).
 *
 * Run with:  node scripts/generate-world.mjs
 *
 * The output is a plain data module — world-atlas / topojson-client / d3-geo
 * stay devDependencies and never reach the browser bundle.
 */
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'
import { geoNaturalEarth1, geoPath, geoCentroid } from 'd3-geo'

const require = createRequire(import.meta.url)
const topo = require('world-atlas/countries-110m.json')

const WIDTH = 900
const HEIGHT = 460

const countries = feature(topo, topo.objects.countries)
  .features // Antarctica adds a full-width band of ice and no coverage story
  .filter((f) => f.properties.name !== 'Antarctica')

const projection = geoNaturalEarth1().fitExtent(
  [
    [8, 8],
    [WIDTH - 8, HEIGHT - 8],
  ],
  { type: 'FeatureCollection', features: countries },
)

const path = geoPath(projection)

function regionOf(name, [lon, lat]) {
  if (name === 'United States of America') return 'us'
  if (name === 'Canada' || name === 'Greenland') return 'canada'
  if (lon >= -120 && lon <= -30 && lat >= -60 && lat <= 33) return 'latam'
  if (lon >= 34 && lon <= 63 && lat >= 12 && lat <= 42) return 'mideast'
  if (lon >= -26 && lon <= 45 && lat >= 34 && lat <= 73) return 'europe'
  if (lon >= -20 && lon <= 52 && lat >= -40 && lat <= 34) return 'africa'
  if (lon >= 110 && lat <= -8) return 'oceania'
  if (lon >= 160 || lon <= -140) return 'oceania' // pacific islands
  return 'asia'
}

const rows = countries
  .map((f) => {
    const d = path(f)
    if (!d) return null
    return {
      name: f.properties.name,
      region: regionOf(f.properties.name, geoCentroid(f)),
      // one decimal is ~0.08px at the size this ever renders, and it cuts
      // the generated file down by well over half
      d: d.replace(/(\d+\.\d)\d+/g, '$1'),
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name))

const out = `// GENERATED FILE — do not edit by hand.
// Source: Natural Earth 1:110m via world-atlas (public domain).
// Regenerate with:  node scripts/generate-world.mjs

export type WorldRegionId =
  | 'us'
  | 'canada'
  | 'latam'
  | 'europe'
  | 'africa'
  | 'mideast'
  | 'asia'
  | 'oceania'

export type WorldCountry = {
  name: string
  region: WorldRegionId
  d: string
}

export const WORLD_VIEWBOX = '0 0 ${WIDTH} ${HEIGHT}'
export const WORLD_WIDTH = ${WIDTH}
export const WORLD_HEIGHT = ${HEIGHT}

export const WORLD_COUNTRIES: ReadonlyArray<WorldCountry> = ${JSON.stringify(
  rows,
  null,
  0,
)}
`

writeFileSync(
  new URL('../src/components/site/world-countries.ts', import.meta.url),
  out,
)

const counts = rows.reduce((acc, r) => {
  acc[r.region] = (acc[r.region] ?? 0) + 1
  return acc
}, {})
console.log(`${rows.length} countries`, counts)
console.log(`${(out.length / 1024).toFixed(1)} kB written`)
