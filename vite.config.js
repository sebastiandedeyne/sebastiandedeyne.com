import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/cp.css',
                'resources/css/site.css',
            ],
            refresh: true,
            detectTls: 'sebastiandedeyne.com.test',
        }),
    ],
});
