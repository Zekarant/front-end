<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="name">Nom :</label>
            <input type="text" v-model="name" required class="form-control"
                placeholder="Saisir votre nom d'utilisateur" />
        </div>
        <div>
            <label for="email">Email :</label>
            <input type="email" v-model="email" required class="form-control" placeholder="Saisir votre email" />
        </div>
        <div>
            <label for="password">Mot de passe :</label>
            <input type="password" v-model="password" required class="form-control"
                placeholder="Saisir votre mot de passe" />
        </div>
        <button type="submit" class="btn btn-outline-primary">S'inscrire</button>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            email: '',
            password: '',
            role: 'Member'
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/auth/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role: this.role
                });
                console.log('User registered:', response.data);
                // Save token and user data in the store
                this.$store.commit('setUser', response.data.user);
                this.$store.commit('setToken', response.data.token);
                // Redirect to home page
                this.$router.push('/');
            } catch (error) {
                console.error('Error registering user:', error);
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
</style>