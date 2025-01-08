<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/views/Home.vue -->
<template>
    <div class="home">
        <h1>Bienvenue sur le Jeu de Pronostics Cyclisme 🚴‍♂️</h1>
        <p>
            Participez avec vos amis à un jeu de pronostics sur les courses cyclistes les plus importantes de la
            saison !
        </p>
        <router-link to="/calendar">
            <button>Voir le calendrier et pronostiquer</button>
        </router-link>
        <hr>
        <div class="container">
            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Ajouter une nouvelle course</h5>
                        </div>
                        <div class="card-body">
                            <AddCourseForm />
                        </div>
                    </div>

                </div>
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Ajouter un pronostic</h5>
                        </div>
                        <div class="card-body">
                            <AddPronosticForm />
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Créer une ligue</h5>
                        </div>
                        <div class="card-body">
                            <CreateLeagueForm />
                        </div>
                    </div>
                </div>
                <div class="col-4 mt-3">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Rejoindre une ligue</h5>
                        </div>
                        <div class="card-body">
                            <JoinLeagueForm />
                        </div>
                    </div>
                </div>
                <div class="col-4 mt-3">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Mes Ligues</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item" v-for="league in leagues" :key="league._id">
                                    <h3>{{ league.name }}</h3>
                                    <router-link
                                        :to="{ name: 'LeagueDetails', params: { leagueId: league._id } }">Détails</router-link>
                                    |
                                    <router-link
                                        :to="{ name: 'LeagueMembers', params: { leagueId: league._id } }">Membres</router-link>
                                    |
                                    <router-link
                                        :to="{ name: 'LeagueChat', params: { leagueId: league._id } }">Chat</router-link>
                                    |
                                    <router-link
                                        :to="{ name: 'LeagueRanking', params: { leagueId: league._id } }">Classement</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-4 mt-3">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">Classement</h5>
                        </div>
                        <div class="card-body">
                            <Ranking />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AddCourseForm from '@/components/AddCourseForm.vue';
import AddPronosticForm from '@/components/AddPronosticForm.vue';
import CreateLeagueForm from '@/components/CreateLeagueForm.vue';
import JoinLeagueForm from '@/components/JoinLeagueForm.vue';
import Ranking from '@/components/Ranking.vue';
import axios from 'axios';
import { useAuthStore } from '@/store/index';

export default {
    name: "Home",
    components: {
        AddCourseForm,
        AddPronosticForm,
        CreateLeagueForm,
        JoinLeagueForm,
        Ranking
    },
    data() {
        return {
            leagues: []
        };
    },
    async created() {
        const authStore = useAuthStore();
        try {
            const response = await axios.get('https://back-end-ml6y.onrender.com/api/leagues', {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.leagues = response.data.filter(league => league.members.includes(authStore.user._id));
        } catch (error) {
            console.error('Error fetching leagues:', error);
        }
    }
};
</script>

<style>
.home {
    text-align: center;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
}

button:hover {
    background-color: #0056b3;
}
</style>