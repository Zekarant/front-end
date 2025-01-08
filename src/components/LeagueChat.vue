<!-- filepath: /d:/wamp64/www/projectSportExcel/front-end/src/components/LeagueChat.vue -->
<template>
    <div>
        <div v-for="message in messages" :key="message._id">
            <strong>{{ message.user }}:</strong> {{ message.text }}
        </div>
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
    </div>
</template>

<script>
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            socket: null,
            messages: [],
            newMessage: ''
        };
    },
    async created() {
        const authStore = useAuthStore();
        this.socket = io('http://localhost:5000', {
            withCredentials: true,
            extraHeaders: {
                "my-custom-header": "abcd"
            }
        });
        this.socket.emit('joinLeague', this.$route.params.leagueId);

        this.socket.on('receiveMessage', (message) => {
            this.messages.push(message);
        });

        try {
            const response = await axios.get(`http://localhost:5000/api/messages/${this.$route.params.leagueId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                },
            });
            this.messages = response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    },
    methods: {
        async sendMessage() {
            const authStore = useAuthStore();
            const message = {
                leagueId: this.$route.params.leagueId,
                user: authStore.user.name,
                text: this.newMessage
            };
            this.socket.emit('sendMessage', message);
            this.newMessage = '';
        }
    }
};
</script>

<style scoped>
/* Styles here */
</style>