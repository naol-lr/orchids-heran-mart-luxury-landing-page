'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  isLoginView: boolean;
  setIsLoginView: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isLoggedIn,
        setIsLoggedIn,
        isLoginView,
        setIsLoginView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
