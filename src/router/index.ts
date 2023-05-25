import {createRouter, createWebHashHistory} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import PlaceholderView from "@/views/PlaceholderView.vue";
import SettingsView from "@/views/SettingsView.vue";
import General from "@/components/options/General.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'placeholder',
            component: PlaceholderView
        },
        {
            path: '/home',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsView,
            children: [ { path: 'general', name: 'general', component: () => import('@/components/options/General.vue')}, { path: 'split-tunneling', name:'split-tunneling', component: () => import('@/components/options/SplitTunneling.vue')} ]
        },
    ]
})

router.beforeEach((to, from) => {
    if (to.path !== '/' && to.path !== '/login' && !localStorage.getItem('token')) {
        return {name: 'login'}
    }
})

export default router
