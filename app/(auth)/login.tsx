import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormInput } from '@/components/ui/form-input';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEmailSignIn } from '@/hooks/useEmailSignIn';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import { useToast } from '@/hooks/useToast';
import { LoginFormData, loginSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Platform, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { signIn, loading } = useEmailSignIn();
  const { signIn: signInGoogle, loading: googleLoading } = useGoogleSignIn();

  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { showError } = useToast();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      router.replace(Routes.tabs.root);
    } catch (error: any) {
      showError(
        t('auth.login.loginError'),
        error.message || t('auth.login.loginErrorDefault')
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInGoogle();
    } catch (error: any) {
      showError(
        t('auth.login.googleError'),
        error.message || t('auth.login.googleErrorDefault')
      );
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      >
        <ThemedView className="flex-1 justify-center p-5">
          <ThemedText type="title" className="mb-10 text-center">
            {t('auth.login.title')}
          </ThemedText>

          <FormInput
            control={control}
            name="email"
            placeholder={t('auth.login.email')}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <FormInput
            control={control}
            name="password"
            placeholder={t('auth.login.password')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
          />

          <TouchableOpacity
            className="h-12 rounded-lg justify-center items-center mt-2"
            style={{ backgroundColor: colors.tint }}
            onPress={handleSubmit(onSubmit)}
            disabled={loading || googleLoading}
          >
            <ThemedText className="text-white text-base font-semibold">
              {loading
                ? t('auth.login.loggingIn')
                : t('auth.login.loginButton')}
            </ThemedText>
          </TouchableOpacity>

          <ThemedView className="flex-row items-center my-5">
            <ThemedView className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            <ThemedText className="mx-4 text-gray-500 dark:text-gray-400">
              {t('auth.login.or')}
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
                ? t('auth.login.connecting')
                : t('auth.login.googleButton')}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-5 items-center"
            onPress={() => router.push(Routes.auth.register)}
          >
            <ThemedText type="link">{t('auth.login.noAccount')}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
