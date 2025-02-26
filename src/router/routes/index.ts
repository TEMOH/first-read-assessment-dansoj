import type { RouteRecordRaw } from 'vue-router';
import Home from '@/views/home/index.vue'

// routes should be broken into childrens folder and imported here in case of multiple routes 
export const routes: Array<RouteRecordRaw> = [
    {
        name: 'Home',
        path: '/',
        component: Home
    }
]