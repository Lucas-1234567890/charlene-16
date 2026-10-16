import { content } from '../data/content.js'
import { isSoundOn, setSound, onSoundChange } from '../fx/sound.js'

const LINKS = [['ficha', 'Ficha'], ['bolo', 'Bolo'], ['fitas', 'Fitinhas'], ['numeros', 'Números'], ['colecao', 'Laudos'], ['recados', 'Time'], ['farol', 'Farol']]

export function renderChrome() {
  document.getElementById('rail').innerHTML = `
    <div class="rail-mark">C/16</div>
    <div class="rail-name">${content.nome} · Vitalmed · Salvador</div>
    <div class="rail-count"><span>01/08</span></div>`

  document.getElementById('topbar').innerHTML = `
    <a class="brand" href="#inicio" aria-label="Voltar ao início">CHARLENE/16</a>
    <nav class="top-mid" aria-label="Seções">${LINKS.map(([id, t]) => `<a href="#${id}" data-link="${id}">${t}</a>`).join('')}</nav>
    <div class="top-end">
      <button class="bag sound-toggle" type="button" aria-pressed="false">Som: off</button>
      <a class="bag" href="#bolo">🎂 <span class="hide-xs">Soprar velas</span></a>
    </div>`

  const btn = document.querySelector('.sound-toggle')
  btn.addEventListener('click', () => setSound(!isSoundOn()))
  onSoundChange((on) => { btn.textContent = on ? 'Som: on' : 'Som: off'; btn.setAttribute('aria-pressed', on) })
}

export function initChrome(lenis) {
  const bar = document.querySelector('.progress')
  const count = document.querySelector('.rail-count span')
  const links = [...document.querySelectorAll('.top-mid a')]
  const cursor = document.querySelector('.cursor')
  const sections = [...document.querySelectorAll('[data-section]')]

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll()

  // seção atual → contador do trilho + link ativo + cursor claro em seções escuras
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const s = e.target
      count.textContent = `${s.dataset.section}/08`
      links.forEach((a) => a.classList.toggle('is-active', a.dataset.link === s.id))
      cursor.classList.toggle('on-dark', s.hasAttribute('data-dark'))
    })
  }, { rootMargin: '-45% 0px -50% 0px' })
  sections.forEach((s) => io.observe(s))

  // âncoras com scroll suave (Lenis)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const el = document.querySelector(a.getAttribute('href'))
    if (!el) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'inicio' ? 0 : -document.getElementById('topbar').offsetHeight + 1, duration: 1.6 })
    else el.scrollIntoView({ behavior: 'smooth' })
  })
}
