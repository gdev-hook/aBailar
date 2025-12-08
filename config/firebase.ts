import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
// @ts-ignore
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

if (!FIREBASE_API_KEY) {
  throw new Error('Missing environment variable: EXPO_PUBLIC_FIREBASE_API_KEY');
}

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export let auth: Auth;
const isWeb = Platform.OS === 'web';

if (!isWeb) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (e) {
    // En caso de que ya esté inicializada (re-render)
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}

export const storage = getStorage(app);
export const db = getFirestore(app);

export default app;
