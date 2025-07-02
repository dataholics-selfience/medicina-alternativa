import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHSq8lrFNJn_5vosBUAV6gQXJ8dAmBgsk",
  authDomain: "medicina-alternativa-ac0d5.firebaseapp.com",
  projectId: "medicina-alternativa-ac0d5",
  storageBucket: "medicina-alternativa-ac0d5.firebasestorage.app",
  messagingSenderId: "578241890584",
  appId: "1:578241890584:web:medicina-alternativa",
  measurementId: "G-MEDICINA-ALT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;