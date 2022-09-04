import firebase from "firebase";

const firebaseApp= firebase.initializeApp ({
    apiKey: "AIzaSyCSt5vWR3BVnvYYB9D60dW8YwhQ-H3LEr8",
    authDomain: "instagram-5c4d3.firebaseapp.com",
    projectId: "instagram-5c4d3",
    storageBucket: "instagram-5c4d3.appspot.com",
    messagingSenderId: "159425829416",
    appId: "1:159425829416:web:08ae1be56c5bd2b29d331d",
    measurementId: "G-LVPHDBL00J"
  });

  const db = firebaseApp.firestore();
  const auth =  firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };