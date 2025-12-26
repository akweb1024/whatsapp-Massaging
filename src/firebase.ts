import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, onValue, onDisconnect, set } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const rtdb = getDatabase(app);

onAuthStateChanged(auth, user => {
    if (user) {
        const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
        const isOfflineForDatabase = {
            isOnline: false,
            last_changed: Date.now(),
        };
        const isOnlineForDatabase = {
            isOnline: true,
            last_changed: Date.now(),
        };

        const userStatusFirestoreRef = doc(db, '/users/' + user.uid);
        const isOfflineForFirestore = {
            isOnline: false,
            last_changed: Date.now(),
        };
        const isOnlineForFirestore = {
            isOnline: true,
            last_changed: Date.now(),
        };

        onValue(ref(rtdb, '.info/connected'), (snapshot) => {
            if (snapshot.val() === false) {
                setDoc(userStatusFirestoreRef, isOfflineForFirestore, { merge: true });
                return;
            }

            onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
                set(userStatusDatabaseRef, isOnlineForDatabase);
                setDoc(userStatusFirestoreRef, isOnlineForFirestore, { merge: true });
            });
        });

        // Create user in firestore if they don't exist
        setDoc(userStatusFirestoreRef, { 
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
        }, { merge: true });

    } else {
        // User is signed out
    }
});

export { app, db, auth, storage, rtdb };
