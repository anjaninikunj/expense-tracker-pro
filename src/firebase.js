import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtoqoDvymCgl2qmCGffcdwvjU8l-iXhUc",
  authDomain: "expense-tracker-pro-98a31.firebaseapp.com",
  projectId: "expense-tracker-pro-98a31",
  storageBucket: "expense-tracker-pro-98a31.firebasestorage.app",
  messagingSenderId: "589613138421",
  appId: "1:589613138421:web:13b3b93e912a227a5de0bc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
