// Importeren van de benodigde modules van Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuratie
const firebaseConfig = {
  apiKey: "AIzaSyA2CswfIUCYWO_czyHTCyy_bz59YxgLQ_Y",
  authDomain: "parentvibes-dd47f.firebaseapp.com",
  projectId: "parentvibes-dd47f",
  storageBucket: "parentvibes-dd47f.firebasestorage.app",
  messagingSenderId: "892249103159",
  appId: "1:892249103159:web:62889923f1e476448f58b2"
};

// Initialiseren van Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Functie voor Google login
function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Ingelogd als:", user.displayName);
      // Na inloggen, laat de quotes zien
      loadQuotes();
    })
    .catch((error) => {
      console.error("Fout bij inloggen:", error);
    });
}

// Functie om quotes toe te voegen aan Firestore
async function addQuote(title, text) {
  try {
    const docRef = await addDoc(collection(db, "quotes"), {
      title: title,
      text: text,
      timestamp: serverTimestamp(),
      upvotes: 0,
      downvotes: 0,
    });
    console.log("Quote toegevoegd met ID:", docRef.id);
  } catch (e) {
    console.error("Fout bij toevoegen quote:", e);
  }
}

// Functie om quotes te laden en weer te geven
async function loadQuotes() {
  const querySnapshot = await getDocs(query(collection(db, "quotes"), orderBy("timestamp", "desc"), limit(20)));
  const quotesContainer = document.getElementById("quotes-container");
  quotesContainer.innerHTML = "";  // Verwijder oude quotes

  querySnapshot.forEach((doc) => {
    const quoteData = doc.data();
    const quoteElement = document.createElement("div");
    quoteElement.classList.add("quote");
    quoteElement.innerHTML = `
      <h3>${quoteData.title}</h3>
      <p>${quoteData.text}</p>
      <p><strong>Upvotes:</strong> ${quoteData.upvotes} | <strong>Downvotes:</strong> ${quoteData.downvotes}</p>
    `;
    quotesContainer.appendChild(quoteElement);
  });
}

// Event listener voor de login knop
document.getElementById("login-btn").addEventListener("click", loginWithGoogle);
