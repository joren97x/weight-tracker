<script setup>

    import {ref} from 'vue'
    import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
    import { useRouter } from 'vue-router';

    const username = ref('')
    const email = ref('')
    const password = ref('')
    const errorMsg = ref('')
    const router = useRouter()
    const loading = ref(false)

    const signUp = () => {
        loading.value = true
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
            .then((userCredential) => {
                updateProfile(getAuth().currentUser, {
                    displayName: username.value
                }).then(()=> {
                    router.push('/')
                })
                
            })
            .catch((error) => {
                loading.value = false
                errorMsg.value = error
            })
    }

</script>

<template>
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
        <v-row justify="center">
            <v-col cols="10" lg="5">
                <v-card class="mx-auto px-6" elevation="20" style="margin-top: 4%;" title="Register">
                    <v-card-item>
                        <v-form @submit.prevent>
                            <v-text-field v-model="username" class="mb-2" clearable label="Username"></v-text-field>
                            <v-text-field v-model="email" class="mb-2" clearable label="Email"></v-text-field>
                            <v-text-field v-model="password" type="password" clearable label="Password" placeholder="Enter your password"></v-text-field>
                            <p class="text-red" v-if="errorMsg">{{ errorMsg }}</p>
                            <br>
                            <v-btn block color="success" :loading="loading" :disabled="loading" size="large" type="submit" variant="elevated" @click="signUp">
                                Sign up
                            </v-btn>
                            <router-link to="/login" style="text-decoration: none;">
                                <v-btn block color="blue" class="mt-2" size="large" type="submit" variant="elevated">
                                    Log in
                                </v-btn>
                            </router-link>
                        </v-form>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-parallax>
</template>