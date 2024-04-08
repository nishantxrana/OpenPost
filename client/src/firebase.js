// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "openpost-ea608.firebaseapp.com",
  projectId: "openpost-ea608",
  storageBucket: "openpost-ea608.appspot.com",
  messagingSenderId: "971442820089",
  appId: "1:971442820089:web:bbefd03f84ff2d3543e328"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);