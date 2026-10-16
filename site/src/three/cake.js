// Bolo 3D low-poly montado em código (sem modelo externo).
// API: createCake(canvas, { digits, onCount, onAllOut }) → { blowAll, setBreath, blowSome, relight, setActive, dispose }
import * as THREE from 'three'

const COL = { ink: 0x101010, paper: 0xf3efe5, red: 0xf33a2f, blue: 0x123fdd, acid: 0xd9ff00, muted: 0xd7d2c6 }

// fonte 3x5 para desenhar o numeral com velas
const FONT = {
  0: ['111', '101', '101', '101', '111'],
  1: ['010', '010', '010', '010', '010'],
  2: ['111', '001', '111', '100', '111'],
  3: ['111', '001', '111', '001', '111'],
  4: ['101', '101', '111', '001', '001'],
  5: ['111', '100', '111', '001', '111'],
  6: ['011', '100', '111', '101', '111'],
  7: ['111', '001', '010', '010', '010'],
  8: ['111', '101', '111', '101', '111'],
  9: ['111', '101', '111', '001', '111'],
}

function radialTexture(stops, size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => gr.addColorStop(o, col))
  g.fillStyle = gr; g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

function stripeTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#f3efe5'; g.fillRect(0, 0, 64, 256)
  g.fillStyle = '#123fdd'
  for (let y = -64; y < 320; y += 40) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(64, y + 26); g.lineTo(64, y + 44); g.lineTo(0, y + 18); g.fill()
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

