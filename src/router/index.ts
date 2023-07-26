import {createRouter, createWebHashHistory} from 'vue-router';
import StartupView from '@/views/StartupView.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import SettingsView from '@/views/SettingsView.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'startup',
            component: StartupView
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
            children: [
                {path: '', name: 'general', component: () => import('@/components/settings/General.vue')},
                {path: 'split-tunneling', name: 'split-tunneling', component: () => import('@/components/settings/SplitTunneling.vue')}
            ]
        }
    ]
});

router.beforeEach((to, from) => {
    if (to.path !== '/' && to.path !== '/login' && !localStorage.getItem('token')) {
        return {name: 'login'};
    }
});

export default router;
