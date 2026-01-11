
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy_ajAyT8L1vA2lnOMjlr8qLtbSmljK_E",
  authDomain: "agroregistro-e943a.firebaseapp.com",
  projectId: "agroregistro-e943a",
  storageBucket: "agroregistro-e943a.firebasestorage.app",
  messagingSenderId: "179063148942",
  appId: "1:179063148942:web:560773a469a25256bf14df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
