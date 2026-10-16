// Confete nas cores do design system
import confetti from 'canvas-confetti'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const colors = () => {
  const s = getComputedStyle(document.documentElement)
  return ['--red', '--blue', '--acid', '--paper'].map((v) => s.getPropertyValue(v).trim())
}
const shoot = confetti.create(null, { resize: true, useWorker: true, disableForReducedMotion: false })
const base = () => ({ colors: colors(), zIndex: 420, disableForReducedMotion: false, scalar: 1.1, ticks: 260 })

export function burst(origin = { x: .5, y: .55 }) {
  const n = reduced() ? 40 : 1
  if (reduced()) return shoot({ ...base(), particleCount: n, spread: 70, origin })
  shoot({ ...base(), particleCount: 90, spread: 70, startVelocity: 55, origin })
  setTimeout(() => shoot({ ...base(), particleCount: 70, spread: 120, startVelocity: 40, origin, shapes: ['square'] }), 180)
  setTimeout(() => {
    shoot({ ...base(), particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: .75 } })
    shoot({ ...base(), particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: .75 } })
  }, 380)
}

export function rain(ms = 2600) {
  if (reduced()) return burst()
  const end = Date.now() + ms
  ;(function tick() {
    shoot({ ...base(), particleCount: 4, angle: 270, spread: 50, startVelocity: 12, gravity: .7, origin: { x: Math.random(), y: -.05 } })
    if (Date.now() < end) requestAnimationFrame(tick)
  })()
}
