import { auth, db } from "./firebase-config.js";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("campaignForm");
  const DEFAULT_IMAGE = "images/image_2025-04-09_164426755.png";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first!");
      return window.location.href = "login.html";
    }

    const campaignData = {
      title: document.getElementById("campaign-title").value,
      organizer: document.getElementById("organizer-name").value,
      goal: parseFloat(document.getElementById("funding-goal").value),
      cause: document.getElementById("cause").value,
      description: document.getElementById("description").value,
      image: DEFAULT_IMAGE,
      createdAt: serverTimestamp(),
      userId: user.uid,
      donations: []
    };

    try {
      await addDoc(collection(db, "campaigns"), campaignData);
      alert("Campaign created successfully!");
      window.location.href = "homepage.html";
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error: " + error.message);
    }
  });
});


