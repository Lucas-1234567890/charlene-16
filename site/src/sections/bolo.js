import { content, numeral } from '../data/content.js'
import { lazyScene } from '../fx/lazy.js'
import { startMic } from '../fx/mic.js'
import { burst, rain } from '../fx/confetti.js'
import { playParabens } from '../fx/sound.js'

const b = content.bolo

export function boloHTML() {
  return `
  <section class="bolo" id="bolo" data-section="03" data-title="Bolo" data-dark aria-labelledby="bolo-t">
    <div class="bolo-side">
      <div>
        <div class="eyebrow" data-reveal>${b.eyebrow}</div>
        <h2 class="display" id="bolo-t" data-reveal><span>${b.titulo[0]}</span><span class="outline">${b.titulo[1]}</span></h2>
        <p class="bolo-text" data-reveal>${b.texto}</p>
      </div>
      <div class="bolo-controls">
        <div class="bolo-count eyebrow" aria-live="polite"><span>${b.contador}</span><b>--/--</b></div>
        <div class="mic-meter" aria-hidden="true"><i></i></div>
        <p class="bolo-hint eyebrow" aria-live="polite"></p>
        <button class="btn btn--red bolo-mic" type="button"><span>🎤 ${b.botaoMic}</span><span aria-hidden="true">→</span></button>
        <button class="btn btn--paper bolo-blow" type="button"><span>${b.botaoSemMic}</span><span aria-hidden="true">↗</span></button>
      </div>
    </div>

    <div class="bolo-stage">
      <canvas class="bolo-canvas" role="img" aria-label="Bolo de aniversário 3D com velas acesas formando o número ${numeral}. Toque nas velas para apagar."></canvas>
      <div class="bolo-fallback" hidden>${fallbackSVG()}</div>
      <span class="stamp stamp--acid bolo-stamp" aria-hidden="true">Receita única · Serve: o time todo</span>
      <div class="bolo-wish" aria-live="assertive">
        <p class="wish-title">${b.pedido}</p>
        <button class="btn btn--paper bolo-again" type="button"><span>${b.reacender}</span><span aria-hidden="true">↺</span></button>
      </div>
    </div>
  </section>`
}

function fallbackSVG() {
  return `<svg viewBox="0 0 300 260" aria-hidden="true">
    <rect x="40" y="150" width="220" height="80" fill="#f3efe5" stroke="#101010"/>
    <rect x="40" y="180" width="220" height="16" fill="#f33a2f"/>
    <rect x="75" y="100" width="150" height="50" fill="#f3efe5" stroke="#101010"/>
    <path d="M75 100h150v14c-10 10-14-4-22 8s-14-6-22 4-16-6-24 6-14-8-22 2-16-6-24 4-12-4-18-2z" fill="#d9ff00" stroke="#101010"/>
    <g class="fb-flames">${[110, 135, 165, 190].map((x) => `<rect x="${x - 3}" y="62" width="6" height="38" fill="#123fdd"/><ellipse cx="${x}" cy="54" rx="5" ry="10" fill="#ff9a3c"/>`).join('')}</g>
    <rect x="20" y="230" width="260" height="8" fill="#123fdd"/>
  </svg>`
}

export function initBolo() {
  const root = document.getElementById('bolo')
  const canvas = root.querySelector('.bolo-canvas')
  const countEl = root.querySelector('.bolo-count b')
  const hint = root.querySelector('.bolo-hint')
  const meter = root.querySelector('.mic-meter i')
  const micBtn = root.querySelector('.bolo-mic')
  const blowBtn = root.querySelector('.bolo-blow')
  const again = root.querySelector('.bolo-again')
  let cake = null, stopMic = null, celebrated = false

  const pad = (n) => String(n).padStart(2, '0')
  const onCount = (lit, total) => {
    countEl.textContent = `${pad(lit)}/${pad(total)}`
    root.classList.toggle('is-out', lit === 0)
  }

  const celebrate = () => {
    if (stopMic) { stopMic(); stopMic = null; micBtn.classList.remove('is-on') }
    meter.style.transform = 'scaleX(0)'
    hint.textContent = ''
    // 1 s de escuro antes da festa
    setTimeout(() => {
      root.classList.add('is-wish')
      burst({ x: .5, y: .5 })
      if (!celebrated) setTimeout(() => rain(2400), 700)
      celebrated = true
      playParabens()
    }, 1000)
  }

  const relight = () => {
    root.classList.remove('is-wish', 'is-out')
    if (cake) cake.relight()
    else root.querySelector('.fb-flames').style.opacity = 1
  }
  again.addEventListener('click', relight)
  window.addEventListener('relight-candles', () => {
    relight()
    document.getElementById('bolo').scrollIntoView({ behavior: 'smooth' })
  })

  blowBtn.addEventListener('click', () => {
    if (cake) cake.blowAll()
    else { root.querySelector('.fb-flames').style.opacity = 0; onCount(0, 1); celebrate() }
  })

  micBtn.addEventListener('click', async () => {
    if (stopMic) { stopMic(); stopMic = null; micBtn.classList.remove('is-on'); hint.textContent = ''; meter.style.transform = 'scaleX(0)'; return }
    try {
      let acc = 0
      stopMic = await startMic((level, blowing) => {
        meter.style.transform = `scaleX(${level})`
        if (!cake) return
        cake.setBreath(level)
        if (blowing) {
          acc += level * 1.6
          if (acc > 1) { cake.blowSome(Math.floor(acc)); acc = 0 }
        }
      })
      micBtn.classList.add('is-on')
      hint.textContent = b.ouvindo
    } catch {
      hint.textContent = b.micNegado
    }
  })

  // three.js só carrega quando o bolo estiver perto da tela
  lazyScene(root, async () => {
    const { createCake } = await import('../three/cake.js')
    try {
      cake = createCake(canvas, { digits: numeral, onCount, onAllOut: celebrate })
    } catch (e) {
      console.warn('WebGL indisponível, usando ilustração', e)
      canvas.hidden = true
      root.querySelector('.bolo-fallback').hidden = false
      onCount(1, 1)
      return null
    }
    return cake
  })
}
