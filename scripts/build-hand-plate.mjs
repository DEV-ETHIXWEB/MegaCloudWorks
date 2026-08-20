/**
 * Builds public/concept/hand-phone.png - the plate the case-study device is
 * shown through - from the untouched artwork in raw-assets/hand-phone.png.
 *
 * Run with:  node scripts/build-hand-plate.mjs
 *
 * The source art ships with the display filled by a checkerboard baked into
 * the pixels rather than by real transparency, so a browser paints the checks
 * over the running app. This knocks that block out, trims the dead margin
 * around the hand, and prints the four per-cent values concept-device.css
 * needs to line the app up inside the cut-out.
 *
 * It never writes to its own input: the raw file stays the master copy.
 */
import { PNG } from 'pngjs'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const SRC = 'raw-assets/hand-phone.png'
const OUT = 'public/concept/hand-phone.png'

const src = PNG.sync.read(readFileSync(SRC))
const { width: W, height: H, data } = src
const at = (x, y) => (W * y + x) << 2

/*
  A checkerboard cell is light *and* neutral. Skin in a highlight is just as
  light - the back of a hand under a studio lamp runs past 230 - so lightness
  alone erases the hand. What it is not is grey: skin carries thirty-odd
  points of red over blue, and the checks carry none.
*/
const isCheck = (i) => {
  if (data[i + 3] < 140) return false
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if ((r + g + b) / 3 < 200) return false
  return Math.max(r, g, b) - Math.min(r, g, b) <= 10
}

// the display: the one large run of checks, found by taking the widest
// horizontal run on every row and keeping the block they agree on
let sx0 = W
let sy0 = H
let sx1 = 0
let sy1 = 0

for (let y = 0; y < H; y++) {
  let run = 0
  let best = 0
  let bestEnd = -1
  for (let x = 0; x < W; x++) {
    if (isCheck(at(x, y))) {
      run += 1
      if (run > best) {
        best = run
        bestEnd = x
      }
    } else {
      run = 0
    }
  }
  // a row of the display is most of the phone's width; anything shorter is a
  // highlight on a knuckle or a stray light pixel in the background
  if (best < W * 0.2) continue
  const start = bestEnd - best + 1
  if (start < sx0) sx0 = start
  if (bestEnd > sx1) sx1 = bestEnd
  if (y < sy0) sy0 = y
  if (y > sy1) sy1 = y
}

if (sx1 <= sx0 || sy1 <= sy0) {
  throw new Error('no checkerboard display found in ' + SRC)
}

// knock it out, leaving the dark bezel curve at the corners and the notch
for (let y = sy0; y <= sy1; y++) {
  for (let x = sx0; x <= sx1; x++) {
    const i = at(x, y)
    if (isCheck(i)) data[i + 3] = 0
  }
}

// trim the dead margin, so the plate is all hand and no empty pixels
let x0 = W
let y0 = H
let x1 = 0
let y1 = 0
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[at(x, y) + 3] > 16) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
}

const cw = x1 - x0 + 1
const ch = y1 - y0 + 1
const out = new PNG({ width: cw, height: ch })
for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const s = at(x + x0, y + y0)
    const d = (cw * y + x) << 2
    out.data[d] = data[s]
    out.data[d + 1] = data[s + 1]
    out.data[d + 2] = data[s + 2]
    out.data[d + 3] = data[s + 3]
  }
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, PNG.sync.write(out))

const sw = sx1 - sx0 + 1
const sh = sy1 - sy0 + 1
const pc = (v) => `${(v * 100).toFixed(2)}%`

console.log(`${SRC} ${W}x${H}  ->  ${OUT} ${cw}x${ch}`)
console.log(
  `display ${sw}x${sh}  aspect ${(sw / sh).toFixed(4)} (app is 0.4532)`,
)
console.log('\nconcept-device.css:')
console.log(`  --cdev-screen-x: ${pc((sx0 - x0) / cw)};`)
console.log(`  --cdev-screen-y: ${pc((sy0 - y0) / ch)};`)
console.log(`  --cdev-screen-w: ${pc(sw / cw)};`)
console.log(`  --cdev-focus-x: ${pc((sx0 - x0 + sw / 2) / cw)};`)
console.log(`  --cdev-focus-y: ${pc((sy0 - y0 + sh / 2) / ch)};`)
console.log(`\n  plate aspect-ratio: ${cw} / ${ch}`)
