<template>
    <form @submit.prevent="handleSubmit">
        <div>
            <label for="name">Name:</label>
            <input type="text" v-model="name" required />
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" v-model="email" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" v-model="password" required />
        </div>
        <div>
            <label for="role">Role:</label>
            <select v-model="role" required>
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
            </select>
        </div>
        <button type="submit">Register</button>
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
                const response = await axios.post('/api/auth/register', {
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