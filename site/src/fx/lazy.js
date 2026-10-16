// Carrega uma cena 3D só quando a seção chega perto da tela,
// e pausa o render loop quando ela sai da tela ou a aba fica oculta.
export function lazyScene(section, load) {
  let scene = null, loading = false, visible = false

  const sync = () => scene && scene.setActive(visible && !document.hidden)
  document.addEventListener('visibilitychange', sync)

  new IntersectionObserver(async ([e]) => {
    if (e.isIntersecting && !scene && !loading) {
      loading = true
      scene = await load()
    }
  }, { rootMargin: '600px 0px' }).observe(section)

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync() }, { rootMargin: '80px 0px' }).observe(section)

  // quando a cena termina de carregar, aplica o estado atual
  const wait = setInterval(() => { if (scene) { sync(); clearInterval(wait) } }, 120)
}
