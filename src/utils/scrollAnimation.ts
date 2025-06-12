import type { App, Directive } from 'vue'

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-active')
      observer.unobserve(entry.target) // 触发一次后取消监听
    }
  })
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
})

export const scrollAnimation: Directive = {
  mounted(el) {
    el.classList.add('before-enter')
    observer.observe(el)
  },
  beforeUnmount(el) {
    observer.unobserve(el)
  }
}
