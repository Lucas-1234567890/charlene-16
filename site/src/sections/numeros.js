import { content } from '../data/content.js'

const n = content.numeros

export function numerosHTML() {
  return `
  <section class="numeros" id="numeros" data-section="05" data-title="Números" data-dark aria-labelledby="num-t">
    <div class="index-head">
      <div class="eyebrow" data-reveal>${n.eyebrow}</div>
      <h2 class="display" id="num-t" data-reveal><span>${n.titulo[0]}</span><span class="outline">${n.titulo[1]}</span></h2>
      <p class="eyebrow index-note" data-reveal>${n.nota}</p>
    </div>
    <div class="index-table" role="list">
      ${n.linhas.map((l, i) => `
        <div class="index-row" role="listitem" tabindex="0" data-reveal>
          <span class="ir-n">${String(i + 1).padStart(2, '0')}</span>
          <span class="ir-m">${l.metrica}</span>
          <b class="ir-v" ${typeof l.valor === 'number' ? `data-count="${l.valor}" data-prefix="${l.prefixo || ''}"` : ''}>${typeof l.valor === 'number' ? `${l.prefixo || ''}0` : l.valor}</b>
          <span class="ir-d">${l.detalhe}</span>
        </div>`).join('')}
    </div>
  </section>`
}

export function initNumeros(gsap) {
  document.querySelectorAll('.numeros [data-count]').forEach((el) => {
    const end = +el.dataset.count, pre = el.dataset.prefix
    const obj = { v: 0 }
    gsap.to(obj, {
      v: end, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => { el.textContent = pre + Math.round(obj.v).toLocaleString('pt-BR') },
    })
  })
}
