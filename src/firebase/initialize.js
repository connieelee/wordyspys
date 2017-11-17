import firebase from 'firebase';

let appInitialized = false;
export default function initFirebaseApp() {
  if (appInitialized) return;
  appInitialized = true;
  firebase.initializeApp({
    apiKey: "AIzaSyBUHnx_5ubhgER6tYjNlapR_QGYbvoM8Gs",
    authDomain: "wordyspys.firebaseapp.com",
    databaseURL: "https://wordyspys.firebaseio.com",
    projectId: "wordyspys",
    storageBucket: "wordyspys.appspot.com",
    messagingSenderId: "621295881525"
  });
}
