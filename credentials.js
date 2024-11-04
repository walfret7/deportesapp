// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Importar Firestore
import { getAuth } from "firebase/auth";  // Importar Auth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChmGzaz7k9prbuVRyonLWs8hMwdt7UzhU",
  authDomain: "log-reg-deportes.firebaseapp.com",
  projectId: "log-reg-deportes",
  storageBucket: "log-reg-deportes.appspot.com",
  messagingSenderId: "823380010157",
  appId: "1:823380010157:web:347238eae75257de5b5224"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(appFirebase);

// Initialize Auth
const auth = getAuth(appFirebase);

export { appFirebase, db };  // Exportar Firestore junto con Firebase