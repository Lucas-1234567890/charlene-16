// Easter eggs: "charlene" no teclado, Konami code, chacoalhar o celular, cursor, console, título da aba.
import { burst, rain } from './confetti.js'
import { toast } from './toast.js'

export function initEggs() {
  // ---- teclado: "charlene" → modo ácido; Konami → reacende as velas
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  let typed = '', kon = 0
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return
    if (e.key.length === 1) typed = (typed + e.key.toLowerCase()).slice(-8)
    if (typed === 'charlene') {
      typed = ''
      const on = document.documentElement.classList.toggle('acid-mode')
      toast(on ? 'Modo ácido ativado ⚡ (digite de novo para voltar)' : 'Modo clássico de volta')
      rain(2200)
    }
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
    kon = k === KONAMI[kon] ? kon + 1 : (k === KONAMI[0] ? 1 : 0)
    if (kon === KONAMI.length) {
      kon = 0
      toast('Código secreto! As velas acenderam de novo 🎂')
      dispatchEvent(new Event('relight-candles'))
    }
  })

  // ---- chacoalhar o celular → confete
  let lastShake = 0
  addEventListener('devicemotion', (e) => {
    const a = e.accelerationIncludingGravity
    if (!a) return
    const force = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0)
    const now = Date.now()
    if (force > 42 && now - lastShake > 1500) { lastShake = now; burst({ x: .5, y: .4 }) }
  })

  // ---- título da aba
  const title = document.title
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Ei, volta! 🎂' : title
  })

  // ---- console
  console.log(
    '%cParabéns, Charlene! 🎉%c\n(sim, até aqui tem recado: você é a edição mais especial de 2026.)',
    'font: 900 28px "Inter Tight", sans-serif; color:#f33a2f; letter-spacing:-1px',
    'font: 12px "DM Mono", monospace; color:#101010'
  )
}

export function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const c = document.querySelector('.cursor')
  document.documentElement.classList.add('has-cursor')
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y
  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY
    const hov = e.target.closest('a, button, [role="radio"], .fitas-canvas, .bolo-canvas, .index-row')
    c.classList.toggle('is-hover', !!hov)
    c.textContent = hov ? '🎂' : ''
  })
  document.addEventListener('pointerleave', () => { c.style.opacity = 0 })
  document.addEventListener('pointerenter', () => { c.style.opacity = '' })
  ;(function loop() {
    cx += (x - cx) * .25; cy += (y - cy) * .25
    c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
    requestAnimationFrame(loop)
  })()
}
