import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBT3n-KOtwvc3iK7w11Aa9L5ftweILoTqI",
  authDomain: "listify-35fac.firebaseapp.com",
  databaseURL: "https://listify-35fac-default-rtdb.firebaseio.com",
  projectId: "listify-35fac",
  storageBucket: "listify-35fac.appspot.com",
  messagingSenderId: "851695701545",
  appId: "1:851695701545:web:ea941c107f278189249638",
  measurementId: "G-XY6V02CQ8Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
