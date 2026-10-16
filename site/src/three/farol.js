// Farol da Barra low-poly ao pôr do sol, com mar em shader e feixe de luz girando.
// API: createFarol(canvas, { onSweep(glow 0..1) }) → { setActive, dispose }
import * as THREE from 'three'

const COL = { ink: 0x101010, paper: 0xf3efe5, red: 0xf33a2f, blue: 0x123fdd, acid: 0xd9ff00 }

export function createFarol(canvas, { onSweep = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 400)
  const horizon = new THREE.Color(COL.red)

  // ---------------------------------------------------------------- luz do entardecer
  scene.add(new THREE.HemisphereLight(0xffb08a, 0x1b2a6e, 1.3))
  const sunLight = new THREE.DirectionalLight(0xffa070, 2.2)
  sunLight.position.set(-30, 8, -40); scene.add(sunLight)
  const fill = new THREE.DirectionalLight(0x8fa6ff, .6)
  fill.position.set(10, 12, 20); scene.add(fill)

  // ---------------------------------------------------------------- sol
  const sunPos = new THREE.Vector3(-26, 4.2, -90)
  const sun = new THREE.Mesh(new THREE.CircleGeometry(7, 48), new THREE.MeshBasicMaterial({ color: 0xffe2b0, fog: false }))
  sun.position.copy(sunPos); scene.add(sun)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: (() => {
      const c = document.createElement('canvas'); c.width = c.height = 128
      const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
      gr.addColorStop(0, 'rgba(255,220,170,.8)'); gr.addColorStop(.35, 'rgba(255,140,90,.35)'); gr.addColorStop(1, 'rgba(243,58,47,0)')
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128)
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
    })(),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }))
  halo.scale.set(48, 48, 1); halo.position.copy(sunPos).add(new THREE.Vector3(0, 0, 1)); scene.add(halo)

  // ---------------------------------------------------------------- estrelas
  const starGeo = new THREE.BufferGeometry()
  const sp = []
  for (let i = 0; i < 380; i++) {
    const a = Math.random() * Math.PI - Math.PI, e = .12 + Math.random() * .9
    sp.push(Math.cos(a) * Math.cos(e) * 160, Math.sin(e) * 160, Math.sin(a) * Math.cos(e) * 160)
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: COL.paper, size: 1.1, sizeAttenuation: false, transparent: true, opacity: .75 }))
  scene.add(stars)

  // ---------------------------------------------------------------- mar (ondas facetadas)
  const seaMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(0x0d1c66) },
      uShallow: { value: new THREE.Color(COL.blue) },
      uHorizon: { value: horizon },
      uSunDir: { value: new THREE.Vector3().copy(sunPos).normalize() },
      uCam: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */`
      uniform float uTime;
      varying vec3 vWorld;
      float wave(vec2 p){
        return sin(p.x*.35 + uTime*.9)*.22 + sin(p.y*.5 - uTime*1.1)*.18
             + sin((p.x+p.y)*.9 + uTime*1.7)*.07 + sin((p.x*1.7-p.y*1.3) - uTime*2.3)*.04;
      }
      void main(){
        vec3 p = position;
        vec4 w = modelMatrix * vec4(p,1.);
        w.y += wave(w.xz);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uDeep, uShallow, uHorizon, uSunDir, uCam;
      varying vec3 vWorld;
      void main(){
        vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
        if (n.y < 0.) n = -n;
        vec3 v = normalize(uCam - vWorld);
        vec3 h = normalize(uSunDir + v);
        float diff = clamp(dot(n, uSunDir), 0., 1.);
        float spec = pow(clamp(dot(n, h), 0., 1.), 60.);
        float fres = pow(1. - clamp(dot(n, v), 0., 1.), 3.);
        vec3 col = mix(uDeep, uShallow, diff*.6 + .15);
        col = mix(col, uHorizon, fres*.55);
        col += vec3(1., .78, .5) * spec * 1.6;
        float d = length(vWorld.xz - uCam.xz);
        col = mix(col, uHorizon, smoothstep(30., 120., d));
        gl_FragColor = vec4(col, 1.);
      }`,
  })
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(320, 200, 120, 80), seaMat)
  sea.rotation.x = -Math.PI / 2; sea.position.z = -60; scene.add(sea)

  // ---------------------------------------------------------------- farol + forte
  const farol = new THREE.Group(); scene.add(farol)
  const flat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: .85, ...extra })

  const rockMat = flat(0x23212a)
  ;[[0, -.6, 0, 5.2, 1.6, 4.4], [-3.4, -.5, 1.6, 2.6, 1.3, 2.2], [3.3, -.6, 1.2, 2.8, 1.2, 2.4], [1.8, -.7, -2.8, 3, 1.3, 2.4], [-2.4, -.8, -2.4, 2.4, 1, 2]].forEach(([x, y, z, sx, sy, sz], i) => {
    const r = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), rockMat)
    r.position.set(x, y, z); r.scale.set(sx, sy, sz); r.rotation.set(i, i * 2, 0); farol.add(r)
  })
  // forte de Santo Antônio (base poligonal)
  const fortY = .5
  const fort = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.8, 1.5, 8), flat(0xe9dfcf))
  fort.position.y = fortY; farol.add(fort)
  const merlonGeo = new THREE.BoxGeometry(.42, .34, .3)
  const merlonMat = flat(0xe9dfcf)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const m = new THREE.Mesh(merlonGeo, merlonMat)
    m.position.set(Math.cos(a) * 3.15, fortY + .9, Math.sin(a) * 3.15); m.rotation.y = -a; farol.add(m)
  }
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(3.05, 3.05, .08, 8), flat(0x9c8f7c))
  deck.position.y = fortY + .76; farol.add(deck)
  // casinha
  const house = new THREE.Mesh(new THREE.BoxGeometry(1.8, .9, 1.2), flat(0xf3efe5))
  house.position.set(1.4, fortY + 1.2, .6); farol.add(house)
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.25, .55, 4), flat(0xc2564c))
  roof.position.set(1.4, fortY + 1.92, .6); roof.rotation.y = Math.PI / 4; roof.scale.z = .7; farol.add(roof)

  // torre com faixas pretas e brancas
  const towerBase = fortY + .8, towerH = 5.2, bands = 6
  for (let i = 0; i < bands; i++) {
    const r0 = .78 - (i / bands) * .22, r1 = .78 - ((i + 1) / bands) * .22
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, towerH / bands, 16), flat(i % 2 ? COL.ink : COL.paper))
    seg.position.y = towerBase + (i + .5) * (towerH / bands); farol.add(seg)
  }
  const topY = towerBase + towerH
  const gallery = new THREE.Mesh(new THREE.CylinderGeometry(.92, .8, .16, 16), flat(COL.ink))
  gallery.position.y = topY + .08; farol.add(gallery)
  const rail = new THREE.Mesh(new THREE.TorusGeometry(.88, .025, 4, 24), flat(COL.ink))
  rail.rotation.x = Math.PI / 2; rail.position.y = topY + .42; farol.add(rail)
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(.46, .46, .72, 12), new THREE.MeshBasicMaterial({ color: 0xfff2b8 }))
  lantern.position.y = topY + .52; farol.add(lantern)
  const cap = new THREE.Mesh(new THREE.ConeGeometry(.6, .62, 12), flat(COL.ink))
  cap.position.y = topY + 1.19; farol.add(cap)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), flat(COL.ink))
  ball.position.y = topY + 1.55; farol.add(ball)
  const lampLight = new THREE.PointLight(0xffe6a0, 6, 12, 1.5)
  lampLight.position.y = topY + .52; farol.add(lampLight)

  // feixe de luz (dois cones aditivos)
  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uI: { value: 1 } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform float uI; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ float along = pow(vUv.y, 2.2); float edge = pow(abs(dot(vN, vV)), 1.4);
        float a = along * edge * .55 * uI; gl_FragColor = vec4(vec3(1., .93, .7) * a, a); }`,
  })
  const beam = new THREE.Group(); beam.position.y = topY + .52; farol.add(beam)
  const beamLen = 42
  ;[0, Math.PI].forEach((rot) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(4.2, beamLen, 32, 1, true), beamMat)
    cone.rotation.z = Math.PI / 2   // ápice (+y) vai para -x...
    cone.position.x = beamLen / 2   // ...e o deslocamento põe o ápice na lanterna, abrindo em +x
    const holder = new THREE.Group(); holder.rotation.y = rot; holder.add(cone)
    beam.add(holder)
  })

  // ---------------------------------------------------------------- tamanho / enquadramento
  const look = new THREE.Vector3()
  function frame() {
    const portrait = camera.aspect < .9
    farol.position.set(portrait ? 0 : 5.2, 0, 0)
    camera.position.set(portrait ? 0 : -1, portrait ? 3.2 : 2.4, portrait ? 27 : 19)
    look.set(portrait ? 0 : 1.5, portrait ? 8.6 : 4.4, 0)
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h; camera.updateProjectionMatrix(); frame()
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize()

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onMove = (e) => { pointer.tx = e.clientX / innerWidth - .5; pointer.ty = e.clientY / innerHeight - .5 }
  window.addEventListener('pointermove', onMove)

  // ---------------------------------------------------------------- loop
  const clock = new THREE.Clock()
  const dir = new THREE.Vector3(), toCam = new THREE.Vector3(), lampW = new THREE.Vector3()
  const UP = new THREE.Vector3(0, 1, 0)
  let active = false, raf = 0, lastGlow = -1
  function tick() {
    raf = requestAnimationFrame(tick)
    const t = clock.getElapsedTime()
    pointer.x += (pointer.tx - pointer.x) * .04; pointer.y += (pointer.ty - pointer.y) * .04
    const base = camera.position.clone()
    camera.position.x += pointer.x * 2.2; camera.position.y += -pointer.y * .8
    camera.lookAt(look)

    seaMat.uniforms.uTime.value = t
    seaMat.uniforms.uCam.value.copy(camera.position)
    beam.rotation.y = t * .55
    stars.material.opacity = .55 + Math.sin(t * 1.3) * .15

    // quanto o feixe aponta para a câmera → brilho no "16.10"
    dir.set(1, 0, 0).applyAxisAngle(UP, beam.rotation.y)
    lantern.getWorldPosition(lampW)
    toCam.copy(camera.position).sub(lampW).setY(0).normalize()
    // dois feixes opostos: qualquer um apontando para a câmera conta
    const glow = Math.pow(Math.abs(dir.dot(toCam)), 14)
    if (Math.abs(glow - lastGlow) > .01) { onSweep(glow); lastGlow = glow }
    lampLight.intensity = 5 + glow * 10

    renderer.render(scene, camera)
    camera.position.copy(base)
  }
  function setActive(on) {
    if (on === active) return
    active = on
    if (on) tick(); else cancelAnimationFrame(raf)
  }

  return {
    setActive,
    dispose() { setActive(false); ro.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose() },
  }
}
