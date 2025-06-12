import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import './style.css'
import App from './App.vue'
import "./output.css";
import './tailwind.css'
import router from '@/router/index'
import { scrollAnimation } from './utils/scrollAnimation'
import LinkAttr from "markdown-it-link-attributes";
import { config } from "md-editor-v3";
import { customPlugin } from "@/utils/markdown-it-config";
import { message } from '@/components/my-ui/notifications/notifications'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

config({
  markdownItConfig(mdit) {
    mdit.use(customPlugin);
  },
  markdownItPlugins(plugins) {
    const filteredPlugins = plugins.filter((p) => p.type !== "xss");
    return [
      //...plugins,
      ...filteredPlugins,
      {
        type: "linkAttr",
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            // 如果使用了markdown-it-anchor
            // 应该忽略标题头部的锚点链接
            return !href.startsWith("#");
          },
          attrs: {
            target: "_blank",
          },
        },
      },
    ];
    return plugins.filter((p) => p.type !== "xss");
  },
});

const app = createApp(App)

const pinia = createPinia() // ✅ 创建实例
pinia.use(piniaPluginPersistedstate) // ✅ 注册插件

app.use(pinia)
app.use(router);
app.directive('scroll-animate', scrollAnimation)
window.$message = message
app.mount('#app')
