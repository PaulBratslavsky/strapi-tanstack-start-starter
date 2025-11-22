import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig(({ mode }) => ({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(), // Must come before viteReact()
    viteReact(),
    // Only use Netlify plugin in production builds
    ...(mode === 'production' ? [netlify()] : []),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  ssr: {
    noExternal: ['@tanstack/react-start', '@tanstack/react-router'],
    external: ['react', 'react-dom'],
  },
}))

export default config
