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

// main.ts 或 mounted 生命周期中
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('md-collapse-title')) {
    const body = target.nextElementSibling as HTMLElement;
    if (!body) return;

    const isOpen = body.classList.contains('open');

    if (isOpen) {
      // 收起
      body.style.height = body.scrollHeight + 'px';
      body.offsetHeight; // 强制重绘，确保 transition 执行
      body.style.height = '0';
      body.classList.remove('open');
    } else {
      // 展开
      body.classList.add('open');
      const height = body.scrollHeight;
      body.style.height = '0';
      body.offsetHeight;
      body.style.height = height + 'px';
    }

    // 清除内联 height，防止内容变动影响
    body.addEventListener(
      'transitionend',
      () => {
        if (body.classList.contains('open')) {
          body.style.height = 'auto';
        }
      },
      { once: true }
    );
  }
});



const app = createApp(App)

const pinia = createPinia() // ✅ 创建实例
pinia.use(piniaPluginPersistedstate) // ✅ 注册插件

app.use(pinia)
app.use(router);
app.directive('scroll-animate', scrollAnimation)
window.$message = message
app.mount('#app')
