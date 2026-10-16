import { content } from '../data/content.js'
import { unlockAudio } from '../fx/sound.js'

const t = content.intro

// Portão de embarque: conta até 100 enquanto carrega, e o clique em "Abrir presente"
// é o gesto que destrava áudio e giroscópio no iPhone.
export function runIntro(tasks) {
  const el = document.getElementById('intro')
  el.innerHTML = `
    <div class="intro-top"><span>CHARLENE/16</span><span>${content.cidade}</span></div>
    <div class="intro-mid">
      <div class="intro-count" aria-hidden="true"><span>000</span><small>%</small></div>
      <div class="intro-bar" aria-hidden="true"><i></i></div>
      <div class="intro-status" role="status">${t.status}</div>
      <button class="btn btn--red intro-open" type="button" disabled><span>${t.botao}</span><span aria-hidden="true">🎁</span></button>
    </div>
    <div class="intro-bot"><span>Edição 2026 · Tiragem 1/1</span><span>${t.dica}</span></div>`

  const num = el.querySelector('.intro-count span')
  const bar = el.querySelector('.intro-bar i')
  const status = el.querySelector('.intro-status')
  const btn = el.querySelector('.intro-open')

  let done = 0, shown = 0
  const total = tasks.length + 1
  const minTime = new Promise((r) => setTimeout(r, 1700)).then(() => done++)
  tasks.forEach((p) => Promise.resolve(p).catch(() => {}).finally(() => done++))

  return new Promise((resolve) => {
    const tick = () => {
      const target = (done / total) * 100
      shown += (target - shown) * .08 + (shown < target ? .3 : 0)
      shown = Math.min(shown, target)
      num.textContent = String(Math.round(shown)).padStart(3, '0')
      bar.style.transform = `scaleX(${shown / 100})`
      if (shown >= 99.5) {
        num.textContent = '100'; bar.style.transform = 'scaleX(1)'
        status.textContent = t.autorizado; status.classList.add('ok')
        btn.disabled = false; btn.classList.add('is-ready'); btn.focus({ preventScroll: true })
        return
      }
      requestAnimationFrame(tick)
    }
    Promise.all([minTime]).then(() => requestAnimationFrame(tick))

    btn.addEventListener('click', async () => {
      unlockAudio()
      // iOS 13+: giroscópio precisa de permissão dentro de um gesto do usuário
      try {
        if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
          DeviceOrientationEvent.requestPermission().catch(() => {})
        }
        if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
          DeviceMotionEvent.requestPermission().catch(() => {})
        }
      } catch { /* sem giroscópio, segue o baile */ }
      el.classList.add('is-gone')
      setTimeout(() => el.classList.add('is-hidden'), 1200)
      resolve()
    }, { once: true })
  })
}
