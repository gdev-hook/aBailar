import { useTranslation } from '@/contexts/I18nContext';
import { useToast } from '@/hooks/useToast';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useImagePicker = () => {
  const [image, setImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const { t } = useTranslation();
  const { showError } = useToast();

  const processImage = async (uri: string) => {
    try {
      const result = await manipulateAsync(uri, [{ resize: { width: 1080 } }], {
        compress: 0.5,
        format: SaveFormat.JPEG,
      });
      return result;
    } catch (error) {
      console.error('Error procesando imagen:', error);
      return { uri, width: 0, height: 0 };
    }
  };

  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets[0]) {
      const processed = await processImage(result.assets[0].uri);
      setImage(processed.uri);
      const width = processed.width || result.assets[0].width;
      const height = processed.height || result.assets[0].height;

      if (width && height) {
        setAspectRatio(width / height);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showError(t('home.permissionsNeeded'), t('home.galleryPermission'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    await handleImageResult(result);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      showError(t('home.permissionsNeeded'), t('home.cameraPermission'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    await handleImageResult(result);
  };

  const showImagePickerOptions = () => {
    Alert.alert(t('home.selectImage'), t('home.chooseOption'), [
      { text: t('home.cancel'), style: 'cancel' },
      { text: t('home.takePhoto'), onPress: takePhoto },
      { text: t('home.chooseFromGallery'), onPress: pickImage },
    ]);
  };

  return {
    image,
    aspectRatio,
    pickImage,
    takePhoto,
    showImagePickerOptions,
    setImage, // Exposed in case we need to clear it or set manually
  };
};
