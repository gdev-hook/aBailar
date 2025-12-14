import { ProvincePicker } from '@/components/province-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import provincesData from '@/constants/provinces.json';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useImagePicker } from '@/hooks/useImagePicker';
import { createPostSchema, PostFormData } from '@/schemas/post.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Province {
  id: number;
  name: string;
  isoCode: string;
}

const provinces = provincesData as Province[];

export default function UploadScreen() {
  const { user, permissions } = useAuth();
  const { image, aspectRatio, showImagePickerOptions } = useImagePicker();

  const { uploading, handleUpload: uploadPost } = useCreatePost();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProvincePicker, setShowProvincePicker] = useState(false);

  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PostFormData>({
    resolver: zodResolver(createPostSchema),
    mode: 'onChange',
  });

  const watchedImage = watch('image');
  const watchedDate = watch('eventDate');
  const watchedProvince = watch('province');

  // Sync image from hook to form
  useEffect(() => {
    if (image) {
      setValue('image', image, { shouldValidate: true });
    }
  }, [image, setValue]);

  const getAvailableProvinces = (): Province[] => {
    if (permissions.includes('admin')) {
      return provinces;
    }
    if (permissions.length > 0) {
      return provinces.filter(province =>
        permissions.includes(province.isoCode)
      );
    }
    return [];
  };

  const availableProvinces = getAvailableProvinces();

  const onSubmit = (data: PostFormData) => {
    uploadPost(data, {
      user,
      permissions,
      aspectRatio,
    });
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
      setValue('eventDate', selectedDate, { shouldValidate: true });
    }
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView className="flex-1">
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
              <ThemedView className="flex-1">
                {watchedImage ? (
                  <Image
                    source={{ uri: watchedImage }}
                    className="w-full rounded-lg mb-4"
                    style={{ maxHeight: 400 }}
                    contentFit="contain"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={showImagePickerOptions}
                    className="w-full rounded-lg mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center bg-gray-50 dark:bg-gray-900/50"
                    style={{ height: 200 }}
                  >
                    <IconSymbol
                      name="photo"
                      size={48}
                      color={errors.image ? 'red' : colors.icon}
                    />
                    <ThemedText
                      className={`mt-2 font-medium ${errors.image ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      {errors.image
                        ? errors.image.message
                        : t('home.selectImage')}
                    </ThemedText>
                  </TouchableOpacity>
                )}

                {watchedImage && (
                  <TouchableOpacity
                    onPress={showImagePickerOptions}
                    className="py-3 px-4 rounded-lg mb-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    <ThemedText className="text-center font-semibold">
                      {t('home.changeImage')}
                    </ThemedText>
                  </TouchableOpacity>
                )}

                <View>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className={`py-3 px-4 rounded-lg mb-1 border ${errors.eventDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800`}
                  >
                    <ThemedText className="text-center font-semibold">
                      {watchedDate
                        ? formatDate(watchedDate)
                        : t('home.selectEventDate')}
                    </ThemedText>
                  </TouchableOpacity>
                  {errors.eventDate && (
                    <ThemedText className="text-red-500 text-xs mb-3 text-center">
                      {errors.eventDate.message}
                    </ThemedText>
                  )}
                </View>

                {availableProvinces.length > 0 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() => setShowProvincePicker(true)}
                      className={`py-3 px-4 rounded-lg mb-1 border ${errors.province ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-800`}
                    >
                      <ThemedText className="text-center font-semibold">
                        {watchedProvince
                          ? watchedProvince.name
                          : t('home.selectProvince')}
                      </ThemedText>
                    </TouchableOpacity>
                    {errors.province && (
                      <ThemedText className="text-red-500 text-xs mb-3 text-center">
                        {errors.province.message}
                      </ThemedText>
                    )}
                  </View>
                ) : (
                  <ThemedView className="py-3 px-4 rounded-lg mb-4 border border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20">
                    <ThemedText className="text-center font-semibold text-red-600 dark:text-red-400">
                      {t('home.noUploadPermissions')}
                    </ThemedText>
                  </ThemedView>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={watchedDate || getMinimumDate()}
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
                  onPress={handleSubmit(onSubmit)}
                  disabled={uploading || !isValid}
                  className={`py-3 px-4 rounded-lg ${
                    uploading || !isValid ? 'opacity-60' : ''
                  }`}
                  style={{
                    backgroundColor:
                      uploading || !isValid ? colors.icon : colors.tint,
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
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>

      <ProvincePicker
        visible={showProvincePicker}
        onClose={() => setShowProvincePicker(false)}
        onSelect={province => {
          setValue('province', province, { shouldValidate: true });
          setShowProvincePicker(false);
        }}
        provinces={availableProvinces}
      />
    </SafeAreaView>
  );
}
