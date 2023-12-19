import React, { useEffect } from 'react';
import { AuthProvider } from './src/AuthProvider';
import AppNavigator from './src/AppNavigator';
import { initUserTables } from './src/database/dbController';

const App = () => {
  useEffect(() => {
    initUserTables();
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;