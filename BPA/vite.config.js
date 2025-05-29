import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desactiva en producción para mejor rendimiento
    minify: 'terser', // Mejor compresión
  },
  define: {
    'process.env': {}, // Necesario para compatibilidad con algunas librerías
  },

})
