export function playThemeTransition(toDark: boolean, onComplete?: () => void) {
  const overlay = document.createElement('div')
  overlay.className = 'theme-transition-overlay'
  overlay.classList.add(toDark ? 'to-dark' : 'to-light')

  document.body.appendChild(overlay)

  // 强制 reflow，确保动画触发
  overlay.offsetHeight

  overlay.addEventListener('animationend', () => {
    overlay.remove()
    onComplete?.()
  })
}
