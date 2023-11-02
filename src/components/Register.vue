<script setup>

    import {ref, onMounted} from 'vue'
    import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
    import { useRouter } from 'vue-router';

    const username = ref('')
    const emailOrPhoneNumber = ref('')
    const password = ref('')
    const errorMsg = ref('')
    const router = useRouter()
    const loading = ref(false)
    const codeSent = ref(false)
    const inputCode = ref('')
    let appVerifier

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

    const signUp = () => {
        loading.value = true
        if(emailOrPhoneNumber.value.includes('@')) {
            createUserWithEmailAndPassword(getAuth(), emailOrPhoneNumber.value, password.value)
            .then((userCredential) => {
                updateProfile(getAuth().currentUser, {
                    displayName: username.value
                })
                .then(()=> {
                    router.push('/')
                })
            })
            .catch((error) => {
                loading.value = false
                errorMsg.value = error
            })
        }
        else {
            signInWithPhoneNumber(getAuth(), emailOrPhoneNumber.value, appVerifier)
                .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                    console.log(confirmationResult)
                    window.confirmationResult = confirmationResult
                    alert("Code verification sent!")
                    codeSent.value = true
                }).catch((error) => {
                    loading.value = false
                    errorMsg.value = error.message
                    alert("Error")
                })
            // .then((userCredential) => {
            //     updateProfile(getAuth().currentUser, {
            //         displayName: username.value
            //     })
            //     .then(()=> {
            //         router.push('/')
            //     })
            // })
            .catch((error) => {
                loading.value = false
                errorMsg.value = error
            })
        }
        
    }
    function confirmCode() {
        loading.value = true
        confirmationResult.confirm(inputCode.value).then((result) => {
                // User signed in successfully.
            updateProfile(getAuth().currentUser, {
                displayName: username.value
            })
            .then(()=> {
                router.push('/')
            })
        }).catch((error) => {
            loading.value = true
            // User couldn't sign in (bad verification code?)
            alert("Bad verification code!")
        });
    }

</script>

<template>
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
        <v-row justify="center">
            <v-col cols="10" lg="5">
                <v-card class="mx-auto px-6" elevation="20" style="margin-top: 4%;" title="Register">
                    <v-card-item>
                        <v-form @submit.prevent class="mt-2">
                            <div v-if="codeSent">
                                <v-text-field label="SMS verification code" v-model="inputCode" placeholder="Enter the verification code" variant="outlined"></v-text-field>
                                <v-btn block variant="outlined" color="blue" :loading="loading" :disabled="loading" @click="confirmCode">Verify</v-btn>
                            </div>
                            <div v-else>
                                <v-text-field variant="outlined" v-model="username" class="mb-2" clearable label="Username"></v-text-field>
                                <v-text-field variant="outlined" v-model="emailOrPhoneNumber" class="mb-2" clearable label="Email or phone number" placeholder="Ex: johndoe@gmail.com or +639123456789"></v-text-field>
                                <v-text-field variant="outlined" v-model="password" type="password" clearable label="Password"></v-text-field>
                                <p class="text-red" v-if="errorMsg">{{ errorMsg }}</p>
                                <div id="recaptcha-container"></div>
                                <v-btn block variant="outlined" color="success" :loading="loading" :disabled="loading" size="large" type="submit" @click="signUp">
                                    Sign up
                                </v-btn>
                                <router-link to="/login" style="text-decoration: none;">
                                    <v-btn block variant="outlined" color="blue" class="mt-2" size="large" type="submit">
                                        Log in
                                    </v-btn>
                                </router-link>
                            </div>
                        </v-form>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-parallax>
</template>