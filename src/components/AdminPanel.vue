<template>
    <div class="container">
        <h2>Panneau d'administration</h2>
        <div class="card p-3">
            <h3>Gérer les utilisateurs</h3>
            <input v-model="userSearchQuery" placeholder="Chercher les utilisateurs" @input="filterUsers"
                class="form-control" />
            <table class="table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user._id">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <select v-model="user.role" @change="updateUserRole(user)" :disabled="isCurrentUser(user)">
                                <option value="Member">Membre</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </td>
                        <td>
                            <button @click="deleteUser(user._id)" :disabled="isCurrentUser(user)"
                                class="btn btn-outline-danger btn-sm">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h3>Gérer les courses</h3>
            <button @click="openAddCourseDialog" class="btn btn-outline-success mb-3">Ajouter une course</button>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nom de la course</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Catégorie</th>
                        <th>Participants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in courses" :key="course._id">
                        <td>{{ course.name }}</td>
                        <td>{{ course.date }}</td>
                        <td>{{ course.type }}</td>
                        <td>{{ course.category }}</td>
                        <td>{{ course.participants.join(', ') }}</td>
                        <td>
                            <button @click="editCourse(course)" class="btn btn-sm btn-outline-primary">Modifier</button>
                            <button @click="deleteCourse(course._id)"
                                class="btn btn-sm btn-outline-danger">Supprimer</button>
                            <button @click="openAnnounceWinnerDialog(course)"
                                class="btn btn-sm btn-outline-success">Annoncer les gagnants</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h3>Gérer les équipes</h3>
            <button @click="openAddTeamDialog" class="btn btn-outline-success mb-3">Ajouter une équipe</button>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nom de l'équipe</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="team in teams" :key="team._id">
                        <td>{{ team.name }}</td>
                        <td>
                            <button @click="deleteTeam(team._id)"
                                class="btn btn-sm btn-outline-danger">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <h3>Gérer les cyclistes</h3>
            <button @click="openAddCyclistDialog" class="btn btn-outline-success mb-3">Ajouter un cycliste</button>
            <table class="table">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Équipe</th>
                        <th>Nationalité</th>
                        <th>Âge</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cyclist in cyclists" :key="cyclist._id">
                        <td>{{ cyclist.firstName }}</td>
                        <td>{{ cyclist.lastName }}</td>
                        <td>{{ cyclist.team }}</td>
                        <td>{{ cyclist.nationality }}</td>
                        <td>{{ cyclist.age }}</td>
                        <td>
                            <button @click="editCyclist(cyclist)"
                                class="btn btn-sm btn-outline-primary">Modifier</button>
                            <button @click="deleteCyclist(cyclist._id)"
                                class="btn btn-sm btn-outline-danger">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showEditDialog" class="dialog">
            <h3>Modifier une course</h3>
            <form @submit.prevent="updateCourse">
                <div>
                    <label for="name">Nom :</label>
                    <input type="text" v-model="selectedCourse.name" required class="form-control" />
                </div>
                <div>
                    <label for="date">Date :</label>
                    <input type="date" v-model="selectedCourse.date" required class="form-control" />
                </div>
                <div>
                    <label for="type">Type :</label>
                    <select v-model="selectedCourse.type" required class="form-select">
                        <option value="Classic">Classic</option>
                        <option value="Tour">Tour</option>
                    </select>
                </div>
                <div>
                    <label for="category">Catégorie :</label>
                    <select v-model="selectedCourse.category" required class="form-select">
                        <option value="Classique 1.1">Classique 1.1</option>
                        <option value="Classique 1.WT">Classique 1.WT</option>
                        <option value="Monument">Monument</option>
                        <option value="Tour 2.1">Tour 2.1</option>
                        <option value="Tour 2.WT">Tour 2.WT</option>
                        <option value="Grand Tour">Grand Tour</option>
                    </select>
                </div>
                <div v-if="selectedCourse.type === 'Classic'">
                    <label for="predictionEndTime">Fin de Prono :</label>
                    <input type="datetime-local" v-model="selectedCourse.predictionEndTime" required
                        class="form-control" />
                </div>
                <div v-if="selectedCourse.type === 'Tour'">
                    <label for="stages">Stages :</label>
                    <div v-for="(stage, index) in selectedCourse.stages" :key="index">
                        <label>Stage {{ index + 1 }} Date:</label>
                        <input type="date" v-model="stage.date" @change="setDefaultPredictionEndTime(index)" required
                            class="form-control" />
                        <label>Fin de Prono:</label>
                        <input type="datetime-local" v-model="stage.predictionEndTime" required class="form-control" />
                        <input type="hidden" v-model="stage.stageNumber" />
                        <button type="button" @click="removeStage(index)"
                            class="btn btn-sm btn-outline-danger">Supprimer le stage</button>
                    </div>
                    <button type="button" @click="addStage" class="btn btn-sm btn-outline-success">Ajouter un
                        stage</button>
                </div>
                <div v-if="selectedCourse.type === 'Tour'">
                    <label for="generalPredictionEndTime">Fin de Prono pour le classement général :</label>
                    <input type="datetime-local" v-model="selectedCourse.generalPredictionEndTime" required
                        class="form-control" />
                </div>
                <button type="submit" class="btn btn-outline-primary">Modifier la course</button>
                <button type="button" @click="closeEditDialog" class="btn btn-outline-secondary">Annuler</button>
            </form>
        </div>
        <div v-if="showAddCyclistDialog" class="dialog">
            <h3>Ajouter un cycliste</h3>
            <form @submit.prevent="addCyclist">
                <div>
                    <label for="firstName">Prénom :</label>
                    <input type="text" v-model="newCyclist.firstName" required class="form-control" />
                </div>
                <div>
                    <label for="lastName">Nom :</label>
                    <input type="text" v-model="newCyclist.lastName" required class="form-control" />
                </div>
                <div>
                    <label for="team">Équipe :</label>
                    <select v-model="newCyclist.team" required class="form-select">
                        <option v-for="team in teams" :key="team._id" :value="team.name">{{ team.name }}</option>
                    </select>
                </div>
                <div>
                    <label for="nationality">Nationalité :</label>
                    <input type="text" v-model="newCyclist.nationality" class="form-control" />
                </div>
                <div>
                    <label for="age">Âge :</label>
                    <input type="number" v-model="newCyclist.age" class="form-control" />
                </div>
                <button type="submit" class="btn btn-outline-primary">Ajouter le cycliste</button>
                <button type="button" @click="closeAddCyclistDialog" class="btn btn-outline-secondary">Annuler</button>
            </form>
        </div>
        <div v-if="showEditCyclistDialog" class="dialog">
            <h3>Modifier un cycliste</h3>
            <form @submit.prevent="updateCyclist">
                <div>
                    <label for="firstName">Prénom :</label>
                    <input type="text" v-model="selectedCyclist.firstName" required class="form-control" />
                </div>
                <div>
                    <label for="lastName">Nom :</label>
                    <input type="text" v-model="selectedCyclist.lastName" required class="form-control" />
                </div>
                <div>
                    <label for="team">Équipe :</label>
                    <select v-model="selectedCyclist.team" required class="form-select">
                        <option v-for="team in teams" :key="team._id" :value="team.name">{{ team.name }}</option>
                    </select>
                </div>
                <div>
                    <label for="nationality">Nationalité :</label>
                    <input type="text" v-model="selectedCyclist.nationality" class="form-control" />
                </div>
                <div>
                    <label for="age">Âge :</label>
                    <input type="number" v-model="selectedCyclist.age" class="form-control" />
                </div>
                <button type="submit" class="btn btn-outline-primary">Modifier le cycliste</button>
                <button type="button" @click="closeEditCyclistDialog" class="btn btn-outline-secondary">Annuler</button>
            </form>
        </div>
        <div v-if="showAddCourseDialog" class="dialog">
            <h3>Ajouter une course</h3>
            <form @submit.prevent="addCourse">
                <div>
                    <label for="name">Nom :</label>
                    <input type="text" v-model="newCourse.name" required class="form-control" />
                </div>
                <div>
                    <label for="date">Date :</label>
                    <input type="date" v-model="newCourse.date" required class="form-control" />
                </div>
                <div>
                    <label for="type">Type :</label>
                    <select v-model="newCourse.type" required class="form-select">
                        <option value="Classic">Classic</option>
                        <option value="Tour">Tour</option>
                    </select>
                </div>
                <div>
                    <label for="category">Catégorie :</label>
                    <select v-model="newCourse.category" required class="form-select">
                        <option value="Classique 1.1">Classique 1.1</option>
                        <option value="Classique 1.WT">Classique 1.WT</option>
                        <option value="Monument">Monument</option>
                        <option value="Tour 2.1">Tour 2.1</option>
                        <option value="Tour 2.WT">Tour 2.WT</option>
                        <option value="Grand Tour">Grand Tour</option>
                    </select>
                </div>
                <div v-if="newCourse.type === 'Classic'">
                    <label for="predictionEndTime">Fin de Prono :</label>
                    <input type="datetime-local" v-model="newCourse.predictionEndTime" required class="form-control" />
                </div>
                <div v-if="newCourse.type === 'Tour'">
                    <label for="stages">Stages :</label>
                    <div v-for="(stage, index) in newCourse.stages" :key="index">
                        <label>Stage {{ index + 1 }} Date:</label>
                        <input type="date" v-model="stage.date" @change="setDefaultPredictionEndTime(index)" required
                            class="form-control" />
                        <label>Fin de Prono:</label>
                        <input type="datetime-local" v-model="stage.predictionEndTime" required class="form-control" />
                        <input type="hidden" v-model="stage.stageNumber" />
                        <button type="button" @click="removeStage(index)"
                            class="btn btn-sm btn-outline-danger">Supprimer le stage</button>
                    </div>
                    <button type="button" @click="addStage" class="btn btn-sm btn-outline-success">Ajouter un
                        stage</button>
                </div>
                <div v-if="newCourse.type === 'Tour'">
                    <label for="generalPredictionEndTime">Fin de Prono pour le classement général :</label>
                    <input type="datetime-local" v-model="newCourse.generalPredictionEndTime" required
                        class="form-control" />
                </div>
                <button type="submit" class="btn btn-outline-primary">Ajouter la course</button>
                <button type="button" @click="closeAddCourseDialog" class="btn btn-outline-secondary">Annuler</button>
            </form>
        </div>
        <div v-if="showAddTeamDialog" class="dialog">
            <h3>Ajouter une équipe</h3>
            <form @submit.prevent="addTeam">
                <div>
                    <label for="teamName">Nom de l'équipe :</label>
                    <input type="text" v-model="newTeam.name" required class="form-control" />
                </div>
                <button type="submit" class="btn btn-outline-primary">Ajouter l'équipe</button>
                <button type="button" @click="closeAddTeamDialog" class="btn btn-outline-secondary">Annuler</button>
            </form>
        </div>
        <div v-if="showAnnounceWinnerDialog" class="dialog">
            <h3>Annoncer les gagnants</h3>
            <form @submit.prevent="announceWinner">
                <div v-for="(winner, index) in selectedWinners" :key="index">
                    <label for="winner">Gagnant {{ index + 1 }} :</label>
                    <select v-model="selectedWinners[index]" class="form-select">
                        <option v-for="team in teams" :key="team._id" :value="team.name">{{ team.name }}</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-outline-primary">Annoncer les gagnants</button>
                <button type="button" @click="closeAnnounceWinnerDialog"
                    class="btn btn-outline-secondary">Annuler</button>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { useAuthStore } from '../store/index';

