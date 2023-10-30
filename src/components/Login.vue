<script setup>

    import {ref} from 'vue'
    import {useRouter} from 'vue-router'
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
    
    const errorMsg = ref('')
    const router = useRouter()
    const handleFacebookSignIn = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(getAuth(), provider)
    }

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
    }
    
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const signIn = () => {
        loading.value = true
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                router.push('/')
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
                <v-card class="mx-auto px-6" style="margin-top: 4%;" max-width="500" title="Login">
                    <v-card-item>
                        <v-form @submit.prevent>
                            <v-text-field v-model="email" class="mb-2" clearable label="Email"></v-text-field>
                            <v-text-field v-model="password" type="password" clearable label="Password" placeholder="Enter your password"></v-text-field>
                            <p class="text-red" v-if="errorMsg">{{ errorMsg }}</p>
                            <br>
                            <v-btn block color="success" :loading="loading" :disabled="loading" size="large" type="submit" variant="elevated" @click="signIn">
                                Sign In
                            </v-btn>
                            <router-link to="/register" style="text-decoration: none;">
                                <v-btn block color="blue" class="my-2" size="large" type="submit" variant="elevated">
                                    Create Account
                                </v-btn>
                            </router-link>
                        </v-form>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-parallax>
</template>