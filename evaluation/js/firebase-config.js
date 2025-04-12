import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIorGyme-52lYH1nwB50aaDVgqQSGuWIE",
  authDomain: "funding-again.firebaseapp.com",
  projectId: "funding-again",
  storageBucket: "funding-again.firebasestorage.app",
  messagingSenderId: "11917433997",
  appId: "1:11917433997:web:ee657ffae2bb139776d6c4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