export default {
    data() {
        return {
            users: [],
            userSearchQuery: '',
            courses: [],
            cyclists: [],
            teams: [],
            selectedCourse: null,
            selectedCyclist: null,
            newCourse: { name: '', date: '', type: '', category: '', participants: [], stages: [], generalPredictionEndTime: '', predictionEndTime: '' },
            newCyclist: { firstName: '', lastName: '', team: '', nationality: '', age: null },
            newTeam: { name: '' },
            selectedWinners: ['', '', ''],
            showEditDialog: false,
            showAddCyclistDialog: false,
            showEditCyclistDialog: false,
            showAddCourseDialog: false,
            showAddTeamDialog: false,
            showAnnounceWinnerDialog: false
        };
    },
    computed: {
        filteredUsers() {
            if (!this.userSearchQuery) {
                return this.users;
            }
            return this.users.filter(user =>
                user.name.toLowerCase().includes(this.userSearchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(this.userSearchQuery.toLowerCase())
            );
        }
    },
    async created() {
        await this.fetchUsers();
        await this.fetchCourses();
        await this.fetchCyclists();
        await this.fetchTeams();
    },
    methods: {
        async fetchUsers() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get('https://back-end-ml6y.onrender.com/api/auth/users', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.users = response.data;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },
        async fetchCourses() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get('https://back-end-ml6y.onrender.com/api/courses', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.courses = response.data;
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        },
        async fetchCyclists() {
            const authStore = useAuthStore();
            try {
                const response = await axios.get('https://back-end-ml6y.onrender.com/api/cyclists', {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.cyclists = response.data;
            } catch (error) {
                console.error('Error fetching cyclists:', error);
            }
        },
        async fetchTeams() {
            try {
                const response = await axios.get('https://back-end-ml6y.onrender.com/api/teams');
                this.teams = response.data;
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        },
        isCurrentUser(user) {
            const authStore = useAuthStore();
            return authStore.user && authStore.user._id === user._id;
        },
        filterUsers() {
            // This function is intentionally left empty because the computed property `filteredUsers` handles the filtering
        },
        async updateUserRole(user) {
            const authStore = useAuthStore();
            try {
                await axios.put('https://back-end-ml6y.onrender.com/api/admin/user/role', {
                    userId: user._id,
                    role: user.role
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                alert('User role updated successfully!');
            } catch (error) {
                console.error('Error updating user role:', error);
            }
        },
        async deleteUser(userId) {
            const authStore = useAuthStore();
            try {
                await axios.delete(`https://back-end-ml6y.onrender.com/api/admin/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                this.users = this.users.filter(user => user._id !== userId);
                alert('User deleted successfully!');
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        },
        editCourse(course) {
            this.selectedCourse = { ...course };
            this.showEditDialog = true;
        },
        closeEditDialog() {
            this.showEditDialog = false;
            this.selectedCourse = null;
        },
        async updateCourse() {
            const authStore = useAuthStore();
            try {
                const response = await axios.put(`https://back-end-ml6y.onrender.com/api/courses/${this.selectedCourse._id}`, this.selectedCourse, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Course updated:', response.data);
                this.closeEditDialog();
                await this.fetchCourses();
            } catch (error) {
                console.error('Error updating course:', error);
            }
        },
        async deleteCourse(courseId) {
            const authStore = useAuthStore();
            try {
                await axios.delete(`https://back-end-ml6y.onrender.com/api/courses/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Course deleted');
                await this.fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        },
        openAnnounceWinnerDialog(course) {
            this.selectedCourse = course;
            this.showAnnounceWinnerDialog = true;
        },
        closeAnnounceWinnerDialog() {
            this.showAnnounceWinnerDialog = false;
            this.selectedCourse = null;
            this.selectedWinners = ['', '', ''];
        },
        async announceWinner() {
            const authStore = useAuthStore();
            try {
                const response = await axios.put(`https://back-end-ml6y.onrender.com/api/courses/${this.selectedCourse._id}/winners`, {
                    winners: this.selectedWinners
                }, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Winners announced:', response.data);
                this.closeAnnounceWinnerDialog();
                await this.fetchCourses();
            } catch (error) {
                console.error('Error announcing winners:', error);
            }
        },
        addStage() {
            this.selectedCourse.stages.push({ date: '', stageNumber: this.selectedCourse.stages.length + 1, predictionEndTime: '' });
        },
        removeStage(index) {
            this.selectedCourse.stages.splice(index, 1);
            // Update stage numbers
            this.selectedCourse.stages.forEach((stage, i) => {
                stage.stageNumber = i + 1;
            });
        },
        setDefaultPredictionEndTime(index) {
            const stageDate = new Date(this.selectedCourse.stages[index].date);
            stageDate.setHours(10, 0, 0, 0); // Set time to 10:00 AM
            this.selectedCourse.stages[index].predictionEndTime = stageDate.toISOString().slice(0, 16);
        },
        openAddCyclistDialog() {
            this.showAddCyclistDialog = true;
        },
        closeAddCyclistDialog() {
            this.showAddCyclistDialog = false;
            this.newCyclist = { firstName: '', lastName: '', team: '', nationality: '', age: null };
        },
        async addCyclist() {
            const authStore = useAuthStore();
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/cyclists', this.newCyclist, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Cyclist added:', response.data);
                this.closeAddCyclistDialog();
                await this.fetchCyclists();
            } catch (error) {
                console.error('Error adding cyclist:', error);
            }
        },
        editCyclist(cyclist) {
            this.selectedCyclist = { ...cyclist };
            this.showEditCyclistDialog = true;
        },
        closeEditCyclistDialog() {
            this.showEditCyclistDialog = false;
            this.selectedCyclist = null;
        },
        async updateCyclist() {
            const authStore = useAuthStore();
            try {
                const response = await axios.put(`https://back-end-ml6y.onrender.com/api/cyclists/${this.selectedCyclist._id}`, this.selectedCyclist, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Cyclist updated:', response.data);
                this.closeEditCyclistDialog();
                await this.fetchCyclists();
            } catch (error) {
                console.error('Error updating cyclist:', error);
            }
        },
        async deleteCyclist(cyclistId) {
            const authStore = useAuthStore();
            try {
                await axios.delete(`https://back-end-ml6y.onrender.com/api/cyclists/${cyclistId}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Cyclist deleted');
                await this.fetchCyclists();
            } catch (error) {
                console.error('Error deleting cyclist:', error);
            }
        },
        openAddCourseDialog() {
            this.showAddCourseDialog = true;
        },
        closeAddCourseDialog() {
            this.showAddCourseDialog = false;
            this.newCourse = { name: '', date: '', type: '', category: '', participants: [], stages: [], generalPredictionEndTime: '', predictionEndTime: '' };
        },
        async addCourse() {
            const authStore = useAuthStore();
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/courses', this.newCourse, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                    },
                });
                console.log('Course added:', response.data);
                this.closeAddCourseDialog();
                await this.fetchCourses();
            } catch (error) {
                console.error('Error adding course:', error);
            }
        },
        openAddTeamDialog() {
            this.showAddTeamDialog = true;
        },
        closeAddTeamDialog() {
            this.showAddTeamDialog = false;
            this.newTeam = { name: '' };
        },
        async addTeam() {
            try {
                const response = await axios.post('https://back-end-ml6y.onrender.com/api/teams', this.newTeam);
                console.log('Team added:', response.data);
                this.closeAddTeamDialog();
                await this.fetchTeams();
            } catch (error) {
                console.error('Error adding team:', error);
            }
        },
        async deleteTeam(teamId) {
            try {
                await axios.delete(`https://back-end-ml6y.onrender.com/api/teams/${teamId}`);
                console.log('Team deleted');
                await this.fetchTeams();
            } catch (error) {
                console.error('Error deleting team:', error);
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

.dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
</style>