export function createCake(canvas, { digits = '16', onCount = () => {}, onAllOut = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(COL.ink, 14, 26)
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 60)
  const lookAt = new THREE.Vector3(0, 1.1, 0)

  // ---------------------------------------------------------------- luzes
  const hemi = new THREE.HemisphereLight(0xfff4e0, 0x1a1a2e, 1.1)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(4, 9, 6); scene.add(key)
  const rim = new THREE.DirectionalLight(0x6f8cff, 1.2)
  rim.position.set(-6, 3, -5); scene.add(rim)
  const warm = new THREE.PointLight(0xff9a3c, 0, 9, 1.4)
  warm.position.set(0, 3.3, .4); scene.add(warm)

  // ---------------------------------------------------------------- bolo
  const cake = new THREE.Group(); scene.add(cake)
  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .78, metalness: 0, flatShading: true, ...extra })

  // sombra de contato fake
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(0,0,0,.75)'], [.5, 'rgba(0,0,0,.25)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false })
  )
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .005; scene.add(shadow)

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(3.05, 2.85, .14, 40), mat(COL.blue, { roughness: .4 }))
  plate.position.y = .07; cake.add(plate)
  const plateRim = new THREE.Mesh(new THREE.TorusGeometry(3.0, .045, 6, 48), mat(COL.paper))
  plateRim.rotation.x = Math.PI / 2; plateRim.position.y = .15; cake.add(plateRim)

  const L1 = { r: 2.3, h: 1.15, y: .14 }
  const L2 = { r: 1.75, h: .9, y: L1.y + L1.h }
  const layer1 = new THREE.Mesh(new THREE.CylinderGeometry(L1.r, L1.r, L1.h, 22), mat(COL.paper))
  layer1.position.y = L1.y + L1.h / 2; cake.add(layer1)
  const band = new THREE.Mesh(new THREE.CylinderGeometry(L1.r + .025, L1.r + .025, .26, 22), mat(COL.red))
  band.position.y = L1.y + L1.h * .45; cake.add(band)
  const layer2 = new THREE.Mesh(new THREE.CylinderGeometry(L2.r, L2.r, L2.h, 20), mat(COL.paper))
  layer2.position.y = L2.y + L2.h / 2; cake.add(layer2)
  const band2 = new THREE.Mesh(new THREE.CylinderGeometry(L2.r + .02, L2.r + .02, .1, 20), mat(COL.blue))
  band2.position.y = L2.y + .22; cake.add(band2)

  // cobertura ácida + gotas escorrendo
  const topY = L2.y + L2.h
  const icing = new THREE.Mesh(new THREE.CylinderGeometry(L2.r + .05, L2.r + .05, .14, 20), mat(COL.acid, { roughness: .35 }))
  icing.position.y = topY - .02; cake.add(icing)
  const dripMat = mat(COL.acid, { roughness: .35 })
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2 + (i % 2) * .05
    const len = .12 + ((i * 37) % 11) / 11 * .42
    const d = new THREE.Mesh(new THREE.CapsuleGeometry(.075, len, 3, 6), dripMat)
    d.position.set(Math.cos(a) * (L2.r + .03), topY - .05 - len / 2, Math.sin(a) * (L2.r + .03))
    cake.add(d)
  }
  // bolinhas vermelhas no degrau entre as camadas
  const dotMat = mat(COL.red, { roughness: .45 })
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(.15, 0), dotMat)
    s.position.set(Math.cos(a) * 2.04, L1.y + L1.h + .1, Math.sin(a) * 2.04)
    s.rotation.set(a, a * 2, 0); cake.add(s)
  }
  // granulado
  const sprGeo = new THREE.BoxGeometry(.13, .035, .035)
  const sprMats = [mat(COL.red), mat(COL.blue), mat(COL.paper), mat(COL.ink)]
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 90; i++) {
    const r = Math.sqrt(rnd()) * (L2.r - .1), a = rnd() * Math.PI * 2
    const s = new THREE.Mesh(sprGeo, sprMats[i % 4])
    s.position.set(Math.cos(a) * r, topY + .065, Math.sin(a) * r)
    s.rotation.set(0, rnd() * Math.PI, 0); cake.add(s)
  }

  // ---------------------------------------------------------------- velas formando o numeral
  const dots = []
  const chars = String(digits).split('').filter((d) => FONT[d])
  const cols = chars.length * 3 + (chars.length - 1)
  const sp = chars.length > 2 ? .22 : .3
  chars.forEach((ch, ci) => {
    FONT[ch].forEach((row, ri) => {
      ;[...row].forEach((v, x) => {
        if (v === '1') dots.push([(ci * 4 + x - (cols - 1) / 2) * sp, (ri - 2) * sp * 1.4])
      })
    })
  })

  const candleGeo = new THREE.CylinderGeometry(.05, .05, .58, 10)
  const candleMat = new THREE.MeshStandardMaterial({ map: stripeTexture(), roughness: .6 })
  const wickGeo = new THREE.CylinderGeometry(.009, .009, .08, 4)
  const wickMat = new THREE.MeshBasicMaterial({ color: COL.ink })
  const coreGeo = new THREE.SphereGeometry(.045, 10, 8)
  const outerGeo = new THREE.SphereGeometry(.075, 10, 8)
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff6d2 })
  const outerMat = new THREE.MeshBasicMaterial({ color: 0xff8a1f, transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthWrite: false })
  const glowTex = radialTexture([[0, 'rgba(255,200,120,.9)'], [.25, 'rgba(255,140,40,.35)'], [1, 'rgba(255,120,20,0)']])
  const smokeTex = radialTexture([[0, 'rgba(220,215,205,.55)'], [1, 'rgba(220,215,205,0)']], 64)
  const hitGeo = new THREE.SphereGeometry(.17, 6, 4)
  const hitMat = new THREE.MeshBasicMaterial({ visible: false })

  const candles = dots.map(([x, z], i) => {
    const g = new THREE.Group(); g.position.set(x, topY + .05, z)
    const body = new THREE.Mesh(candleGeo, candleMat); body.position.y = .29; g.add(body)
    const wick = new THREE.Mesh(wickGeo, wickMat); wick.position.y = .62; g.add(wick)
    const flame = new THREE.Group(); flame.position.y = .66; g.add(flame)
    const outer = new THREE.Mesh(outerGeo, outerMat); outer.scale.set(1, 2.1, 1); outer.position.y = .07; flame.add(outer)
    const core = new THREE.Mesh(coreGeo, coreMat); core.scale.set(1, 1.9, 1); core.position.y = .05; flame.add(core)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
    glow.scale.set(.6, .6, 1); glow.position.y = .08; flame.add(glow)
    const hit = new THREE.Mesh(hitGeo, hitMat); hit.position.y = .55; hit.userData.i = i; g.add(hit)
    cake.add(g)
    return { g, flame, glow, hit, lit: true, s: 1, phase: i * 1.7, x, z }
  })

  // ---------------------------------------------------------------- fumaça
  const smoke = []
  function puff(c) {
    for (let k = 0; k < 4; k++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, opacity: .7 }))
      const p = new THREE.Vector3(); c.flame.getWorldPosition(p)
      sp.position.copy(p); sp.scale.setScalar(.15)
      sp.userData = { life: 0, dl: 1.4 + k * .25, vx: (Math.random() - .5) * .15, vy: .5 + Math.random() * .3, delay: k * .12 }
      scene.add(sp); smoke.push(sp)
    }
  }

  // ---------------------------------------------------------------- estado
  let litCount = candles.length, breath = 0, done = false
  const count = () => onCount(litCount, candles.length)

  function extinguish(c) {
    if (!c.lit) return false
    c.lit = false; litCount--; puff(c); count()
    if (litCount === 0 && !done) { done = true; setTimeout(onAllOut, 650) }
    return true
  }
  function relight() {
    candles.forEach((c, i) => setTimeout(() => { if (!c.lit) { c.lit = true; litCount++; count() } }, i * 45))
    done = false
  }
  function blowSome(n = 1) {
    // apaga primeiro as velas mais perto da câmera (de onde vem o sopro)
    const lit = candles.filter((c) => c.lit).sort((a, b) => b.z - a.z + (Math.random() - .5) * .25)
    lit.slice(0, n).forEach(extinguish)
  }
  function blowAll() {
    breath = 1
    const lit = candles.filter((c) => c.lit).sort((a, b) => b.z - a.z + (Math.random() - .5) * .3)
    lit.forEach((c, i) => setTimeout(() => extinguish(c), 160 + i * 70))
    setTimeout(() => { breath = 0 }, 300 + lit.length * 70)
  }

  // ---------------------------------------------------------------- interação: tocar nas velas
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
  const hits = candles.map((c) => c.hit)
  function pick(e) {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    return ray.intersectObjects(hits, false)[0]
  }
  const onDown = (e) => {
    const h = pick(e); if (!h) return
    const c0 = candles[h.object.userData.i]
    candles.forEach((c) => { if (Math.hypot(c.x - c0.x, (c.z - c0.z) / 1.4) < sp * 1.05) extinguish(c) })
  }
  const onMove = (e) => {
    pointer.tx = (e.clientX / innerWidth - .5) * 2; pointer.ty = (e.clientY / innerHeight - .5) * 2
    if (e.pointerType !== 'mouse' || !active) return
    const h = pick(e)
    canvas.style.cursor = h && candles[h.object.userData.i].lit ? 'pointer' : ''
  }
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  canvas.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove)
  const onOrient = (e) => { if (e.gamma != null) { pointer.tx = Math.max(-1, Math.min(1, e.gamma / 25)); pointer.ty = Math.max(-1, Math.min(1, (e.beta - 50) / 30)) } }
  window.addEventListener('deviceorientation', onOrient)

  // ---------------------------------------------------------------- tamanho
  let dist = 9
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // em telas em pé, afasta a câmera para o bolo caber inteiro
    dist = camera.aspect < 1 ? 8.2 + (1 - camera.aspect) * 9 : 8.2
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize()

  // ---------------------------------------------------------------- loop
  const clock = new THREE.Clock()
  let active = false, raf = 0, hemiTarget = 1.1
  function frame() {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime
    pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05

    cake.rotation.y = Math.sin(t * .35) * .3 + pointer.x * .3
    const h = dist * (.95 + pointer.y * .08)
    camera.position.set(Math.sin(pointer.x * .15) * dist, lookAt.y + h, Math.cos(pointer.x * .15) * dist)
    camera.lookAt(lookAt)

    candles.forEach((c) => {
      const target = c.lit ? 1 : 0
      c.s += (target - c.s) * (c.lit ? .12 : .28)
      const fl = 1 + Math.sin(t * 13 + c.phase) * .1 + Math.sin(t * 31 + c.phase * 2) * .06
      c.flame.scale.set(c.s * (1 - breath * .3), c.s * fl * (1 + breath * .25), c.s)
      c.flame.rotation.x = -breath * .9 * (.7 + .3 * Math.sin(t * 20 + c.phase))
      c.flame.rotation.z = Math.sin(t * 7 + c.phase) * .06
      c.flame.visible = c.s > .02
      c.glow.material.opacity = .9 - breath * .4
    })

    const ratio = litCount / candles.length
    const flick = 1 + Math.sin(t * 17) * .06 + Math.sin(t * 41) * .04
    warm.intensity += ((ratio * 9) * flick - warm.intensity) * .15
    hemiTarget = done ? .18 : 1.1
    hemi.intensity += (hemiTarget - hemi.intensity) * .04
    key.intensity += ((done ? .25 : 1.6) - key.intensity) * .04

    for (let i = smoke.length - 1; i >= 0; i--) {
      const s = smoke[i], u = s.userData
      if (u.delay > 0) { u.delay -= dt; s.visible = false; continue }
      s.visible = true; u.life += dt
      s.position.y += u.vy * dt; s.position.x += u.vx * dt + Math.sin(u.life * 4) * .002
      s.scale.setScalar(.15 + u.life * .45)
      s.material.opacity = Math.max(0, .6 * (1 - u.life / u.dl))
      if (u.life > u.dl) { scene.remove(s); s.material.dispose(); smoke.splice(i, 1) }
    }
    renderer.render(scene, camera)
  }
  function setActive(on) {
    if (on === active) return
    active = on
    if (on) { clock.getDelta(); frame() } else cancelAnimationFrame(raf)
  }

  count()
  return {
    total: candles.length,
    blowAll, blowSome, relight, setActive,
    setBreath: (v) => { breath = Math.max(0, Math.min(1, v)) },
    get lit() { return litCount },
    dispose() {
      setActive(false); ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onOrient)
      renderer.dispose()
    },
  }
}
