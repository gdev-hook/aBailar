import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createPost, uploadImage } from '@/services/posts';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UploadScreen() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para subir imágenes.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu cámara para tomar fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !user) {
      Alert.alert('Error', 'Por favor selecciona una imagen');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(image, user.uid);
      await createPost(
        imageUrl,
        user.uid,
        user.email || '',
        user.displayName || undefined,
        user.photoURL || undefined
      );
      
      Alert.alert('¡Éxito!', 'Tu imagen se ha subido correctamente', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Seleccionar Imagen',
      'Elige una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar Foto', onPress: takePhoto },
        { text: 'Elegir de Galería', onPress: pickImage },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView className="flex-1">
        {/* Header */}
        <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" className="text-xl font-bold">
            Nueva Publicación
          </ThemedText>
          <View className="w-6" />
        </ThemedView>

        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <ThemedView className="flex-1 p-4">
            {image ? (
              <ThemedView className="flex-1">
                <Image
                  source={{ uri: image }}
                  className="w-full aspect-square rounded-lg mb-4"
                  contentFit="cover"
                />
                <TouchableOpacity
                  onPress={showImagePickerOptions}
                  className="py-3 px-4 rounded-lg mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  <ThemedText className="text-center font-semibold">
                    Cambiar Imagen
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpload}
                  disabled={uploading}
                  className={`py-3 px-4 rounded-lg ${uploading ? 'opacity-60' : ''}`}
                  style={{
                    backgroundColor: uploading ? colors.icon : colors.tint,
                  }}
                >
                  {uploading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <ThemedText className="text-white text-center font-semibold text-base">
                      Publicar
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </ThemedView>
            ) : (
              <ThemedView className="flex-1 items-center justify-center">
                <TouchableOpacity
                  onPress={showImagePickerOptions}
                  className="items-center justify-center w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                >
                  <IconSymbol name="photo" size={64} color={colors.icon} />
                  <ThemedText className="mt-4 text-center text-gray-500 dark:text-gray-400">
                    Toca para seleccionar una imagen
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
