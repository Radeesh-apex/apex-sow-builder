import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const src = path.resolve(__dirname, 'src')
const nm  = path.resolve(__dirname, 'node_modules')

// MUI v7 bug: NotchedOutline's rootShouldForwardProp doesn't filter `notched`,
// so it leaks onto the <fieldset> DOM element causing a React warning.
// This plugin patches the one line responsible at transform time.
const patchMuiNotchedOutline: Plugin = {
  name: 'patch-mui-notched-outline',
  transform(code, id) {
    if (id.includes('@mui/material') && id.endsWith('NotchedOutline.js') && code.includes('shouldForwardProp: rootShouldForwardProp')) {
      const patched = code.replaceAll(
        'shouldForwardProp: rootShouldForwardProp',
        "shouldForwardProp: prop => rootShouldForwardProp(prop) && prop !== 'notched'",
      )
      return { code: patched, map: null }
    }
  },
}

export default defineConfig({
  plugins: [react(), patchMuiNotchedOutline],
  base:'/apex-sow-builder/',
  resolve: {
    alias: [
      { find: '@apex-ui/components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@', replacement: src },
      { find: '@assets', replacement: path.resolve(src, 'assets') },
      { find: '@core', replacement: path.resolve(src, 'core') },
      { find: '@shared', replacement: path.resolve(src, 'shared') },
      { find: '@modules', replacement: path.resolve(src, 'modules') },
      { find: '@components', replacement: path.resolve(src, 'components') },
      // Fix: Vite 8 misresolves @mui/material/utils when package type is "commonjs".
      // Explicitly point to the ESM utils barrel so @mui/icons-material can find createSvgIcon.
      { find: /^@mui\/material\/utils$/, replacement: path.resolve(nm, '@mui/material/esm/utils/index.js') },
    ],
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', '@mui/material', '@emotion/react', '@emotion/styled'],
  },
  optimizeDeps: {
    include: ['react-is', 'prop-types', 'hoist-non-react-statics'],
    exclude: ['@mui/material', '@mui/icons-material'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-http': ['axios'],
        },
      },
    },
  },
})
