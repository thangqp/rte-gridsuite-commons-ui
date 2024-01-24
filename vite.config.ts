import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import * as path from 'path';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';
import * as fs from 'fs/promises';
import * as url from 'url';
import { createRequire } from 'node:module';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), eslint(), dts(), svgr(), reactVirtualized()],

    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.jsx'),
            name: 'Commons ui',
            // the proper extensions will be added
            fileName: 'commons-ui',
            formats: ['es'],
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'React',
                },
            },
        },
    },
});


// Workaround for react-virtualized with vite
// https://github.com/bvaughn/react-virtualized/issues/1632#issuecomment-1483966063
function reactVirtualized(): PluginOption {
    const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`
    return {
        name: 'flat:react-virtualized',
        // Note: we cannot use the `transform` hook here
        //       because libraries are pre-bundled in vite directly,
        //       plugins aren't able to hack that step currently.
        //       so instead we manually edit the file in node_modules.
        //       all we need is to find the timing before pre-bundling.
        configResolved: async () => {
            const require = createRequire(import.meta.url)
            const reactVirtualizedPath = require.resolve('react-virtualized')
            const { pathname: reactVirtualizedFilePath } = new url.URL(reactVirtualizedPath, import.meta.url)
            const file = reactVirtualizedFilePath
              .replace(
                path.join('dist', 'commonjs', 'index.js'),
                path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
              )
            const code = await fs.readFile(file, 'utf-8')
            const modified = code.replace(WRONG_CODE, '')
            await fs.writeFile(file, modified)
        },
    }
}
