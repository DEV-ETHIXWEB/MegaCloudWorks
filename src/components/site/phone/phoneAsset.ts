import { PHONE_MODEL_URL } from './story'

/**
 * The phone shell, fetched apart from three.
 *
 * The model used to be asked for by the loader inside the WebGL chunk, which
 * meant three had to download and evaluate in full before the browser even knew
 * the model existed. Nothing about fetching a file needs three, so the story
 * kicks this off the moment its own module is parsed and the loader parses the
 * bytes it finds waiting — the two downloads overlap instead of queueing.
 */
let pending: Promise<ArrayBuffer> | null = null

export function warmPhoneModel(): Promise<ArrayBuffer> {
  if (!pending) {
    const request = fetch(PHONE_MODEL_URL).then((response) => {
      if (!response.ok) throw new Error(`phone model: ${response.status}`)
      return response.arrayBuffer()
    })
    // a failed warm must not poison the loader — forget it so the render that
    // actually needs the model can ask again
    request.catch(() => {
      if (pending === request) pending = null
    })
    pending = request
  }
  return pending
}
