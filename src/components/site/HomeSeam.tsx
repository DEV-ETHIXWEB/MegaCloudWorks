import './home-seam.css'

/**
 * The joint between the hero and the page under it.
 *
 * A bank of cloud spanning the full width, whole and uncropped, with the
 * mark glowing at its centre. It overhangs its strip and passes behind
 * the type of the sections either side, so nothing is ever obscured; the
 * fade that keeps it from reading as a box is a mask on the plate itself
 * rather than a pale sheet laid over it.
 *
 * All decoration, so it is hidden from assistive tech and takes no
 * pointer events - the hero's controls run right up to it.
 */
export function HomeSeam() {
  return (
    <div className="home-seam" aria-hidden="true">
      <div className="home-seam__stage">
        <img
          src="/section-gap-2.webp"
          alt=""
          width={2103}
          height={748}
          loading="lazy"
          decoding="async"
          className="home-seam__cloud"
        />

        <div className="home-seam__mark">
          <img
            src="/logo-mark.svg"
            alt=""
            width={231}
            height={141}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  )
}

export default HomeSeam
