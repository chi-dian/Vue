import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import nodeResolve from '@rollup/plugin-node-resolve';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    {
      apply: 'build',
      config: (config) => {
          config.plugins.push(nodeResolve({
              extensions: ['.mjs', '.js', '.ts'],
              exportConditions: ['node']
          }));
      }
  }
  ],
  build: {
    rollupOptions: {
        external: ['node_modules']
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 代理规则
      '/work': {
        target: 'http://localhost:7071', // 后端服务器地址
        changeOrigin: true, // 改变源
        rewrite: (path) => path.replace(/^\/work/, '/work') // 重写路径
      }
    }
  }
})
