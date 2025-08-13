import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBgYkPhbl9UKNyhnFQ79MO16z_E0JEwG-4",
    authDomain: "portfolio-96d70.firebaseapp.com",
    projectId: "portfolio-96d70",
    storageBucket: "portfolio-96d70.appspot.com",
    messagingSenderId: "890967655965",
    appId: "1:890967655965:web:2cc72cbb91949d72ef68f4",
    measurementId: "G-T9XM8Z6LYJ"
};

let db, auth;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (e) {
    console.error("Firebase initialization error. Please provide your Firebase config.", e);
    db = null;
    auth = null;
}

export { db, auth };