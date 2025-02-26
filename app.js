// Firebase configuratie
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Login met Google
const loginBtn = document.getElementById('login-btn');
const quoteForm = document.getElementById('quote-form');
const submitQuoteBtn = document.getElementById('submit-quote');
const titleInput = document.getElementById('title');
const textInput = document.getElementById('text');

// Login functionaliteit
loginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("Ingelogd als:", user.displayName);
      quoteForm.style.display = 'block';
    })
    .catch((error) => {
      console.log("Fout bij inloggen:", error);
    });
});

// Quote toevoegen
submitQuoteBtn.addEventListener('click', () => {
  const title = titleInput.value;
  const text = textInput.value;

  if (title && text && auth.currentUser) {
    firestore.collection('quotes').add({
      title: title,
      text: text,
      user: auth.currentUser.displayName,
      upvotes: 0,
      downvotes: 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log("Quote toegevoegd!");
      loadQuotes();
      titleInput.value = '';
      textInput.value = '';
    })
    .catch((error) => {
      console.log("Fout bij toevoegen van quote:", error);
    });
  } else {
    alert("Vul alle velden in!");
  }
});

// Quotes laden
const loadQuotes = () => {
  firestore.collection('quotes')
    .orderBy('upvotes', 'desc')
    .limit(20)
    .onSnapshot((snapshot) => {
      const quoteList = document.getElementById('quote-list');
      quoteList.innerHTML = '';  // Clear existing quotes

      snapshot.forEach(doc => {
        const quote = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${quote.title}</strong>: ${quote.text} <br>
          <em>Door: ${quote.user}</em> <br>
          <span>Upvotes: ${quote.upvotes}</span> | 
          <span>Downvotes: ${quote.downvotes}</span>
        `;
        quoteList.appendChild(li);
      });
    });
};

// Oproep om de quotes te laden bij het laden van de pagina
loadQuotes();
