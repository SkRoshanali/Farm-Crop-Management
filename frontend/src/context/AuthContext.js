import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fcm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fcm_token');
    const uInfo  = localStorage.getItem('fcm_user');
    if (stored && uInfo) {
      setToken(stored);
      setUser(JSON.parse(uInfo));
    }
    setLoading(false);
  }, []);

  const login = (tokenVal, userData) => {
    localStorage.setItem('fcm_token', tokenVal);
    localStorage.setItem('fcm_user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fcm_token');
    localStorage.removeItem('fcm_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => ['ADMIN', 'STATE_OFFICER'].includes(user?.role);
  const isOfficer = () => ['STATE_OFFICER', 'DISTRICT_OFFICER'].includes(user?.role);
  const canCreate = () => ['ADMIN', 'STATE_OFFICER', 'DISTRICT_OFFICER', 'DATA_ENTRY_OPERATOR'].includes(user?.role);
  const canUpdate = () => ['ADMIN', 'STATE_OFFICER', 'DISTRICT_OFFICER', 'DATA_ENTRY_OPERATOR'].includes(user?.role);
  const canDelete = () => ['ADMIN', 'STATE_OFFICER', 'DISTRICT_OFFICER'].includes(user?.role);

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, login, logout, 
      isAdmin, isOfficer, canCreate, canUpdate, canDelete 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
