import firebase from 'firebase';

let appInitialized = false;
export default function initFirebaseApp() {
  if (appInitialized) return;
  appInitialized = true;
  firebase.initializeApp({
    apiKey: 'AIzaSyDtFAAyGdTeX0KqlhNc0wR61BVUa7_SXx0',
    authDomain: 'secret-titles.firebaseapp.com',
    databaseURL: 'https://secret-titles.firebaseio.com',
    projectId: 'secret-titles',
    storageBucket: 'secret-titles.appspot.com',
    messagingSenderId: '799476132267',
  });
}
