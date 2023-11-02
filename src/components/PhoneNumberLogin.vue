<script setup>

    import {ref, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
    
    const errorMsg = ref('')
    const router = useRouter()
 
    const number = '+639168290756'
    const loading = ref(false)
    let appVerifier
    console.log(number)
    onMounted(() => {
        appVerifier = new RecaptchaVerifier(getAuth(), 'recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                alert("FORDA GO")
            },
            'expired-callback': () => {
                alert("Captcha expired")
            }
        })
    })

    const signIn = () => {
        loading.value = true
        signInWithPhoneNumber(getAuth(), number, appVerifier)
            .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            console.log(confirmationResult)
                alert("CODE SEND?")
            window.confirmationResult = confirmationResult;
            }).catch((error) => {
            // Error; SMS not sen
            console.log(error)
            console.log(error.message)
            alert("ERROR PRE")
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
                            <v-text-field v-model="number" class="mb-2" clearable label="Phone number" ></v-text-field>
                            <p class="text-red" v-if="errorMsg">{{ errorMsg }}</p>
                            <br>
                            <div id="recaptcha-container"></div>
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