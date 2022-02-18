import { defineConfig, searchForWorkspaceRoot } from 'vite'
import * as path from 'path'

export default defineConfig({
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, "../pkg/"),
        './'
      ]
    }
  }
})