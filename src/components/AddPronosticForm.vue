<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/AddPronosticForm.vue -->
<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="course">Course :</label>
            <select v-model="course_id" @change="fetchCourseDetails" required class="form-select">
                <option value="" disabled>Sélectionner une course</option>
                <option v-for="course in availableCourses" :key="course._id" :value="course._id">{{ course.name }} ({{
                    course.category }})</option>
            </select>
        </div>
        <div v-if="selectedCourse && selectedCourse.type === 'Tour'">
            <label for="stage">Stage :</label>
            <select v-model="stageNumber" required class="form-select">
                <option v-for="stage in selectedCourse.stages" :key="stage.stageNumber" :value="stage.stageNumber">Stage
                    {{ stage.stageNumber }} - {{ stage.date }}</option>
            </select>
        </div>
        <div>
            <label for="cyclist">Sélectionner un cycliste :</label>
            <select v-model="selectedCyclist" required class="form-select">
                <option value="" disabled>Sélectionner un cycliste</option>
                <option v-for="cyclist in cyclists" :key="cyclist._id" :value="cyclist._id">{{ cyclist.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-outline-success">Valider mon pronostique</button>
        <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
    </form>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            course_id: '',
            stageNumber: null,
            selectedCyclist: '',
            courses: [],
            cyclists: [],
            selectedCourse: null,
            errorMessage: ''
        };
    },
    computed: {
        availableCourses() {
            return this.courses.filter(course => !course.isCompleted);
        }
    },
    async created() {
        const authStore = useAuthStore();
        try {
            const coursesResponse = await axios.get('https://back-end-ml6y.onrender.com/api/courses', {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.courses = coursesResponse.data;

            const cyclistsResponse = await axios.get('https://back-end-ml6y.onrender.com/api/cyclists', {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.cyclists = cyclistsResponse.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    },
    methods: {
        async fetchCourseDetails() {
            this.selectedCourse = this.courses.find(course => course._id === this.course_id);
        },
        async handleSubmit() {
            const authStore = useAuthStore();
            try {
                const payload = {
                    user_id: authStore.user._id,
                    course_id: this.course_id,
                    prediction: {
                        cyclist: this.selectedCyclist
                    }
                };
                if (this.selectedCourse.type === 'Tour') {
                    payload.stageNumber = this.stageNumber;
                }
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/pronostics', payload, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Pronostic added:', response.data);
                // Reset form fields
                this.course_id = '';
                this.stageNumber = null;
                this.selectedCyclist = '';
                this.errorMessage = '';
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    this.errorMessage = 'You have already placed a pronostic for this course or stage.';
                } else {
                    console.error('Error adding pronostic:', error);
                }
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

select {
    padding: 5px;
    font-size: 16px;
}

button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>