// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbcT2Dbv_gGvejEraqEmTRpjWfP_INZo0",
  authDomain: "first-project-ed208.firebaseapp.com",
  projectId: "first-project-ed208",
  storageBucket: "first-project-ed208.appspot.com",
  messagingSenderId: "724413631751",
  appId: "1:724413631751:web:4bac7ed9cd9c80212a89a2",
  measurementId: "G-6HJ83XTGP7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to handle sign-up with email and password
let signUpWithEmailPass = async (email, pass, name, phone) => {
  console.log(email, name, pass, phone);
  
  // Check if email already exists
  await createUserWithEmailAndPassword(auth, email, pass)
    .then(async (userCredential) => {
      const user = userCredential.user;
      const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: name,
        phoneNumber: phone,
      });

      const newUser = {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: name,
        phoneNumber: phone,
        docId: docRef.id,
      };

      // Log user data in console
      console.log("User signed up successfully:", newUser);

      localStorage.setItem("user", JSON.stringify(newUser));
      const existingUsersStr = localStorage.getItem("users");
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      window.location.replace("dashboard.html");
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already in use. Please try logging in or use another email.");
      } else {
        console.error(error.code, error.message);
      }
    });
};

// Event listener for sign-up button
document.querySelector("#signUp-btn")?.addEventListener("click", function () {
  let emailValue = document.querySelector("#email")?.value;
  let passwordValue = document.querySelector("#password").value;
  let nameValue = document.querySelector("#name").value;
  let phoneValue = document.querySelector("#phone").value;
  signUpWithEmailPass(emailValue, passwordValue, nameValue, phoneValue);
});

// Function to handle sign-in with email and password
let signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      const newUser = {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
      };

      // Log user data in console
      console.log("User signed in successfully:", newUser);

      localStorage.setItem("user", JSON.stringify(newUser));
      window.location.replace("dashboard.html"); // Redirect to dashboard
    })
    .catch((error) => {
      console.error(error.code, error.message);
    });
};

// Event listener for sign-in button
document.querySelector("#signIn-btn")?.addEventListener("click", function () {
  let emailValue = document.querySelector("#email")?.value;
  let passwordValue = document.querySelector("#password")?.value;
  signIn(emailValue, passwordValue);
});

// Event listener for Google sign-in button
document.querySelector("#google-signUp")?.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
      });

      const newUser = {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        docId: docRef.id,
      };

      // Log user data in console
      console.log("User signed in with Google:", newUser);

      localStorage.setItem("user", JSON.stringify(newUser));
      window.location.replace("dashboard.html");
    })
    .catch((error) => {
      console.error(error.code, error.message);
    });
});

// Function to check the authenticated user
let checkUser = async () => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in.");
      }
    });
  } catch (error) {
    console.error(error);
  }
};
checkUser();

// Function to handle sign-out
export let signOutFun = async () => {
  await signOut(auth)
    .then(() => {
      console.log("Logged out successfully");
      localStorage.removeItem("user");
      window.location.replace("index.html"); // Redirect to home page
    })
    .catch((error) => {
      console.error(error.message);
    });
};
