import {createRouter, createWebHistory} from 'vue-router'
import {ref} from 'vue'
import Home from '../components/WeightTracker.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

const auth = getAuth()
const currentUser = ref(null)
onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user
    } else {
        currentUser.value = null
    }
  })
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            beforeEnter: (to, from, next) => {
                console.log(currentUser)
                if(currentUser.value) {
                    next({
                        name: 'Home'
                    })
                }
                else {
                    next()
                }
            }
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
            beforeEnter: (to, from, next) => {
                if(currentUser.value) {
                    next({
                        name: 'Home'
                    })
                }
                else {
                    next()
                }
            }
        }
    ]
})

export default router