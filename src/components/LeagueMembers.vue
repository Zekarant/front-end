<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/LeagueMembers.vue -->
<template>
    <div v-if="league">
        <h1>Members of {{ league.name }}</h1>
        <ul>
            <li v-for="member in league.members" :key="member._id">{{ member.name }}</li>
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
            league: null
        };
    },
    async created() {
        const authStore = useAuthStore();
        try {
            const response = await axios.get(`http://localhost:5000/api/leagues/${this.$route.params.leagueId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.league = response.data;
        } catch (error) {
            console.error('Error fetching league members:', error);
        }
    }
};
</script>

<style scoped>
/* Styles here */
</style>