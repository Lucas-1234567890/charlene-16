import { content } from '../data/content.js'
import { lazyScene } from '../fx/lazy.js'
import { burst } from '../fx/confetti.js'

const f = content.finale

export function finaleHTML() {
  const wa = content.whatsapp
    ? `<a class="btn btn--paper finale-cta" href="https://wa.me/${content.whatsapp}?text=${encodeURIComponent(content.whatsappMensagem)}" target="_blank" rel="noopener"><span>${f.cta}</span><span aria-hidden="true">→</span></a>`
    : ''
  return `
  <section class="finale" id="farol" data-section="08" data-title="Farol" data-dark aria-labelledby="fin-t">
    <canvas class="farol-canvas" role="img" aria-label="Farol da Barra ao pôr do sol, com o feixe de luz girando sobre o mar."></canvas>
    <div class="farol-fallback" hidden>${farolSVG()}</div>
    <div class="farol-flash" aria-hidden="true"></div>
    <div class="finale-copy">
      <div class="eyebrow" data-reveal>${f.eyebrow}</div>
      <p class="final-number" aria-hidden="true">${f.numero}</p>
      <h2 class="finale-frase" id="fin-t" data-reveal>${f.frase}</h2>
      <p class="finale-parabens" data-reveal>${f.parabens}</p>
      <div class="finale-actions" data-reveal>
        ${wa}
        <button class="btn btn--paper finale-confete" type="button"><span>Mais confete</span><span aria-hidden="true">✺</span></button>
      </div>
    </div>
  </section>
  <footer class="footer">
    <div class="footer-brand">CHARLENE/16</div>
    <div class="footer-meta eyebrow">
      <span>${f.rodape}</span>
      <span>Com carinho, ${content.remetente}</span>
      <a href="#inicio" class="footer-top">Voltar ao topo ↑</a>
    </div>
  </footer>`
}

function farolSVG() {
  return `<svg viewBox="0 0 200 300" aria-hidden="true">
    <path d="M30 300h140l-14-50H44z" fill="#e9dfcf" stroke="#101010"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${82 + i * 1.6} ${250 - i * 28}h${36 - i * 3.2}l-1.6-28h-${32.8 - i * 3.2}z" fill="${i % 2 ? '#101010' : '#f3efe5'}" stroke="#101010"/>`).join('')}
    <rect x="86" y="62" width="28" height="26" fill="#fff2b8" stroke="#101010"/>
    <path d="M80 62l20-20 20 20z" fill="#101010"/>
  </svg>`
}

export function initFinale() {
  const sec = document.getElementById('farol')
  const canvas = sec.querySelector('.farol-canvas')
  sec.querySelector('.finale-confete').addEventListener('click', (e) => {
    burst({ x: e.clientX / innerWidth, y: e.clientY / innerHeight })
  })
  lazyScene(sec, async () => {
    const { createFarol } = await import('../three/farol.js')
    try {
      return createFarol(canvas, { onSweep: (g) => sec.style.setProperty('--glow', g.toFixed(3)) })
    } catch (e) {
      console.warn('WebGL indisponível, usando ilustração', e)
      canvas.hidden = true
      sec.querySelector('.farol-fallback').hidden = false
      return null
    }
  })
}
