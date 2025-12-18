import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCLdKoK6Ln0smICGEXvQCjfVCm6xGKTdg",
  authDomain: "anarcade-portal.firebaseapp.com",
  projectId: "anarcade-portal",
  storageBucket: "anarcade-portal.firebasestorage.app",
  messagingSenderId: "1024653832678",
  appId: "1:1024653832678:web:66cb3afdf0973230cb2627"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos las nuevas funciones también
export { db, collection, addDoc, getDocs, query, where, orderBy, limit };