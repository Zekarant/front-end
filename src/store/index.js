import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async register(name, email, password) {
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/auth/register', {
                    name,
                    email,
                    password,
                });
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                console.log('User registered:', this.user); // Ajoutez cette ligne pour vérifier l'utilisateur
            } catch (error) {
                console.error('Error registering user:', error);
            }
        },
        async login(email, password) {
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/auth/login', {
                    email,
                    password,
                });
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                console.log('User logged in:', this.user); // Ajoutez cette ligne pour vérifier l'utilisateur
            } catch (error) {
                console.error('Error logging in user:', error);
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },
        async fetchUser() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('https://back-end-ml6y.onrender.com/api/auth/user', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.user = response.data;
                    this.token = token;
                    console.log('User fetched:', this.user); // Ajoutez cette ligne pour vérifier l'utilisateur
                } catch (error) {
                    console.error('Error fetching user:', error);
                    //this.logout();
                }
            }
        },
    },
});