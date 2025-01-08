<template>
    <div>
        <h2>Submit your pronostic for {{ courseName }}</h2>
        <input v-model="prediction" placeholder="Enter your prediction" />
        <button @click="submitPronostic">Submit</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['courseId', 'courseName'],
    data() {
        return {
            prediction: '',
        };
    },
    methods: {
        async submitPronostic() {
            await axios.post('/api/pronostics', {
                userId: 1, // Remplacer par l'ID utilisateur réel
                courseId: this.courseId,
                prediction: this.prediction,
            });
            alert('Pronostic submitted!');
        },
    },
};
</script>
