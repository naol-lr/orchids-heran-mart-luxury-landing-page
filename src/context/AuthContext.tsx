'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';

interface AuthContextType {
  // Modal state
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  isLoginView: boolean;
  setIsLoginView: (val: boolean) => void;

  // Firebase user
  user: User | null;
  userData: any | null;
  isLoggedIn: boolean;
  loading: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateTier: (tier: string) => Promise<void>;
  updateUserData: (data: any) => Promise<void>;

  // Error state
  authError: string | null;
  setAuthError: (val: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeUserData: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Listen to user data in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        unsubscribeUserData = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            setUserData(null);
          }
        });
      } else {
        setUserData(null);
        unsubscribeUserData();
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUserData();
    };
  }, []);

  const formatError = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) return;
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsModalOpen(false);
    } catch (err) {
      setAuthError(formatError(err as AuthError));
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!auth || !db) return;
    setAuthError(null);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }

      // Create Firestore user document
      await setDoc(doc(db, 'users', credential.user.uid), {
        uid: credential.user.uid,
        name: name || '',
        email: email,
        tier: 'none',
        createdAt: new Date().toISOString(),
      });

      setIsModalOpen(false);
    } catch (err) {
      setAuthError(formatError(err as AuthError));
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) return;
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore, if not create
      const userRef = doc(db, 'users', credential.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: credential.user.uid,
          name: credential.user.displayName || '',
          email: credential.user.email || '',
          tier: 'none',
          createdAt: new Date().toISOString(),
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      setAuthError(formatError(err as AuthError));
      throw err;
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const updateTier = async (tier: string) => {
    if (!user || !db) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { tier }, { merge: true });
    } catch (err) {
      console.error('Failed to update tier:', err);
      throw err;
    }
  };

  const updateUserData = async (data: any) => {
    if (!user || !db || !auth) return;
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      // If name is being updated, also update Firebase Auth profile
      if (data.name) {
        await updateProfile(user, { displayName: data.name });
      }
    } catch (err) {
      console.error('Failed to update user data:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isLoginView,
        setIsLoginView,
        user,
        userData,
        isLoggedIn: !!user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateTier,
        updateUserData,
        authError,
        setAuthError,
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
