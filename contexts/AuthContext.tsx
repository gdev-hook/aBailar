import { auth } from '@/config/firebase';
import { createUserDocument, getUserPermissions } from '@/services/users';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// Completar la sesión de autenticación web
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  permissions: string[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Configurar Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);
      if (user) {
        // Cargar permisos del usuario
        try {
          const userPermissions = await getUserPermissions(user.uid);
          setPermissions(userPermissions);
        } catch (error) {
          console.error('Error al cargar permisos:', error);
          setPermissions([]);
        }
      } else {
        setPermissions([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Manejar respuesta de Google OAuth
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async userCredential => {
          // Crear documento de usuario si no existe
          await createUserDocument(
            userCredential.user.uid,
            userCredential.user.email || '',
            userCredential.user.displayName || undefined,
            userCredential.user.photoURL || undefined
          );
          // La navegación se manejará automáticamente por el onAuthStateChanged
        })
        .catch(error => {
          console.error('Error al iniciar sesión con Google:', error);
        });
    } else if (response?.type === 'error') {
      console.error('Error en autenticación de Google:', response.error);
    }
  }, [response]);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Crear documento de usuario con permisos vacíos
    await createUserDocument(
      userCredential.user.uid,
      email,
      userCredential.user.displayName || undefined,
      userCredential.user.photoURL || undefined
    );
  };

  const signInWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    permissions,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
