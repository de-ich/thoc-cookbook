// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { httpsCallableFromURL } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID
};

// Initialize Firebase
let firebaseapp;
if (getApps().length > 0) {
    firebaseapp = getApp();
    deleteApp(firebaseapp);
}
firebaseapp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseapp);
export const db = getFirestore(firebaseapp);
export const functions = getFunctions(firebaseapp);

const firebaseFunctionsBaseURL = import.meta.env.VITE_FIREBASE_FUNCTIONSBASEURL;

export const httpsCallable = (name: string) => {
    return httpsCallableFromURL(functions, firebaseFunctionsBaseURL + name);
}