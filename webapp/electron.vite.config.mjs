import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {},
  preload: {},
  publicDir: 'public',
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  },
  optimizeDeps: {
    // onnxruntime-web이 Vite에 의해 미리 번들링되는 것을 방지합니다.
    exclude: ['onnxruntime-web']
  },
  assetsInclude: ['**/*.onnx']
})
