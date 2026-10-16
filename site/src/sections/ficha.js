import { content } from '../data/content.js'

const f = content.ficha

// ícones da prescrição, traço em tinta
const icons = [
  // fatia de bolo
  `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 30V20l26-8v18z"/><path d="M6 20l26-8" /><path d="M6 25h26"/><path class="fill" d="M19 8c0-3 2-4 2-6 1 2 2 3 0 6z"/><path d="M20 9v6"/></svg>`,
  // abraço: duas pessoas
  `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="11" r="5"/><circle cx="26" cy="11" r="5"/><path d="M5 34c0-8 4-13 9-13s7 3 6 6M35 34c0-8-4-13-9-13s-7 3-6 6"/><path d="M11 26c5 4 13 4 18 0"/></svg>`,
  // café
  `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M7 16h22v8a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z"/><path d="M29 19h3a4 4 0 0 1 0 8h-4"/><path d="M14 5c-2 3 2 4 0 7M20 5c-2 3 2 4 0 7"/></svg>`,
  // coração com eletrocardiograma
  `<svg viewBox="0 0 40 40" aria-hidden="true"><path class="fill" d="M20 34S5 25 5 14a7.5 7.5 0 0 1 15-2 7.5 7.5 0 0 1 15 2c0 11-15 20-15 20z"/><path class="ecg" d="M6 19h8l2-5 3 10 3-8 2 3h10"/></svg>`,
]

export function fichaHTML() {
  return `
  <section class="ficha" id="ficha" data-section="02" data-title="Ficha" aria-labelledby="ficha-t">
    <div class="ficha-head">
      <div class="eyebrow" data-reveal>${f.eyebrow}</div>
      <h2 class="display" id="ficha-t" data-reveal><span>${f.titulo[0]}</span><span class="red">${f.titulo[1]}</span></h2>
      <p class="ficha-intro" data-reveal>${f.intro}</p>
      <span class="stamp stamp--acid ficha-stamp" aria-hidden="true">${f.carimbo}</span>
    </div>

    <div class="tag-wrap" data-reveal>
      <article class="tag" aria-label="Ficha clínica">
        <div class="tag-clip" aria-hidden="true"></div>
        <header class="tag-top">
          <b>${content.hero.codigo}</b>
          <span class="eyebrow">${f.cabecalho}</span>
        </header>
        <dl class="tag-rows">
          ${f.linhas.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        </dl>
        <div class="tag-rx eyebrow">℞ ${f.prescricaoTitulo}</div>
        <ul class="tag-care">
          ${f.prescricao.map((c, i) => `<li>${icons[i % icons.length]}<span>${c}</span></li>`).join('')}
        </ul>
        <footer class="tag-code" aria-hidden="true">
          <i></i><span>1610 2026 0001 · 1/1</span>
        </footer>
      </article>
    </div>
  </section>`
}

export function initFicha() {
  // a prancheta balança levemente com o mouse
  const tag = document.querySelector('.tag')
  if (!tag || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const wrap = tag.parentElement
  wrap.addEventListener('pointermove', (e) => {
    const r = wrap.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - .5
    tag.style.transform = `rotate(${x * 4}deg)`
  })
  wrap.addEventListener('pointerleave', () => { tag.style.transform = '' })
}
