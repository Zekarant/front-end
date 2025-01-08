<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="name">Nom de la course :</label>
            <input type="text" class="form-control" v-model="name" required placeholder="Saisir le nom de la course" />
        </div>
        <div>
            <label for="date">Date :</label>
            <input type="date" v-model="date" required class="form-control" />
        </div>
        <div>
            <label for="type">Type :</label>
            <select v-model="type" @change="handleTypeChange" required class="form-select">
                <option value="Classic">Classique</option>
                <option value="Tour">Tour</option>
            </select>
        </div>
        <div>
            <label for="category">Catégorie :</label>
            <select v-model="category" required class="form-select">
                <option value="Classique 1.1">Classique 1.1</option>
                <option value="Classique 1.WT">Classique 1.WT</option>
                <option value="Monument">Monument</option>
                <option value="Tour 2.1">Tour 2.1</option>
                <option value="Tour 2.WT">Tour 2.WT</option>
                <option value="Grand Tour">Grand Tour</option>
            </select>
        </div>
        <div v-if="type === 'Tour'">
            <label for="stages">Stages :</label>
            <div v-for="(stage, index) in stages" :key="index">
                <label>Stage {{ index + 1 }} Date :</label>
                <input type="date" v-model="stage.date" required class="form-control" />
                <input type="hidden" v-model="stage.stageNumber" />
                <button type="button" class="btn btn-primary btn-sm" @click="removeStage(index)">Supprimer le
                    stage</button>
            </div>
            <button type="button" @click="addStage" class="btn btn-primary btn-sm">Ajouter un stage</button>
        </div>
        <div>
            <label for="predictionEndTime">Date de fin des pronostics :</label>
            <input type="datetime-local" v-model="predictionEndTime" required class="form-control" />
        </div>
        <button type="submit" class="btn btn-outline-success">Ajouter la course</button>
    </form>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            name: '',
            date: '',
            type: 'Classic',
            category: 'Classique 1.1',
            stages: [],
            predictionEndTime: ''
        };
    },
    methods: {
        handleTypeChange() {
            if (this.type === 'Tour') {
                this.stages = [{ date: '', stageNumber: 1 }];
            } else {
                this.stages = [];
            }
        },
        addStage() {
            this.stages.push({ date: '', stageNumber: this.stages.length + 1 });
        },
        removeStage(index) {
            this.stages.splice(index, 1);
            // Update stage numbers
            this.stages.forEach((stage, i) => {
                stage.stageNumber = i + 1;
            });
        },
        async handleSubmit() {
            const authStore = useAuthStore();
            console.log('Token:', authStore.token); // Ajoutez cette ligne pour vérifier le token
            try {
                const response = await axios.post('http://localhost:5000/api/courses', {
                    name: this.name,
                    date: this.date,
                    type: this.type,
                    category: this.category,
                    stages: this.stages,
                    predictionEndTime: this.predictionEndTime
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Course added:', response.data);
                // Reset form fields
                this.name = '';
                this.date = '';
                this.type = 'Classic';
                this.category = 'Classique 1.1';
                this.stages = [];
                this.predictionEndTime = '';
            } catch (error) {
                console.error('Error adding course:', error);
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