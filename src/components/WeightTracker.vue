<script setup>

    import {db} from '../firebase.js'
    import {onSnapshot, collection, addDoc, where, query, orderBy } from 'firebase/firestore'
    import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
    import {onMounted, ref} from 'vue'
    import {format, fromUnixTime} from 'date-fns'
    import { useRouter } from 'vue-router'
    import Chart from 'chart.js/auto'

    const router = useRouter()
    const weightChartRef = ref(null)
    const currentUser = ref(null)
    const allWeights = ref([])
    const myWeights = ref([])
    const inputWeight = ref('')
    const welcomeAlert = ref(true)
    const auth = getAuth();
    const loading = ref(false)
    const tab = ref(null)
    let chart

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser.value = user
            const q = query(collection(db, 'weights'), where("userId", "==", currentUser.value.uid), orderBy('date', 'desc'))
            onSnapshot(q, (querySnapshot) => {
                const weightsCollection = []
                const chartData = []
                const chartLabels = []
                querySnapshot.forEach((doc) => {

                    const date = fromUnixTime(doc.data().date.seconds)
                    weightsCollection.push({
                        id: doc.data().id,
                        username: doc.data().username,
                        weight: doc.data().weight,
                        date: format(date, 'PPPpp')
                    })

                    chartData.push(doc.data().weight)
                    chartLabels.push(format(date, 'MMM d, yyy'))
                })

                myWeights.value = weightsCollection
                chart.data.datasets[0].data = chartData
                chart.data.labels = chartLabels
                chart.update()
            })
        } 
    })


    onMounted(async() => {
        const q = query(collection(db, 'weights'), orderBy('date', 'desc'))
        onSnapshot(q, (querySnapshot) => {
            const weightsCollection = []
            querySnapshot.forEach((doc) => {

                const date = fromUnixTime(doc.data().date.seconds)
                weightsCollection.push({
                    id: doc.data().id,
                    username: doc.data().username,
                    weight: doc.data().weight,
                    date: format(date, 'PPPpp')
                })
            })
            allWeights.value = weightsCollection
        })
  
         chart = new Chart(weightChartRef.value.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Your weights in a chart',
                    data: [],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })


    })

    function submit() {
        loading.value = true
        addDoc(collection(db, 'weights'), {
            userId: currentUser.value.uid,
            username: currentUser.value.displayName,
            weight: inputWeight.value,
            date: new Date()
        }).then(() => {
            loading.value = false
            inputWeight.value = ''
        })
    }

    const logout = () => {
        signOut(auth).then(() => {
            currentUser.value = null
            router.push('/login')
        })
    }

</script>

<template>
<v-container>
    <v-row justify="end" class="mt-6" v-if="currentUser">
        <p class="mt-1 me-5"> <v-icon>mdi-account</v-icon> <strong>{{ currentUser.displayName }}</strong></p>
        <v-btn prepend-icon="mdi-logout" color="red" variant="text" @click="logout">Logout</v-btn>
    </v-row>
    <v-row justify="end" class="mt-6" v-else>
        <v-btn prepend-icon="mdi-login" color="blue" variant="text" @click="router.push('/login')">Login</v-btn>
    </v-row>
    <v-row justify="center mt-2">   
        <v-card border title="Weight Tracker" class="my-6">
           <v-card-item>
                <v-alert
                    border="start"
                    v-model="welcomeAlert"
                    closable
                    v-if="currentUser"
                    close-label="Close Alert"
                    :title="`Welcome, ${currentUser.displayName}!`">
                   lorem ipsum dolor urna a orci. Curabitur blandit mollis lacus. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.
                </v-alert>
                <v-alert
                    v-else
                    density="compact"
                    type="error"
                    variant="tonal"
                    title="You are not logged in!"
                    text="Lorem ipsum dolor sit amet consectetur adipunde voluptatem ambatukam fr!"
                ></v-alert>
           </v-card-item>
            <v-card-item>
                <v-text-field 
                    label="Enter your weight" 
                    type="number" 
                    clearable 
                    :disabled="!currentUser"
                    v-model="inputWeight" 
                    variant="solo-filled">
                </v-text-field>
                <v-row justify="end" class="mb-4">
                    <v-btn color="blue" :loading="loading" @click="submit()" :disabled="!currentUser" class="me-4">Go</v-btn>
                </v-row>
                <v-divider></v-divider>
            </v-card-item>
            <v-card-item title="Weight History">
                <canvas ref="weightChartRef"></canvas>
            </v-card-item>
            <v-tabs v-model="tab" bg-color="grey">
                <v-tab value="one">All History</v-tab>
                <v-tab value="two">My History</v-tab>
            </v-tabs>
            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="one">
                        <v-list>
                            <v-list-item border :subtitle="weight.username" v-for="weight in allWeights" :key="weight">
                                <template v-slot:append>
                                    <p class="text-grey">{{ weight.date }}</p>
                                    <!-- <v-btn icon="mdi-delete" size="small" color="red" variant="text"></v-btn> -->
                                </template>
                                {{ weight.weight }}
                            </v-list-item>
                        </v-list>
                    </v-window-item>
                    <v-window-item value="two">
                        <v-list v-if="currentUser">
                            <v-list-item border :subtitle="weight.username" v-for="weight in myWeights" :key="weight">
                                <template v-slot:append>
                                    <p class="text-grey">{{ weight.date }}</p>
                                    <!-- <v-btn icon="mdi-delete" size="small" color="red" variant="text"></v-btn> -->
                                </template>
                                {{ weight.weight }}
                            </v-list-item>
                        <p v-if="myWeights.length <= 0" class="text-center"> You dont have weight history. </p>

                        </v-list>
                        <p v-else class="text-center"> You must login first. </p>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-row>
</v-container>
    
</template>