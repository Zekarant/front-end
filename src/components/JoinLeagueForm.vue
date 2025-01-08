<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/JoinLeagueForm.vue -->
<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="league">Sélectionner une ligue à rejoindre :</label>
            <select v-model="leagueId" required class="form-select">
                <option value="" disabled>Sélectionner une ligue</option>
                <option v-for="league in leagues" :key="league._id" :value="league._id">{{ league.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-outline-success">Rejoindre la ligue</button>
    </form>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            leagueId: '',
            leagues: []
        };
    },
    async created() {
        const authStore = useAuthStore();
        console.log('Token:', authStore.token); // Ajoutez cette ligne pour vérifier le token
        try {
            const response = await axios.get('https://back-end-ml6y.onrender.com/api/leagues', {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.leagues = response.data;
        } catch (error) {
            console.error('Error fetching leagues:', error);
        }
    },
    methods: {
        async handleSubmit() {
            const authStore = useAuthStore();
            if (!authStore.user) {
                console.error('User is not logged in');
                return;
            }
            console.log('Token:', authStore.token); // Ajoutez cette ligne pour vérifier le token
            console.log('User:', authStore.user); // Ajoutez cette ligne pour vérifier l'utilisateur
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/leagues/join', {
                    leagueId: this.leagueId,
                    userId: authStore.user._id // Assurez-vous que l'utilisateur est connecté
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Joined league:', response.data);
                // Reset form fields
                this.leagueId = '';
            } catch (error) {
                console.error('Error joining league:', error);
            }
        }
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: auto;
}

div {
    margin-bottom: 10px;
}

label {
    margin-bottom: 5px;
}
</style>