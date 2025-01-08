<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/Ranking.vue -->
<template>
    <div>
        <h2>Classement</h2>
        <table>
            <thead>
                <tr>
                    <th>Utilisateur</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in ranking" :key="user._id">
                    <td>{{ user.user.name }}</td>
                    <td>{{ user.user.points }}</td>
                </tr>
            </tbody>
        </table>
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
            const response = await axios.get('http://localhost:5000/api/ranking', {
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
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

th {
    background-color: #f4f4f4;
}
</style>