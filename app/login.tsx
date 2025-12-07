import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error de inicio de sesión', error.message || 'Ocurrió un error al iniciar sesión');
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
      Alert.alert('Error de Google', error.message || 'Ocurrió un error al iniciar sesión con Google');
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView className="flex-1 justify-center p-5">
        <ThemedText type="title" className="mb-10 text-center">
          Iniciar Sesión
        </ThemedText>

        <TextInput
          className="h-12 border rounded-lg px-4 mb-4 text-base"
          style={{ color: colors.text, borderColor: colors.icon }}
          placeholder="Email"
          placeholderTextColor={colors.icon}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          className="h-12 border rounded-lg px-4 mb-4 text-base"
          style={{ color: colors.text, borderColor: colors.icon }}
          placeholder="Contraseña"
          placeholderTextColor={colors.icon}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        <TouchableOpacity
          className="h-12 rounded-lg justify-center items-center mt-2"
          style={{ backgroundColor: colors.tint }}
          onPress={handleLogin}
          disabled={loading || googleLoading}
        >
          <ThemedText className="text-white text-base font-semibold">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </ThemedText>
        </TouchableOpacity>

        <ThemedView className="flex-row items-center my-5">
          <ThemedView className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          <ThemedText className="mx-4 text-gray-500 dark:text-gray-400">o</ThemedText>
          <ThemedView className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        </ThemedView>

        <TouchableOpacity
          className="h-12 rounded-lg justify-center items-center flex-row border"
          style={{ 
            borderColor: colors.icon,
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
          }}
          onPress={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          <ThemedText className="text-base font-semibold" style={{ color: colors.text }}>
            {googleLoading ? 'Conectando...' : '🔵 Continuar con Google'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.push('/register')}
        >
          <ThemedText type="link">
            ¿No tienes cuenta? Regístrate
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

