<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="name">Nom :</label>
            <input type="text" v-model="name" required class="form-control" />
        </div>
        <div>
            <label for="date">Date :</label>
            <input type="date" v-model="date" required class="form-control" />
        </div>
        <div>
            <label for="type">Type :</label>
            <select v-model="type" @change="handleTypeChange" required class="form-select">
                <option value="Classic">Classic</option>
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
                <label>Stage {{ index + 1 }} Date:</label>
                <input type="date" v-model="stage.date" @change="setDefaultPredictionEndTime(index)" required
                    class="form-control" />
                <label>Fin de Prono:</label>
                <input type="datetime-local" v-model="stage.predictionEndTime" required class="form-control" />
                <input type="hidden" v-model="stage.stageNumber" />
                <button type="button" @click="removeStage(index)" class="btn btn-sm btn-outline-danger">Supprimer le
                    stage</button>
            </div>
            <button type="button" @click="addStage" class="btn btn-sm btn-outline-success">Ajouter un stage</button>
        </div>
        <div v-if="type === 'Tour'">
            <label for="generalPredictionEndTime">Fin de Prono pour le classement général :</label>
            <input type="datetime-local" v-model="generalPredictionEndTime" required class="form-control" />
        </div>
        <button type="submit" class="btn btn-outline-primary">Ajouter la course</button>
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
            generalPredictionEndTime: ''
        };
    },
    methods: {
        handleTypeChange() {
            if (this.type === 'Tour') {
                this.stages = [{ date: '', stageNumber: 1, predictionEndTime: '' }];
            } else {
                this.stages = [];
            }
        },
        addStage() {
            this.stages.push({ date: '', stageNumber: this.stages.length + 1, predictionEndTime: '' });
        },
        removeStage(index) {
            this.stages.splice(index, 1);
            // Update stage numbers
            this.stages.forEach((stage, i) => {
                stage.stageNumber = i + 1;
            });
        },
        setDefaultPredictionEndTime(index) {
            const stageDate = new Date(this.stages[index].date);
            stageDate.setHours(10, 0, 0, 0); // Set time to 10:00 AM
            this.stages[index].predictionEndTime = stageDate.toISOString().slice(0, 16);
        },
        async handleSubmit() {
            const authStore = useAuthStore();
            try {
                const response = await axios.post('http://localhost:5000/api/courses', {
                    name: this.name,
                    date: this.date,
                    type: this.type,
                    category: this.category,
                    stages: this.stages,
                    generalPredictionEndTime: this.generalPredictionEndTime
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
                this.generalPredictionEndTime = '';
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

input,
select {
    padding: 5px;
    font-size: 16px;
}

button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}

button[type="button"] {
    margin-top: 5px;
}
</style>