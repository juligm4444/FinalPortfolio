import * as registry from '../../webgl/registry.js'
import { getCapabilities } from '../../webgl/capabilities.js'

/* V3 §B "regla de rendimiento": of all the fur pieces on a page (Plush Tile,
   Velour, Mohair) only ONE is a live WebGL canvas at a time: the one under the
   pointer or holding keyboard focus. Everything else is its rest image. This
   module is that single seat. It takes one slot of the WebGL budget
   (src/webgl/registry.js) while a piece is live and gives it back shortly after. */
const SLOT = 'fur-live'
const LINGER_MS = 500

let owner = null // { id, onGrant, onRevoke }
let asked = false
let granted = false
let lingerTimer = 0

/** Live fur needs a real pointer (or keyboard), motion allowed and WebGL2. */
export function canLive() {
  if (typeof window === 'undefined') return false
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false
  return getCapabilities().allowed
}

export function claim(id, onGrant, onRevoke) {
  clearTimeout(lingerTimer)
  if (owner && owner.id !== id) {
    const prev = owner
    owner = null
    prev.onRevoke()
  }
  owner = { id, onGrant, onRevoke }
  if (granted) {
    onGrant()
    return
  }
  if (asked) return
  asked = true
  registry.request(SLOT, {
    grant: () => {
      granted = true
      owner?.onGrant()
    },
    revoke: () => {
      granted = false
      asked = false
      const prev = owner
      owner = null
      prev?.onRevoke()
    },
  })
}

export function release(id) {
  if (owner?.id !== id) return
  owner = null
  clearTimeout(lingerTimer)
  // Moving from one tile to the next should not hand the slot back and ask again.
  lingerTimer = setTimeout(() => {
    if (owner) return
    registry.release(SLOT)
    asked = false
    granted = false
  }, LINGER_MS)
}

export function isOwner(id) {
  return owner?.id === id
}
