import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Signup Handler
document.getElementById('signup-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      createdAt: new Date()
    });
    window.location.href = "index.html";
  } catch (error) {
    document.getElementById('signup-error').textContent = error.message;
  }
});

// Login Handler
document.getElementById('login-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    document.getElementById('login-error').textContent = error.message;
  }
});
