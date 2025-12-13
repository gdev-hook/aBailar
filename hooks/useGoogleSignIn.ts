import { auth } from '@/config/firebase';
import { createUserDocument } from '@/services/users';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const signIn = async () => {
    try {
      await promptAsync();
    } catch (error: any) {
      throw new Error(error.message || 'Error init google auth');
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async userCredential => {
          await createUserDocument(
            userCredential.user.uid,
            userCredential.user.email || '',
            userCredential.user.displayName || undefined,
            userCredential.user.photoURL || undefined
          );
        })
        .catch(error => {
          console.error('Error google sign in:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (response?.type === 'error') {
      console.error('Error response google:', response.error);
    }
  }, [response]);

  return {
    signIn,
    loading: loading || !request, // Loading if explicitly loading or request not ready
  };
}
