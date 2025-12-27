import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_URL_DEV || 'http://localhost:4001',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes('node_modules')) {
                            if (
                                id.includes('react') ||
                                id.includes('react-dom') ||
                                id.includes('react-router-dom')
                            ) {
                                return 'vendor';
                            }
                            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
                                return 'charts';
                            }
                            if (id.includes('@xyflow/react')) {
                                return 'flow';
                            }
                        }
                    },
                },
            },
        },
    };
});
