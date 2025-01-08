<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link">Accueil</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/calendar" class="nav-link">Calendrier</router-link>
                        </li>
                        <li v-if="authStore.user && authStore.user.role === 'Admin'"><router-link to="/admin"
                                class="nav-link">Admin Panel</router-link></li>
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
import { computed } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const user = computed(() => authStore.user);
        const token = computed(() => authStore.token);

        return { authStore, user, token };
    },
    async created() {
        const authStore = useAuthStore();
        if (authStore.token) {
            await authStore.fetchUser();
        }
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