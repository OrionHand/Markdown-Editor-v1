import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDOs4NS2coobIPfBHup-kBc3k6m6S9rCfI",
    authDomain: "markdown-db.firebaseapp.com",
    databaseURL: "https://markdown-db-default-rtdb.firebaseio.com",
    projectId: "markdown-db",
    storageBucket: "markdown-db.appspot.com",
    messagingSenderId: "564154491326",
    appId: "1:564154491326:web:21248ccb804e7abcd699ef"
  };

  const fireb = firebase.initializeApp(firebaseConfig);
  const db = fireb.firestore()
  export {db};