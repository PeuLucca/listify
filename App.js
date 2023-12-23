// Core
import React from 'react';

// AuthProvider
import { AuthProvider } from './src/AuthProvider';

// AppNavigator
import AppNavigator from './src/AppNavigator';

// Firebase Config
import './firebaseConfig';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator/>
    </AuthProvider>
  );
};

export default App;
