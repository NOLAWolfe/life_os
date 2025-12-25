import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:4001', // Express Backend
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        chunkSizeWarningLimit: 1000, // Increase warning limit slightly
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
});
