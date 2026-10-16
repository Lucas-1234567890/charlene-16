// CHARLENE/16: boot do site
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections/hero.css'
import './styles/sections/ficha.css'
import './styles/sections/bolo.css'
import './styles/sections/fitas.css'
import './styles/sections/numeros.css'
import './styles/sections/colecao.css'
import './styles/sections/recados.css'
import './styles/sections/finale.css'

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { renderChrome, initChrome } from './sections/chrome.js'
import { runIntro } from './sections/intro.js'
import { heroHTML, initHero } from './sections/hero.js'
import { fichaHTML, initFicha } from './sections/ficha.js'
import { boloHTML, initBolo } from './sections/bolo.js'
import { fitasHTML, initFitas } from './sections/fitas.js'
import { numerosHTML, initNumeros } from './sections/numeros.js'
import { colecaoHTML, initColecao } from './sections/colecao.js'
import { recadosHTML, initRecados } from './sections/recados.js'
import { finaleHTML, initFinale } from './sections/finale.js'
import { initEggs, initCursor } from './fx/eggs.js'

gsap.registerPlugin(ScrollTrigger)

const html = document.documentElement
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
html.classList.add('js')
if (reduced) html.classList.add('reduced')
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// ---------------------------------------------------------------- monta a página
renderChrome()
document.getElementById('app').innerHTML = [
  heroHTML(), fichaHTML(), boloHTML(), fitasHTML(), numerosHTML(), colecaoHTML(), recadosHTML(), finaleHTML(),
].join('')

// ---------------------------------------------------------------- scroll suave
let lenis = null
if (!reduced) {
  lenis = new Lenis({ lerp: .1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  lenis.stop()
}

// ---------------------------------------------------------------- seções
initChrome(lenis)
initHero()
initFicha()
initBolo()
initFitas()
initNumeros(gsap)
initColecao()
initRecados()
initFinale()
initEggs()
initCursor()

// revelar ao rolar
gsap.utils.toArray('[data-reveal]').forEach((el) => {
  if (reduced) return
  gsap.to(el, {
    opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  })
})

// ---------------------------------------------------------------- intro
const timeout = (p, ms = 6000) => Promise.race([p, new Promise((r) => setTimeout(r, ms))])
const decode = (src) => { const i = new Image(); i.src = src; return i.decode() }
const skip = /pular/.test(location.search + location.hash)

const open = () => {
  html.classList.remove('is-locked')
  html.classList.add('is-open')
  window.scrollTo(0, 0)
  if (lenis) lenis.start()
  ScrollTrigger.refresh()
}

if (skip) {
  document.getElementById('intro').classList.add('is-hidden')
  open()
} else {
  runIntro([
    timeout(document.fonts.ready),
    timeout(decode('/img/charlene-cutout.webp').catch(() => decode('/img/charlene-cutout.png'))),
    timeout(import('./three/cake.js')),
  ]).then(open)
}
