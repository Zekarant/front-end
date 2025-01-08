<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/CreateLeagueForm.vue -->
<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="name">Nom de la league :</label>
            <input type="text" v-model="name" required class="form-control"
                placeholder="Saisir le nom de votre league" />
        </div>
        <button type="submit" class="btn btn-outline-success">Créer ma ligue</button>
    </form>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            name: ''
        };
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
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/leagues', {
                    name: this.name,
                    userId: authStore.user._id // Assurez-vous que l'utilisateur est connecté
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('League created:', response.data);
                // Reset form fields
                this.name = '';
            } catch (error) {
                console.error('Error creating league:', error);
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