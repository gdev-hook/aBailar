import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error de registro', error.message || 'Ocurrió un error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView className="flex-1 justify-center p-5">
        <ThemedText type="title" className="mb-10 text-center">
          Crear Cuenta
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
          autoComplete="password-new"
        />

        <TextInput
          className="h-12 border rounded-lg px-4 mb-4 text-base"
          style={{ color: colors.text, borderColor: colors.icon }}
          placeholder="Confirmar Contraseña"
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
          disabled={loading}
        >
          <ThemedText className="text-white text-base font-semibold">
            {loading ? 'Registrando...' : 'Registrarse'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.back()}
        >
          <ThemedText type="link">
            ¿Ya tienes cuenta? Inicia sesión
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

