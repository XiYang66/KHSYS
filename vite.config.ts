import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: '9182',
        open: true,
        // 端口占用直接退出
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://192.168.3.17:8999/',
                // 允许跨域
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        }
    },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        loaderOptions: {
            scss: {
                additionalData: '@import "@/path/to/your/scss/variables.scss";'
            }
        }
    }
});
