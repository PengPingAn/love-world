import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
// import './style.css'
import App from './App.vue'
import './tailwind-compilation.css'
import './tailwind.css'
import router from '@/router/index'
import { scrollAnimation } from './utils/scrollAnimation'
import LinkAttr from 'markdown-it-link-attributes'
import { config } from 'md-editor-v3'
import { customPlugin } from './utils/markdown/markdown-it-config'
import { message } from '@/components/my-ui/notifications/notifications'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { initMarkdownCollapse } from './utils/markdown/mdCollapse'
import { initMarkdownCarousel } from './utils/markdown/mdCarousel'
import {
  initHoverCard,
  initCardHoverEffect,
  initFlipCardEffect
} from './utils/markdown/mdHoverLink'
import loading from '@/components/my-ui/loading/loading'

config({
  markdownItConfig(mdit) {
    mdit.use(customPlugin)
  },
  markdownItPlugins(plugins) {
    const filteredPlugins = plugins.filter((p) => p.type !== 'xss')
    return [
      //...plugins,
      ...filteredPlugins,
      {
        type: 'linkAttr',
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            // 如果使用了markdown-it-anchor
            // 应该忽略标题头部的锚点链接
            return !href.startsWith('#')
          },
          attrs: {
            target: '_blank'
          }
        }
      }
    ]
    return plugins.filter((p) => p.type !== 'xss')
  }
})

const app = createApp(App)

const pinia = createPinia() // ✅ 创建实例
pinia.use(piniaPluginPersistedstate) // ✅ 注册插件

app.use(pinia)
app.use(router)
app.directive('scroll-animate', scrollAnimation)
window.$message = message
window.loading = loading as typeof loading
app.mount('#app')

let disposeHoverCard: (() => void) | null = null
let disposeCarousel: (() => void) | null = null
let disposeCollapse: (() => void) | null = null
let disposeFlipCard: (() => void) | null = null
router.afterEach(() => {
  nextTick(() => {
    // 先卸载旧的绑定
    disposeCarousel?.()
    disposeHoverCard?.()
    disposeCollapse?.()
    disposeFlipCard?.()

    // 初始化新绑定
    disposeCarousel = initMarkdownCarousel()
    disposeHoverCard = initHoverCard()
    disposeCollapse = initMarkdownCollapse()
    initCardHoverEffect()

    // 最关键！等 DOM 确实渲染完才执行绑定，返回卸载函数
    disposeFlipCard = initFlipCardEffect()

    requestAnimationFrame(() => {
      setTimeout(() => {
        disposeFlipCard = initFlipCardEffect()
      }, 30) // 延迟 30ms 可根据实际情况调整
    })
  })
})
