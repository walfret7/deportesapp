// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export default appFirebase