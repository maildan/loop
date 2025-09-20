import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: 'src/renderer',
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer/src')
      }
    },
    css: {
      postcss: './postcss.config.js',
    },
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        DEBUG: JSON.stringify(process.env.DEBUG || 'false'),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL || 'debug'),
        VERBOSE_LOGGING: JSON.stringify(process.env.VERBOSE_LOGGING || 'false')
      }
    },
    server: {
      port: 5173,
      host: true
    }
  }
})