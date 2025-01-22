// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {
  getAuth,signOut,
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
  deleteField,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbcT2Dbv_gGvejEraqEmTRpjWfP_INZo0",
    authDomain: "first-project-ed208.firebaseapp.com",
    projectId: "first-project-ed208",
    storageBucket: "first-project-ed208.firebasestorage.app",
    messagingSenderId: "724413631751",
    appId: "1:724413631751:web:4bac7ed9cd9c80212a89a2",
    measurementId: "G-6HJ83XTGP7"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app)
// Initialize Firestore
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); //
let signUpWithEmailPass = async (email,pass,name,phone) => {
      console.log(email,name,pass,phone);
  await createUserWithEmailAndPassword(auth, email, pass)
    .then(async(userCredential) => {
      // Signed up
      const user = userCredential.user;
      // console.log("signed up", user);
       const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: name,
        phoneNumber: phone,
      })
        console.log('success',docRef.id)
        const newUser = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: name,
          phoneNumber: phone,
          docId: docRef.id
        };
        const existingUsersStr = localStorage.getItem('users');
        const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        window.location.replace('dashboard.html')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};
document.querySelector("#signUp-btn").addEventListener("click", function () {
  let emailValue = document.querySelector("#email").value;
  let passwordValue = document.querySelector("#password").value;
  let nameValue = document.querySelector("#name").value;
  let phoneValue = document.querySelector("#phone").value;
  signUpWithEmailPass(emailValue,passwordValue,nameValue,phoneValue)
});
let signIn = async () => {
  await signInWithEmailAndPassword(auth, "xyz@gmail.com", "123456")
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("login success: ", user);
      window.location.replace('dashboard.html');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};
// signIn()
/// signup with google
document.querySelector("#google-signUp").addEventListener('click',()=>{
  signInWithPopup(auth, provider)
    .then(async(result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      const docRef = await addDoc(collection(db, "users"), {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
      })
        console.log('success',docRef.id)
        const newUser = {
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          docId: docRef.id
        };
        const existingUsersStr = localStorage.getItem('users');
        const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        window.location.replace('dashboard.html')
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.error(errorMessage)
    });
})
// TO CHECK USER IS LOG-IN OR NOT
let checkUser = async () => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        // ...
      } else {
        // User is signed out
        console.log("signed out");
        // ...
      }
    });
  } catch (error) {
    console.error(error);
  }
};
checkUser();
export let  signOutFun = async()=>{
  await signOut(auth).then(()=>{
          console.log('logged out')
          localStorage.removeItem('users')
          }).catch ((error)=>{
          console.error(error.message)
      
          })
}