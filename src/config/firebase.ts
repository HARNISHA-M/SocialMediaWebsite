// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0bJEgV_enCeayniLyfoWSqG_HvRrpKqw",
    authDomain: "socialmedia-8cb5e.firebaseapp.com",
    projectId: "socialmedia-8cb5e",
    storageBucket: "socialmedia-8cb5e.appspot.com",
    messagingSenderId: "153517965590",
    appId: "1:153517965590:web:5fd94f187258dc0a5d9037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);

// for storing images and files
export const storage = getStorage(app);