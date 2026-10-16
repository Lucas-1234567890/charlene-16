// Som desligado por padrão. "Parabéns pra você" sintetizado (caixinha de música) com Web Audio.
let ctx = null
let enabled = false
const listeners = new Set()

export function unlockAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return
  if (!ctx) ctx = new Ctx()
  if (ctx.state === 'suspended') ctx.resume()
  // toca um silêncio para destravar no iOS
  const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource()
  s.buffer = b; s.connect(ctx.destination); s.start(0)
}
export const isSoundOn = () => enabled
export function setSound(on) {
  enabled = on
  if (on) unlockAudio()
  listeners.forEach((f) => f(on))
}
export const onSoundChange = (f) => listeners.add(f)

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)

function note(t, freq, dur, out, vol = .22) {
  ;[[1, vol], [2, vol * .28], [4, vol * .08]].forEach(([m, v]) => {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.type = 'sine'; o.frequency.value = freq * m
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(v, t + .012)
    g.gain.exponentialRampToValueAtTime(.0008, t + Math.max(.5, dur * 1.6))
    o.connect(g); g.connect(out)
    o.start(t); o.stop(t + Math.max(.6, dur * 1.7))
  })
}

// [nota MIDI, tempos]
const MELODY = [
  [67, .75], [67, .25], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, .75], [67, .25], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, .75], [67, .25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, .75], [77, .25], [76, 1], [72, 1], [74, 1], [72, 3],
]
const BASS = [[48, 0], [43, 3], [43, 6], [48, 9], [48, 12], [53, 15], [48, 18], [43, 19.5], [48, 21]]

export function playParabens() {
  if (!enabled || !ctx) return
  const beat = .43
  const out = ctx.createGain(); out.gain.value = .9
  const delay = ctx.createDelay(); delay.delayTime.value = .27
  const fb = ctx.createGain(); fb.gain.value = .22
  out.connect(ctx.destination); out.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(ctx.destination)
  let t = ctx.currentTime + .1
  const t0 = t
  MELODY.forEach(([n, b]) => { note(t, midi(n), b * beat, out); t += b * beat })
  BASS.forEach(([n, b]) => note(t0 + b * beat + .01, midi(n), 2 * beat, out, .1))
}

export function blip(freq = 880) {
  if (!enabled || !ctx) return
  note(ctx.currentTime, freq, .08, ctx.destination, .08)
}
