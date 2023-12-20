import React from 'react';
import { AuthProvider } from './src/AuthProvider';
import AppNavigator from './src/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;