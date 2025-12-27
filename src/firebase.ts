import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5rl0Q7BWoI7E6mz1TTxXrMSGc3UgZaas",
  authDomain: "whatsapp-messaging-a0cb1.firebaseapp.com",
  projectId: "whatsapp-messaging-a0cb1",
  storageBucket: "whatsapp-messaging-a0cb1.firebasestorage.app",
  messagingSenderId: "128415525768",
  appId: "1:128415525768:web:5adb66ac80d44ecc07683d",
  measurementId: "G-7SNSES8KY3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
