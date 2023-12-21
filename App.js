import React, { useEffect } from 'react';
import { AuthProvider } from './src/AuthProvider';
import AppNavigator from './src/AppNavigator';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './firebaseConfig';

const App = () => {
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("USER LOGGED");
      } else {
        console.log("USER NOT LOGGED");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
