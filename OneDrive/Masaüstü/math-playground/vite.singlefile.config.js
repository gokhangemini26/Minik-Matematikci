import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

// Config for generating a single HTML file (for email/WhatsApp)
export default defineConfig({
    plugins: [react(), viteSingleFile()],
    base: './', // Relative paths for file:// protocol
    build: {
        outDir: 'dist-mobile' // Separate output directory
    }
})
