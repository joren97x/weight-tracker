import {getFirestore} from 'firebase/firestore'
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyA8mo43dyySdpYQWziwWs-Cglh7Z3kNOC4',
    authDomain: "weight-tracker-e615c.firebaseapp.com",
    projectId: "weight-tracker-e615c",
    storageBucket: "weight-tracker-e615c.appspot.com",
    messagingSenderId: "883616871527",
    appId: "1:883616871527:web:b2eaef1f28306e842bd0c2",
    measurementId: "G-EQ2GZZ9KY5"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)

  export { db, auth }