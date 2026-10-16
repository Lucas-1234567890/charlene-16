import { content } from '../data/content.js'

const c = content.colecao

// ilustrações SVG de cada look (traço em tinta, detalhes nas cores do sistema)
const ICONES = {
  alvo: `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" class="s"/><circle cx="100" cy="100" r="60" class="s"/><circle cx="100" cy="100" r="34" class="f-red"/><circle cx="100" cy="100" r="10" class="f-paper"/><path d="M100 100 178 22M160 22h18v18" class="s w"/></svg>`,
  time: `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="58" r="22" class="f-red"/><path d="M62 130a38 38 0 0 1 76 0v14H62z" class="f-red"/><circle cx="44" cy="84" r="16" class="s"/><path d="M16 150a28 28 0 0 1 56 0" class="s"/><circle cx="156" cy="84" r="16" class="s"/><path d="M128 150a28 28 0 0 1 56 0" class="s"/><path d="M100 14v18M84 20l6 12M116 20l-6 12" class="s w"/></svg>`,
  sol: `<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="92" r="40" class="f-red"/><g class="s">${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${100 + Math.cos(a) * 52} ${92 + Math.sin(a) * 52}L${100 + Math.cos(a) * 70} ${92 + Math.sin(a) * 70}"/>` }).join('')}</g><path d="M10 150q22-14 45 0t45 0 45 0 45 0M10 172q22-14 45 0t45 0 45 0 45 0" class="s w"/></svg>`,
  foto: `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M100 172S28 128 28 74a36 36 0 0 1 72-10 36 36 0 0 1 72 10c0 54-72 98-72 98z" class="f-red"/><path d="M60 70a18 18 0 0 1 20-14" class="s w"/></svg>`,
  futuro: `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M100 18 116 84 182 100 116 116 100 182 84 116 18 100 84 84z" class="f-red"/><circle cx="100" cy="100" r="12" class="f-paper"/><path d="M40 40l14 14M160 40l-14 14M40 160l14-14M160 160l-14-14" class="s w"/></svg>`,
}

export function colecaoHTML() {
  const total = c.looks.length
  return `
  <section class="conveyor" id="colecao" data-section="06" data-title="Laudos" style="--n:${total}" aria-label="${c.titulo}">
    <div class="conveyor-sticky">
      <div class="conveyor-ui">
        <span class="eyebrow">${c.eyebrow}</span>
        <span class="eyebrow conveyor-count"><b>01</b> / ${String(total).padStart(2, '0')}</span>
      </div>
      <div class="track">
        ${c.looks.map((l, i) => `
          <article class="slide slide-${i % 4}">
            <div class="slide-index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
            <div class="slide-stage">
              <div class="slide-copy">
                <span class="eyebrow">${l.tag} · ${c.titulo}</span>
                <h3 class="slide-title">${l.nome}</h3>
                <p>${l.texto}</p>
              </div>
              <div class="slide-art ${l.icone === 'foto' ? 'has-photo' : ''}">
                ${l.icone === 'foto'
                  ? `<picture><source srcset="/img/charlene-cutout.webp" type="image/webp"><img src="/img/charlene-cutout.png" alt="" width="800" height="785" loading="lazy"></picture>`
                  : ICONES[l.icone] || ''}
                <span class="stamp">${l.tag}</span>
              </div>
            </div>
          </article>`).join('')}
      </div>
      <div class="conveyor-meter" aria-hidden="true"><i></i></div>
    </div>
  </section>`
}

// scroll vertical → trilho horizontal (sticky, sem pin do GSAP)
export function initColecao() {
  const sec = document.getElementById('colecao')
  const track = sec.querySelector('.track')
  const meter = sec.querySelector('.conveyor-meter i')
  const count = sec.querySelector('.conveyor-count b')
  const total = content.colecao.looks.length
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { sec.classList.add('is-static'); return }

  let ticking = false
  const update = () => {
    ticking = false
    const r = sec.getBoundingClientRect()
    const max = sec.offsetHeight - innerHeight
    const p = Math.min(1, Math.max(0, -r.top / max))
    const dist = track.scrollWidth - track.clientWidth
    track.style.transform = `translate3d(${-p * dist}px,0,0)`
    meter.style.transform = `scaleX(${(1 + p * (total - 1)) / total})`
    count.textContent = String(Math.min(total, Math.round(p * (total - 1)) + 1)).padStart(2, '0')
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }, { passive: true })
  addEventListener('resize', update)
  update()
}
