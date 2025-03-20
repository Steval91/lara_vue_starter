import 'primeicons/primeicons.css';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { ZiggyVue } from 'ziggy-js';
import { initializeTheme } from './composables/useAppearance';

// Extend ImportMeta interface for Vite...
declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#f7f7f7',
            100: '#e1e1e1',
            200: '#cfcfcf',
            300: '#b1b1b1',
            400: '#9e9e9e',
            500: '#000000',
            600: '#2d2d2d',
            700: '#1f1f1f',
            800: '#141414',
            900: '#000000',
            950: '#000000',
        },
        focusRing: {
            width: '1px',
            style: 'solid',
            color: '#000000',
            offset: '2.5px',
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .use(PrimeVue, {
                theme: {
                    preset: MyPreset,
                },
                ripple: true,
            })
            .use(ConfirmationService)
            .use(ToastService)
            .directive('ripple', Ripple)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();
