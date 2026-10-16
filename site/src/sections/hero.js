import { content, numeral } from '../data/content.js'

const h = content.hero

export function heroHTML() {
  return `
  <section class="launch" id="inicio" data-section="01" data-title="Início" aria-label="Início">
    <div class="launch-copy">
      <div>
        <div class="eyebrow h-eyebrow">${h.eyebrow}</div>
        <h1 class="h-title" aria-label="${content.nome}">
          <span>${h.titulo[0]}</span><span class="outline">${h.titulo[1]}</span>
        </h1>
        <p class="h-copy">${h.manifesto}</p>
      </div>
      <div class="copy-foot eyebrow h-foot"><span>${content.cargo}</span><span>${content.empresa}</span></div>
    </div>

    <div class="launch-visual h-visual">
      <div class="lv-num" aria-hidden="true">${numeral}</div>
      <div class="lv-photo">
        <picture>
          <source srcset="/img/charlene-cutout.webp" type="image/webp" />
          <img class="lv-shadow" src="/img/charlene-cutout.png" alt="" aria-hidden="true" width="800" height="785" />
        </picture>
        <picture>
          <source srcset="/img/charlene-cutout.webp" type="image/webp" />
          <img class="lv-img" src="/img/charlene-cutout.png" alt="Foto da ${content.nome}" width="800" height="785" />
        </picture>
      </div>
      <div class="poster-stamps" aria-hidden="true">
        <span class="stamp">${h.carimbos[0]}</span>
        <span class="stamp stamp--acid">${h.carimbos[1]}</span>
        <span class="stamp stamp--v">${h.carimbos[2]}</span>
      </div>
    </div>

    <aside class="buy-panel h-panel" aria-label="Painel do presente">
      <div>
        <div class="product-code">${h.codigo.replace('/', '/<br>')}</div>
        <div class="price">${h.preco}</div>
      </div>
      <div class="sizes">
        <label class="eyebrow" id="abraco-label">${h.abracoLabel}</label>
        <div class="size-row" role="radiogroup" aria-labelledby="abraco-label">
          ${h.abracos.map((a, i) => `<button type="button" role="radio" aria-checked="${i === 2}" class="${i === 2 ? 'active' : ''}" data-i="${i}" style="--c:${a.cor}"><i aria-hidden="true"></i>${a.nivel}</button>`).join('')}
        </div>
        <p class="size-note" aria-live="polite">${h.abracos[2].texto}</p>
        <a class="add" href="#bolo"><span>${h.cta}</span><span aria-hidden="true">→</span></a>
      </div>
      <div class="ecg" aria-hidden="true">
        <div class="ecg-head eyebrow"><span>${h.sinais}</span><span class="ecg-bpm">♥ <b>16</b>/10</span></div>
        <svg viewBox="0 0 240 48" preserveAspectRatio="none"><path pathLength="100" d="M0 26h40l6-4 6 4h18l5-20 7 38 6-18h22l6-5 7 5h40l5-20 7 38 6-18h22l6-5 7 5h14"/></svg>
      </div>
      <div class="panel-data">
        ${h.dados.map(([k, v]) => `<div class="data-line"><span>${k}</span><span>${v}</span></div>`).join('')}
      </div>
    </aside>
  </section>`
}

export function initHero() {
  const root = document.getElementById('inicio')
  const note = root.querySelector('.size-note')
  root.querySelectorAll('.size-row button').forEach((b) => {
    b.addEventListener('click', () => {
      root.querySelectorAll('.size-row button').forEach((x) => {
        x.classList.toggle('active', x === b)
        x.setAttribute('aria-checked', x === b)
      })
      note.textContent = h.abracos[+b.dataset.i].texto
      note.classList.remove('pop'); void note.offsetWidth; note.classList.add('pop')
    })
  })

  // parallax da foto e do numeral (mouse no desktop, giroscópio no celular)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const visual = root.querySelector('.launch-visual')
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
  const loop = () => {
    cx += (tx - cx) * .08; cy += (ty - cy) * .08
    visual.style.setProperty('--px', cx.toFixed(3))
    visual.style.setProperty('--py', cy.toFixed(3))
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .001 ? requestAnimationFrame(loop) : 0
  }
  const set = (x, y) => { tx = x; ty = y; if (!raf) raf = requestAnimationFrame(loop) }
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    set(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5)
  })
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return
    set(Math.max(-1, Math.min(1, e.gamma / 30)) * .5, Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * .5)
  })
}
