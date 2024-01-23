import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],

    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.jsx'),
            name: 'Commons ui',
            // the proper extensions will be added
            fileName: 'commons-ui',
            formats: ['es'],
        },
    },
});
