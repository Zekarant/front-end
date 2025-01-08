<script>
import { onMounted } from 'vue';
import { usePronosticStore } from '../store';

export default {
    setup() {
        const store = usePronosticStore();

        onMounted(() => {
            store.fetchPronostics();
        });

        return { store };
    },
};
</script>

<template>
    <div>
        <h1>Pronostics</h1>
        <ul>
            <li v-for="p in store.pronostics" :key="p.id">{{ p.message }}</li>
        </ul>
    </div>
</template>
