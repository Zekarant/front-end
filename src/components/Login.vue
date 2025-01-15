<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/Login.vue -->
<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="email">Email :</label>
            <input type="email" v-model="email" required class="form-control" placeholder="Saisir votre mail" />
        </div>
        <div>
            <label for="password">Mot de passe :</label>
            <input type="password" v-model="password" required class="form-control"
                placeholder="Saisir votre mot de passe" />
        </div>
        <button type="submit" class="btn btn-outline-primary">Connexion</button>
        <button type="button" class="btn btn-outline-primary" @click="goToRegister">Inscription</button>
    </form>
</template>

<script>
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        async handleSubmit() {
            const authStore = useAuthStore();
            try {
                await authStore.login(this.email, this.password);
                // Redirect to home page
                this.$router.push('/');
            } catch (error) {
                console.error('Error logging in user:', error);
            }
        },
        goToRegister() {
            this.$router.push('/register');
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

input {
    padding: 5px;
    font-size: 16px;
}

button {
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
}
</style>