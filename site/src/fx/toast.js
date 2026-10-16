let el, timer
export function toast(msg, ms = 2600) {
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el) }
  el.textContent = msg
  el.classList.add('is-on')
  clearTimeout(timer); timer = setTimeout(() => el.classList.remove('is-on'), ms)
}
