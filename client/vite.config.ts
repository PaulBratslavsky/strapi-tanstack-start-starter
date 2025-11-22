import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(() => ({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  ssr: {
    noExternal: ['@tanstack/react-start', '@tanstack/react-router'],
    external: ['react', 'react-dom'],
  },
  nitro: {},
}))

export default config
