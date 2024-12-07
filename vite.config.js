import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 代理规则
      '/api': {
        target: 'http://localhost:7071', // 后端服务器地址
        changeOrigin: true, // 改变源
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径
      }
    }
  }
})
