import { content } from '../data/content.js'
import { blip } from '../fx/sound.js'
import { burst } from '../fx/confetti.js'
import { toast } from '../fx/toast.js'

const f = content.fitas

// cores tradicionais das fitinhas, dessaturadas para conversar com o papel
const CORES = ['#5f8f6a', '#d9b84a', '#4a6fb0', '#c2564c', '#ebe6da', '#d48fa6', '#7a5fa0', '#e08a3c', '#3f8f8a']
const ACID = '#d9ff00'

export function fitasHTML() {
  return `
  <section class="fitas" id="fitas" data-section="04" data-title="Fitinhas" aria-labelledby="fitas-t">
    <div class="fitas-head">
      <div class="eyebrow" data-reveal>${f.eyebrow}</div>
      <h2 class="display" id="fitas-t" data-reveal><span>${f.titulo[0]}</span><span class="outline">${f.titulo[1]}</span></h2>
      <p data-reveal>${f.texto}</p>
      <ol class="nos" aria-live="polite">
        ${f.desejos.map((_, i) => `<li class="no"><span class="eyebrow">Nó 0${i + 1}</span><p>Amarre uma fitinha para revelar</p></li>`).join('')}
      </ol>
      <p class="nos-final eyebrow" aria-live="polite"></p>
    </div>
    <div class="fitas-stage">
      <canvas class="fitas-canvas" role="img" aria-label="Gradil com fitinhas do Senhor do Bonfim balançando ao vento. Toque em uma fita para dar um nó e revelar um desejo."></canvas>
      <button class="btn fitas-a11y" type="button">Dar um nó em uma fita</button>
      <span class="stamp stamp--v fitas-stamp" aria-hidden="true">Igreja do Bonfim · SSA</span>
    </div>
  </section>`
}

function lum(hex) {
  const n = parseInt(hex.slice(1), 16)
  return (.299 * (n >> 16) + .587 * ((n >> 8) & 255) + .114 * (n & 255)) / 255
}

