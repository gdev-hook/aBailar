import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createPost, uploadImage } from '@/services/posts';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(t('home.permissionsNeeded'), t('home.galleryPermission'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(t('home.permissionsNeeded'), t('home.cameraPermission'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !user) {
      Alert.alert(t('home.error'), t('home.selectImageError'));
      return;
    }

    if (!eventDate) {
      Alert.alert(t('home.error'), t('home.selectEventDateError'));
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
        user.photoURL || undefined,
        eventDate || undefined
      );

      Alert.alert(t('home.success'), t('home.uploadSuccess'), [
        {
          text: t('home.ok'),
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(t('home.error'), error.message || t('home.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMinimumDate = (): Date => {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    return tomorrow;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type !== 'dismissed' && selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(t('home.selectImage'), t('home.chooseOption'), [
      { text: t('home.cancel'), style: 'cancel' },
      { text: t('home.takePhoto'), onPress: takePhoto },
      { text: t('home.chooseFromGallery'), onPress: pickImage },
    ]);
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
              {t('home.newPost')}
            </ThemedText>
            <View className="w-6" />
          </ThemedView>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ThemedView className="flex-1 p-4">
              {image ? (
                <ThemedView className="flex-1">
                  <Image
                    source={{ uri: image }}
                    className="w-full rounded-lg mb-4"
                    style={{ maxHeight: 400 }}
                    contentFit="contain"
                  />
                  <TouchableOpacity
                    onPress={showImagePickerOptions}
                    className="py-3 px-4 rounded-lg mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    <ThemedText className="text-center font-semibold">
                      {t('home.changeImage')}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="py-3 px-4 rounded-lg mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    <ThemedText className="text-center font-semibold">
                      {eventDate
                        ? formatDate(eventDate)
                        : t('home.selectEventDate')}
                    </ThemedText>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={eventDate || getMinimumDate()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onDateChange}
                      minimumDate={getMinimumDate()}
                    />
                  )}
                  {Platform.OS === 'ios' && showDatePicker && (
                    <View className="flex-row justify-end mt-2">
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        className="px-4 py-2"
                      >
                        <ThemedText
                          className="font-semibold"
                          style={{ color: colors.tint }}
                        >
                          {t('home.ok')}
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={handleUpload}
                    disabled={uploading || !eventDate}
                    className={`py-3 px-4 rounded-lg ${
                      uploading || !eventDate ? 'opacity-60' : ''
                    }`}
                    style={{
                      backgroundColor:
                        uploading || !eventDate ? colors.icon : colors.tint,
                    }}
                  >
                    {uploading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <ThemedText className="text-white text-center font-semibold text-base">
                        {t('home.publish')}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                </ThemedView>
              ) : (
                <ThemedView className="flex-1 items-center justify-center">
                  <TouchableOpacity
                    onPress={showImagePickerOptions}
                    className="items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                    style={{ minHeight: 200, paddingVertical: 40 }}
                  >
                    <IconSymbol name="photo" size={64} color={colors.icon} />
                    <ThemedText className="mt-4 text-center text-gray-500 dark:text-gray-400">
                      {t('home.touchToSelect')}
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
