import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import LeagueDetails from '../components/LeagueDetails.vue';
import LeagueMembers from '../components/LeagueMembers.vue';
import LeagueChat from '../components/LeagueChat.vue';
import LeagueRanking from '../components/LeagueRanking.vue';
import AdminPanel from '../components/AdminPanel.vue';
import { useAuthStore } from '../store/index';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('../components/Calendar.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/league/:leagueId/details',
        name: 'LeagueDetails',
        component: LeagueDetails,
        meta: { requiresAuth: true },
    },
    {
        path: '/league/:leagueId/members',
        name: 'LeagueMembers',
        component: LeagueMembers,
        meta: { requiresAuth: true },
    },
    {
        path: '/league/:leagueId/chat',
        name: 'LeagueChat',
        component: LeagueChat,
        meta: { requiresAuth: true },
    },
    {
        path: '/league/:leagueId/ranking',
        name: 'LeagueRanking',
        component: LeagueRanking,
        meta: { requiresAuth: true },
    },
    {
        path: '/admin',
        name: 'AdminPanel',
        component: AdminPanel,
        meta: { requiresAuth: true, requiresAdmin: true },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_BASE_URL || '/'),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    const isAuthenticated = !!authStore.token;

    if (isAuthenticated && !authStore.user) {
        await authStore.fetchUser();
    }

    const isAdmin = isAuthenticated && authStore.user && authStore.user.role === 'Admin';

    if (requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (requiresAdmin && !isAdmin) {
        next('/');
    } else {
        next();
    }
});

export default router;