import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// O build gera um único arquivo dist/index.html (abre com duplo clique, sem servidor).
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
