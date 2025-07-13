import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd());

    const API_URL = env.VITE_API_URL || "http://localhost:42004";
    const PORT = Number(env.VITE_PORT) || 42003;

    return {
        server: {
            proxy: {
                "/api": {
                    target: API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            },
            port: PORT
        },
        plugins: [react()],
    }
})
