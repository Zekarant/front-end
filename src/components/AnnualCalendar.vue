<template>
    <div>
        <h2>Vue Annuelle du Calendrier</h2>
        <div class="calendar">
            <div v-for="month in months" :key="month" class="month">
                <h3>{{ month }}</h3>
                <ul>
                    <li v-for="event in getEventsForMonth(month)" :key="event.id">
                        {{ event.start }} - {{ event.title }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        events: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            months: [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ]
        };
    },
    methods: {
        getEventsForMonth(month) {
            const monthIndex = this.months.indexOf(month);
            return this.events.filter(event => new Date(event.start).getMonth() === monthIndex);
        }
    }
};
</script>

<style scoped>
.calendar {
    display: flex;
    flex-wrap: wrap;
}

.month {
    flex: 1 0 21%;
    /* Adjust this value to control the number of months per row */
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.month h3 {
    text-align: center;
}

.month ul {
    list-style-type: none;
    padding: 0;
}

.month li {
    margin: 5px 0;
}
</style>