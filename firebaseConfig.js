import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAuFNJyoxmk3ve0I-MY7758SHd7JiDlW3U',
  // authDomain: 'project-id.listify.com',
  // databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'listify-35fac',
  storageBucket: 'listify-35fac.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'listify-35fac', // OU 1:851695701545:android:d10aeca4d228dedb249638
  // measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
