<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/Calendar.vue -->
<template>
    <div>
        <vue-cal :events="events" :selected-date="today" :time="false" :disable-views="['years', 'year', 'month']"
            hide-weekends @event-click="openPronosticDialog" />
        <div v-if="showDialog" class="dialog">
            <h3>Faire un pronostic pour la course : {{ selectedEvent.title }} ({{ selectedEvent.category }})</h3>
            <div v-if="selectedEvent.type === 'Tour'">
                <label for="stage">Sélectionner un stage :</label>
                <select v-model="selectedStage" required class="form-select">
                    <option value="" disabled>Sélectionner un stage</option>
                    <option v-for="stage in selectedEvent.stages" :key="stage.stageNumber" :value="stage.stageNumber">
                        Stage {{ stage.stageNumber }} - {{ stage.date }}</option>
                </select>
            </div>
            <div>
                <label for="cyclist">Sélectionner un cycliste :</label>
                <select v-model="selectedCyclist" required class="form-select">
                    <option value="" disabled>Sélectionner un cycliste</option>
                    <option v-for="cyclist in cyclists" :key="cyclist._id" :value="cyclist._id">{{ cyclist.name }}
                    </option>
                </select>
            </div>
            <button @click="submitPronostic" class="btn btn-outline-success">Valider mon pronostic</button>
            <button @click="closeDialog" class="btn btn-outline-secondary">Annuler</button>
        </div>
    </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css'; // Importation du CSS
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    components: {
        VueCal, // Déclare Vue Cal ici
    },
    data() {
        return {
            events: [],
            showDialog: false,
            selectedEvent: null,
            selectedStage: null,
            cyclists: [],
            selectedCyclist: null,
            today: new Date().toISOString().split('T')[0] // Date du jour par défaut
        };
    },
    methods: {
        async fetchCourses() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get('http://localhost:5000/api/courses', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.events = response.data.map(course => ({
                    id: course._id,
                    title: course.name,
                    start: course.date.split('T')[0], // Utilise une chaîne de caractères pour la date
                    end: course.date.split('T')[0], // Utilise une chaîne de caractères pour la date
                    class: 'event-class', // Ajoute une classe pour la couleur
                    type: course.type,
                    category: course.category,
                    stages: course.stages
                }));
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        },
        async fetchCyclists() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get('http://localhost:5000/api/cyclists', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.cyclists = response.data;
            } catch (error) {
                console.error('Error fetching cyclists:', error);
            }
        },
        openPronosticDialog(event) {
            this.selectedEvent = event;
            this.showDialog = true;
        },
        closeDialog() {
            this.showDialog = false;
            this.selectedEvent = null;
            this.selectedStage = null;
            this.selectedCyclist = null;
        },
        async submitPronostic() {
            const authStore = useAuthStore();
            try {
                const payload = {
                    user_id: authStore.user._id,
                    course_id: this.selectedEvent.id,
                    prediction: {
                        cyclist: this.selectedCyclist
                    }
                };
                if (this.selectedEvent.type === 'Tour') {
                    payload.stageNumber = this.selectedStage;
                }
                await axios.post('http://localhost:5000/api/pronostics', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                alert('Pronostic submitted successfully!');
                this.closeDialog();
            } catch (error) {
                console.error('Error submitting pronostic:', error);
            }
        }
    },
    mounted() {
        this.fetchCourses();
        this.fetchCyclists();
    },
};
</script>

<style>
/* Ajoute des styles si nécessaire */
.dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.event-class {
    background-color: #ffcc00;
    /* Couleur de fond pour les événements */
    color: #000;
    /* Couleur du texte pour les événements */
}

form div {
    margin-bottom: 10px;
}

form label {
    margin-bottom: 5px;
}

form select {
    padding: 5px;
    font-size: 16px;
}

form button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}
</style>