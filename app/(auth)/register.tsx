import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t('auth.register.error'), t('auth.register.completeFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t('auth.register.error'),
        t('auth.register.passwordsDontMatch')
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        t('auth.register.error'),
        t('auth.register.passwordTooShort')
      );
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        t('auth.register.registerError'),
        error.message || t('auth.register.registerErrorDefault')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // La navegación se manejará automáticamente cuando se complete la autenticación
    } catch (error: any) {
      Alert.alert(
        t('auth.register.googleError'),
        error.message || t('auth.register.googleErrorDefault')
      );
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView className="flex-1 justify-center p-5">
          <ThemedText type="title" className="mb-10 text-center">
            {t('auth.register.title')}
          </ThemedText>

          <TextInput
            className="h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-4 mb-4 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder={t('auth.register.email')}
            placeholderTextColor={colors.icon}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <TextInput
            className="h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-4 mb-4 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder={t('auth.register.password')}
            placeholderTextColor={colors.icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />

          <TextInput
            className="h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-4 mb-4 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholder={t('auth.register.confirmPassword')}
            placeholderTextColor={colors.icon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
          />

          <TouchableOpacity
            className="h-12 rounded-lg justify-center items-center mt-2"
            style={{ backgroundColor: colors.tint }}
            onPress={handleRegister}
            disabled={loading || googleLoading}
          >
            <ThemedText className="text-white text-base font-semibold">
              {loading
                ? t('auth.register.registering')
                : t('auth.register.registerButton')}
            </ThemedText>
          </TouchableOpacity>

          <ThemedView className="flex-row items-center my-5">
            <ThemedView className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            <ThemedText className="mx-4 text-gray-500 dark:text-gray-400">
              {t('auth.register.or')}
            </ThemedText>
            <ThemedView className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          </ThemedView>

          <TouchableOpacity
            className="h-12 rounded-lg justify-center items-center flex-row border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            onPress={handleGoogleLogin}
            disabled={loading || googleLoading}
          >
            <ThemedText className="text-base font-semibold">
              {googleLoading
                ? t('auth.register.connecting')
                : t('auth.register.googleButton')}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-5 items-center"
            onPress={() => router.push('/(auth)/login')}
          >
            <ThemedText type="link">{t('auth.register.hasAccount')}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
