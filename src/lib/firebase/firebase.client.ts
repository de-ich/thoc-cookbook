// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { httpsCallableFromURL, httpsCallable as firebaseHttpsCallable } from 'firebase/functions';
import { PUBLIC_FIREBASE_APIKEY, PUBLIC_FIREBASE_APPID, PUBLIC_FIREBASE_AUTHDOMAIN, PUBLIC_FIREBASE_FUNCTIONSBASEURL, PUBLIC_FIREBASE_MESSAGINGSENDERID, PUBLIC_FIREBASE_PROJECTID, PUBLIC_FIREBASE_STORAGEBUCKET } from '$env/static/public';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_APIKEY,
    authDomain: PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECTID,
    storageBucket: PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: PUBLIC_FIREBASE_APPID
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

const firebaseFunctionsBaseURL = PUBLIC_FIREBASE_FUNCTIONSBASEURL;

export const httpsCallable = (name: string) => {
    if (firebaseFunctionsBaseURL) {
        // use a custom URL to invoke the function, e.g. for local development
        return httpsCallableFromURL(functions, firebaseFunctionsBaseURL + name);
    } else {
        return firebaseHttpsCallable(functions, name);
    }
}