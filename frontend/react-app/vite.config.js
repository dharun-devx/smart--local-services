import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to ensure production builds load properly over file:// protocol
// when double-clicking dist/index.html in File Explorer
function fileProtocolSupport() {
  return {
    name: 'file-protocol-support',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html
          // Remove modulepreload links because browsers block them over file:// with CORS
          .replace(/<link\s+rel=["']modulepreload["'][^>]*>/gi, '')
          // Convert type="module" crossorigin to classic defer script to bypass file:// CORS blocks
          .replace(
            /<script\s+type=["']module["']\s+crossorigin(?:=["'][^"']*["'])?\s+src=(["'][^"']+["'])\s*><\/script>/gi,
            '<script defer src=$1></script>'
          )
          .replace(
            /<script\s+type=["']module["']\s+src=(["'][^"']+["'])\s*><\/script>/gi,
            '<script defer src=$1></script>'
          )
          // Remove crossorigin attribute from stylesheet links
          .replace(
            /<link\s+rel=["']stylesheet["']\s+crossorigin(?:=["'][^"']*["'])?\s+href=(["'][^"']+["'])\s*>/gi,
            '<link rel="stylesheet" href=$1>'
          );
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), fileProtocolSupport()],
  base: './',
})
