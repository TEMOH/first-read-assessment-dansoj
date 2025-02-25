import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/home/index.vue'

export const routes: Array<RouteRecordRaw> = [
    {
        name: 'Home',
        path: '/',
        component: Home
    }
]