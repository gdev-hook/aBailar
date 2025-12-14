import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  const theme = useMemo(
    () => (colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    [colorScheme]
  );

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const inAuthGroup = segments[0] === '(auth)';

  return (
    <ThemeProvider value={theme}>
      {!user && !inAuthGroup && <Redirect href={Routes.auth.login} />}
      {user && inAuthGroup && <Redirect href={Routes.tabs.home.root} />}
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <I18nProvider>
          <AuthProvider>
            <RootLayoutNav />
            <Toast />
          </AuthProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
