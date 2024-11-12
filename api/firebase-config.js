// api/firebase-config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDxZDflHKZr3h8a7JIKrFPK3uhou8gV3K8",
  authDomain: "ponto-online-36ef9.firebaseapp.com",
  projectId: "ponto-online-36ef9",
  storageBucket: "ponto-online-36ef9.appspot.com",
  messagingSenderId: "1004368254859",
  appId: "1:1004368254859:web:1e826923c71435760d418e",
  measurementId: "G-220YBB4DP5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Exporta o Firestore para uso no backend
