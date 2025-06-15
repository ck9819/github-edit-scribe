
import React, { createContext, useContext } from 'react';
import { useAuth } from './hooks/useAuth';
// Removed: import AuthWrapper from './components/AuthWrapper';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthWrapper');
  }
  return context;
};

export const AuthWrapper = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Export useAuth hook for backward compatibility
export { useAuth };

