import firebase from 'firebase/app';
import 'firebase/firestore'

let firebaseConfig = {
  apiKey: "AIzaSyDE1CeH_QNpQRpl3VcEcG2UVKvlDGn5Y3k",
  authDomain: "boardapp-7bc08.firebaseapp.com",
  projectId: "boardapp-7bc08",
  storageBucket: "boardapp-7bc08.appspot.com",
  messagingSenderId: "635735442133",
  appId: "1:635735442133:web:e8b451d5c57e5ac5bb985c",
  measurementId: "G-75LYPSLVSM"
};
// Initialize Firebase
if(!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}

export default firebase;