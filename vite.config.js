import {defineConfig} from 'vite'
import {resolve} from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            include: ['src/**/*'],
            outDir: 'dist'
        })
    ],
    build: {
        assetsInlineLimit: 409600,
        target: 'esnext',
        lib: {
            assetsInlineLimit: 409600,
            name: "shadertoy",
            entry: {
                shadertoy: resolve(__dirname, 'src/index.ts'),
                react: resolve(__dirname, 'src/react/index.ts'),
            },
            formats: ['es'],
        },
        rollupOptions: {
            // Externalize every react / react-dom subpath (incl. react/jsx-runtime) AND the
            // runtime dependency @mediamonks/image-effect-renderer. A library must never bundle
            // its own dependencies or React's runtime.
            external: [
                /^react($|\/)/,
                /^react-dom($|\/)/,
                /^@mediamonks\/image-effect-renderer($|\/)/,
            ],
        },
    }
})
