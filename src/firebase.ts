// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5rl0Q7BWoI7E6mz1TTxXrMSGc3UgZaas",
  authDomain: "whatsapp-messaging-a0cb1.firebaseapp.com",
  projectId: "whatsapp-messaging-a0cb1",
  storageBucket: "whatsapp-messaging-a0cb1.appspot.com",
  messagingSenderId: "128415525768",
  appId: "1:128415525768:web:5adb66ac80d44ecc07683d",
  measurementId: "G-7SNSES8KY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
