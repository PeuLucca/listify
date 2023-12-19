// Core
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const RequireAuth = (WrappedComponent) => {
  const WithAuthentication = (props) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthentication;
};

export default RequireAuth;
