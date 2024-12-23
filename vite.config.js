import { fileURLToPath, URL } from 'node:url'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 代理规则
      '/work': {
        target: 'http://47.97.10.192:7071/', // 后端服务器地址
        changeOrigin: true, // 改变源
        rewrite: (path) => path.replace(/^\/work/, '/work') // 重写路径
      }
    }
  }
})
