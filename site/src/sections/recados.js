import { content } from '../data/content.js'

const r = content.recados

const row = (p, i, extra = '') => !p.texto ? `
  <div class="accord-row is-name">
    <div class="accord-btn">
      <span class="ac-n">${String(i + 1).padStart(2, '0')}</span>
      <b>${p.nome}</b>
      <span class="ac-c">${p.cargo}</span>
      <i aria-hidden="true">♥</i>
    </div>
  </div>` : `
  <div class="accord-row ${extra}">
    <button class="accord-btn" type="button" aria-expanded="false" aria-controls="rec-${i}" id="rec-b-${i}">
      <span class="ac-n">${extra ? '∞' : String(i + 1).padStart(2, '0')}</span>
      <b>${p.nome}</b>
      <span class="ac-c">${p.cargo}</span>
      <i aria-hidden="true">+</i>
    </button>
    <div class="accord-detail" id="rec-${i}" role="region" aria-labelledby="rec-b-${i}">
      <div><p>${p.texto}</p></div>
    </div>
  </div>`

export function recadosHTML() {
  return `
  <section class="recados" id="recados" data-section="07" data-title="Time" aria-labelledby="rec-t">
    <div class="recados-head">
      <div class="eyebrow" data-reveal>${r.eyebrow}</div>
      <h2 class="display" id="rec-t" data-reveal><span>${r.titulo[0]}</span><span class="red">${r.titulo[1]}</span></h2>
      <p data-reveal>${r.texto}</p>
      <span class="stamp stamp--acid recados-stamp" aria-hidden="true">${r.carimbo}</span>
    </div>
    <div class="accord">
      ${r.lista.map((p, i) => row(p, i)).join('')}
      ${row(r.futuro, r.lista.length, 'is-future')}
    </div>
  </section>`
}

export function initRecados() {
  document.querySelectorAll('.recados .accord-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const rowEl = b.parentElement
      const open = !rowEl.classList.contains('open')
      rowEl.classList.toggle('open', open)
      b.setAttribute('aria-expanded', open)
    })
  })
}
