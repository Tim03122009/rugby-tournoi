import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1wNN07DtwpymwPIN4v-m-6y3LUCPxKmc",
  authDomain: "rugby-21a58.firebaseapp.com",
  // On utilise l'adresse complète avec la région exacte
  databaseURL: "https://rugby-21a58-default-rtdb.europe-west1.firebasedatabase.app/", 
  projectId: "rugby-21a58",
  storageBucket: "rugby-21a58.appspot.com",
  messagingSenderId: "535132438806",
  appId: "1:535132438806:web:a3ef7b1b3ee101c47bd037"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, update };
