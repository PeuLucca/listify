import React from 'react';
import { AuthProvider } from './src/AuthProvider';
import AppNavigator from './src/AppNavigator';
import './firebaseConfig';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;