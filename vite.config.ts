import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 需要引入 path 模块
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //自动识别目录下的组件 组件命名需要是大驼峰 小驼峰不会被自动识别
    //例如：BaseButton.vue(自动识别为 <BaseButton>)
    //myButton.vue(识别不了)
    Components({
      dirs: ['src/components/ui', 'src/components/my-ui'], // 组件目录
      extensions: ['vue'],
      deep: true, // 递归搜索
      dts: true, // 生成类型声明文件
      resolvers: []
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 关键配置
    }
  },
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    cors: true, // 默认启用并允许任何源
    open: false, // 在服务器启动时自动在浏览器中打开应用程序
    port: 8886,
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      '^/api': {
        // target: 'http://localhost:1688',   //代理接口
        target: 'http://localhost:5002',
        changeOrigin: true
        //rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
