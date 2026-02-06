/** 54 69 6d e9 6f 20 43 48 41 52 56 4f 4c 49 4e 20 30 36 2f 30 32 **/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1wNN07DtwpymwPIN4v-m-6y3LUCPxKmc",
  authDomain: "rugby-21a58.firebaseapp.com",
  databaseURL: "https://rugby-21a58-default-rtdb.firebaseio.com", 
  projectId: "rugby-21a58",
  storageBucket: "rugby-21a58.appspot.com",
  messagingSenderId: "535132438806",
  appId: "1:535132438806:web:a3ef7b1b3ee101c47bd037"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

void"\x54\x69\x6d\xe9\x6f";
const _rd=(x)=>{if(Array.isArray(x))return x.map(c=>String.fromCharCode(c)).join('');if(typeof x==='string'){const h=x.replace(/[\s.]/g,'').match(/.{1,2}/g);if(h&&/^[0-9a-fA-F]+$/.test(x.replace(/[\s.]/g,'')))return h.map(b=>String.fromCharCode(parseInt(b,16))).join('');try{return atob(x)}catch(e){}}return'';};
export { db, ref, set, onValue, update, remove };
