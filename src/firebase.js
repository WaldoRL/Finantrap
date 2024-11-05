// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxNfjeXH-ZI5KuP4cZxGvXhq3YenxSrvI",
  authDomain: "finantrap.firebaseapp.com",
  projectId: "finantrap",
  storageBucket: "finantrap.appspot.com",
  messagingSenderId: "146067063126",
  appId: "1:146067063126:web:4a22611da5a28be95a16f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const Auth = getAuth(app);