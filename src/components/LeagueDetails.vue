<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/LeagueDetails.vue -->
<template>
    <div v-if="league">
        <h1>{{ league.name }}</h1>
        <p>Created at: {{ league.created_at }}</p>
        <p>Members: {{ league.members.length }}</p>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            league: null
        };
    },
    async created() {
        const authStore = useAuthStore();
        try {
            const response = await axios.get(`https://back-end-ml6y.onrender.com/api/leagues/${this.$route.params.leagueId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.league = response.data;
        } catch (error) {
            console.error('Error fetching league details:', error);
        }
    }
};
</script>

<style scoped>
/* Styles here */
</style>