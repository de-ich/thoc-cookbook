// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_APIKEY,
    authDomain: import.meta.env.FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.FIREBASE_PROJECTID,
    storageBucket: import.meta.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.FIREBASE_APPID
};

// Initialize Firebase
let firebaseapp;
if (getApps().length > 0) {
    firebaseapp = getApp();
    deleteApp(firebaseapp);
}
firebaseapp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseapp);