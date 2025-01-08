<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/LeagueRanking.vue -->
<template>
    <div v-if="ranking.length">
        <h2>League Ranking</h2>
        <ul>
            <li v-for="member in ranking" :key="member.userId">
                {{ member.name }} - {{ member.points }} points
            </li>
        </ul>
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
            ranking: []
        };
    },
    async created() {
        const authStore = useAuthStore();
        try {
            const response = await axios.get(`https://back-end-ml6y.onrender.com/api/leagues/${this.$route.params.leagueId}/ranking`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.ranking = response.data;
        } catch (error) {
            console.error('Error fetching ranking:', error);
        }
    }
};
</script>

<style scoped>
/* Styles here */
</style>