export function initFitas() {
  const root = document.getElementById('fitas')
  const canvas = root.querySelector('.fitas-canvas')
  const g = canvas.getContext('2d')
  const nosEl = [...root.querySelectorAll('.no')]
  const finalEl = root.querySelector('.nos-final')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const LEGENDA = `${f.legenda.toUpperCase()} · `

  let W = 0, H = 0, dpr = 1, ribbons = [], knots = 0, BAR = 46
  const pointer = { x: -999, y: -999, vx: 0, vy: 0 }

  function build() {
    const r = canvas.getBoundingClientRect()
    dpr = Math.min(devicePixelRatio, 2)
    W = r.width; H = r.height
    canvas.width = W * dpr; canvas.height = H * dpr
    const mobile = W < 560
    const gap = mobile ? 30 : 36
    const n = Math.max(8, Math.floor((W - 30) / gap))
    const start = (W - (n - 1) * gap) / 2
    const old = ribbons
    ribbons = []
    for (let i = 0; i < n; i++) {
      const x = start + i * gap
      const len = (H - BAR - 30) * (.62 + ((i * 53) % 17) / 17 * .36)
      const N = 18, seg = len / N
      const pts = []
      for (let k = 0; k <= N; k++) pts.push({ x, y: BAR + k * seg, px: x, py: BAR + k * seg })
      const color = i === Math.floor(n / 2) ? ACID : CORES[(i * 5) % CORES.length]
      ribbons.push({ pts, seg, color, ink: lum(color) > .52, w: mobile ? 15 : 17, tied: old[i]?.tied || 0, phase: i * .7 })
    }
  }

  function step(dt, t) {
    const wind = reduced ? 0 : Math.sin(t * .8) * 60 + Math.sin(t * 2.1) * 30 + 40
    ribbons.forEach((r) => {
      const p = r.pts
      for (let k = 1; k < p.length; k++) {
        const q = p[k]
        const vx = (q.x - q.px) * .985, vy = (q.y - q.py) * .985
        q.px = q.x; q.py = q.y
        const wk = (k / p.length) * (wind + Math.sin(t * 3 + r.phase + k * .4) * 25)
        let ax = wk, ay = 900
        const dx = q.x - pointer.x, dy = q.y - pointer.y, d2 = dx * dx + dy * dy
        if (d2 < 4900) { const s = 1 - Math.sqrt(d2) / 70; ax += pointer.vx * 60 * s; ay += pointer.vy * 30 * s }
        q.x += vx + ax * dt * dt; q.y += vy + ay * dt * dt
      }
      for (let it = 0; it < 6; it++) {
        p[0].x = p[0].px = p[0].x; p[0].y = BAR
        for (let k = 0; k < p.length - 1; k++) {
          const a = p[k], b = p[k + 1]
          const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .001
          const diff = (d - r.seg) / d
          if (k === 0) { b.x -= dx * diff; b.y -= dy * diff }
          else { a.x += dx * diff * .5; a.y += dy * diff * .5; b.x -= dx * diff * .5; b.y -= dy * diff * .5 }
        }
      }
    })
    pointer.vx *= .85; pointer.vy *= .85
  }

  function drawRibbon(r) {
    const p = r.pts, hw = r.w / 2
    const L = [], R = []
    for (let k = 0; k < p.length; k++) {
      const a = p[Math.max(0, k - 1)], b = p[Math.min(p.length - 1, k + 1)]
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1
      const nx = -dy / d, ny = dx / d
      L.push([p[k].x + nx * hw, p[k].y + ny * hw]); R.push([p[k].x - nx * hw, p[k].y - ny * hw])
    }
    // ponta em "V" (rabo de andorinha)
    const last = p[p.length - 1], prev = p[p.length - 2]
    const tx = last.x - prev.x, ty = last.y - prev.y, td = Math.hypot(tx, ty) || 1
    const notch = [last.x - tx / td * 9, last.y - ty / td * 9]
    g.beginPath()
    g.moveTo(L[0][0], L[0][1])
    for (let k = 1; k < L.length; k++) g.lineTo(L[k][0], L[k][1])
    g.lineTo(notch[0], notch[1])
    for (let k = R.length - 1; k >= 0; k--) g.lineTo(R[k][0], R[k][1])
    g.closePath()
    g.fillStyle = r.color; g.fill()
    g.lineWidth = 1; g.strokeStyle = 'rgba(16,16,16,.55)'; g.stroke()

    // legenda escrita ao longo da fita
    g.fillStyle = r.ink ? '#101010' : '#f3efe5'
    g.font = `500 ${r.w < 16 ? 7.5 : 8.5}px "DM Mono", monospace`
    g.textBaseline = 'middle'
    let s = 18, ci = 0
    const total = r.seg * (p.length - 1) - 14
    while (s < total) {
      const k = Math.min(p.length - 2, Math.floor(s / r.seg)), fr = s / r.seg - k
      const a = p[k], b = p[k + 1]
      const x = a.x + (b.x - a.x) * fr, y = a.y + (b.y - a.y) * fr
      const ang = Math.atan2(b.y - a.y, b.x - a.x)
      g.save(); g.translate(x, y); g.rotate(ang); g.fillText(LEGENDA[ci % LEGENDA.length], 0, 0); g.restore()
      s += r.w < 16 ? 6.4 : 7.2; ci++
    }

    // nó
    if (r.tied) {
      const k = p[1]
      g.fillStyle = r.color; g.strokeStyle = '#101010'; g.lineWidth = 1.2
      g.beginPath(); g.ellipse(p[0].x, BAR + 9, r.w * .62, 8, 0, 0, Math.PI * 2); g.fill(); g.stroke()
      g.beginPath(); g.ellipse(p[0].x - r.w * .7, BAR + 18, 5, 9, .7, 0, Math.PI * 2); g.fill(); g.stroke()
      g.beginPath(); g.ellipse(p[0].x + r.w * .7, BAR + 18, 5, 9, -.7, 0, Math.PI * 2); g.fill(); g.stroke()
      g.fillStyle = '#101010'; g.font = '500 9px "DM Mono", monospace'; g.textAlign = 'center'
      g.fillText(`0${r.tied}`, k.x, BAR - 14); g.textAlign = 'start'
    }
  }

  function draw() {
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, W, H)
    // gradil da igreja
    g.strokeStyle = 'rgba(16,16,16,.22)'; g.lineWidth = 2
    for (let x = 12; x < W; x += 24) { g.beginPath(); g.moveTo(x, BAR); g.lineTo(x, H); g.stroke() }
    g.lineWidth = 1
    for (let x = 12; x < W; x += 24) { g.beginPath(); g.arc(x, BAR - 6, 4, 0, Math.PI * 2); g.stroke() }
    ribbons.forEach(drawRibbon)
    g.fillStyle = '#101010'; g.fillRect(0, BAR - 3, W, 6)
    g.fillRect(0, H - 4, W, 4)
  }

  function tie(r) {
    if (knots >= 3) { toast('Já são três pedidos 😉 Agora é com o Senhor do Bonfim.'); return }
    if (r.tied) { toast('Essa já tem nó. Escolhe outra!'); return }
    knots++
    r.tied = knots
    r.pts.forEach((q, k) => { q.py += 6 + k * .9 }) // puxão para cima
    blip(660 + knots * 110)
    const li = nosEl[knots - 1]
    li.querySelector('p').textContent = f.desejos[knots - 1]
    li.classList.add('is-tied')
    li.style.setProperty('--c', r.color)
    if (knots === 3) {
      finalEl.textContent = f.final
      const rect = canvas.getBoundingClientRect()
      burst({ x: (rect.left + rect.width / 2) / innerWidth, y: Math.min(.9, (rect.top + 80) / innerHeight) })
    }
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    if (pointer.x > -900) { pointer.vx = x - pointer.x; pointer.vy = y - pointer.y }
    pointer.x = x; pointer.y = y
  })
  canvas.addEventListener('pointerleave', () => { pointer.x = pointer.y = -999 })
  canvas.addEventListener('click', (e) => {
    const rc = canvas.getBoundingClientRect()
    const x = e.clientX - rc.left, y = e.clientY - rc.top
    let best = null, bd = 26
    ribbons.forEach((r) => r.pts.forEach((q) => { const d = Math.hypot(q.x - x, q.y - y); if (d < bd) { bd = d; best = r } }))
    if (best) tie(best)
  })
  root.querySelector('.fitas-a11y').addEventListener('click', () => {
    const free = ribbons.filter((r) => !r.tied)
    if (free.length) tie(free[Math.floor(Math.random() * free.length)])
  })

  // loop só roda com a seção visível
  let running = false, last = 0, t = 0, raf = 0
  const loop = (now) => {
    raf = requestAnimationFrame(loop)
    const dt = Math.min((now - last) / 1000, 1 / 30); last = now; t += dt
    step(dt, t); draw()
  }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop) }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
  }, { rootMargin: '100px 0px' }).observe(canvas)

  new ResizeObserver(build).observe(canvas)
  document.fonts.ready.then(() => { if (!running) draw() })
}
