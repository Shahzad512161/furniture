
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADj1NWnx5g5inrN0IFew3ZBXBl5Q_aBBQ",
  authDomain: "furniture-ae0f2.firebaseapp.com",
  projectId: "furniture-ae0f2",
  storageBucket: "furniture-ae0f2.firebasestorage.app",
  messagingSenderId: "408239174184",
  appId: "1:408239174184:web:1829d6475c64a132a87b1d",
  measurementId: "G-LJNTEJ79LB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
