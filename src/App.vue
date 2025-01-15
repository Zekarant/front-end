<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/App.vue -->
<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Cyclisme</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item" v-if="!authStore.user">
                            <a class="nav-link" @click="goToLogin">Se connecter</a>
                        </li>
                        <li class="nav-item d-flex align-items-center" v-else>
                            <span class="nav-link">Bonjour, {{ authStore.user.name }}</span>
                            <a class="nav-link" @click="calendar">Calendrier</a>
                            <a class="nav-link" @click="admin" v-if="authStore.user.role === 'Admin'">Admin</a>
                            <a class="nav-link" @click="logout">Se déconnecter</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <main>
            <router-view />
        </main>
    </div>
</template>

<script>
import { useAuthStore } from './store/index';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        authStore.checkSession();

        const goToLogin = () => {
            router.push('/login');
        };

        const logout = () => {
            authStore.logout();
            router.push('/');
        };

        const calendar = () => {
            router.push('/calendar');
        };

        const admin = () => {
            router.push('/admin');
        };

        return {
            authStore,
            goToLogin,
            logout,
            calendar,
            admin
        };
    }
};
</script>

<style>
/* Styles basiques */
#app {
    font-family: Arial, sans-serif;
    text-align: center;
}
</style>