// Detecta sopro no microfone: mede o volume (RMS) e calibra pelo ruído ambiente.
// startMic(onLevel) → Promise<stop()>. onLevel(nivel 0..1, soprando: boolean)
export async function startMic(onLevel) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  })
  const Ctx = window.AudioContext || window.webkitAudioContext
  const ctx = new Ctx()
  await ctx.resume()
  const src = ctx.createMediaStreamSource(stream)
  const an = ctx.createAnalyser(); an.fftSize = 1024
  src.connect(an)
  const buf = new Float32Array(an.fftSize)

  let base = .02, calib = 0, above = 0, raf = 0, last = performance.now()
  const loop = (now) => {
    raf = requestAnimationFrame(loop)
    const dt = now - last; last = now
    an.getFloatTimeDomainData(buf)
    let sum = 0
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
    const rms = Math.sqrt(sum / buf.length)
    if (calib < 500) { calib += dt; base = Math.max(base * .9 + rms * .1, .008); return }
    const thr = Math.max(.07, base * 3.2)
    const level = Math.max(0, Math.min(1, (rms - thr * .6) / (thr * 2.2)))
    above = rms > thr ? above + dt : Math.max(0, above - dt * 2)
    onLevel(level, above > 220)
  }
  raf = requestAnimationFrame(loop)

  return function stop() {
    cancelAnimationFrame(raf)
    stream.getTracks().forEach((t) => t.stop())
    ctx.close()
  }
}
