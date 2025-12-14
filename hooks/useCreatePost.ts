import { useTranslation } from '@/contexts/I18nContext';
import { useToast } from '@/hooks/useToast';
import { PostFormData } from '@/schemas/post.schema';
import { createPost, uploadImage } from '@/services/posts';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface CreatePostContext {
  user: any;
  permissions: string[];
  aspectRatio: number | null;
}

export const useCreatePost = () => {
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleUpload = async (
    data: PostFormData,
    context: CreatePostContext
  ) => {
    const { image, eventDate, province } = data;
    const { user, permissions, aspectRatio } = context;

    if (!user) {
      showError(t('home.error'), t('home.selectImageError')); // Generic error if user missing
      return;
    }

    // Permission check
    if (!permissions.includes('admin')) {
      if (permissions.length === 0 || !permissions.includes(province.isoCode)) {
        showError(t('home.error'), t('home.noProvincePermissions'));
        return;
      }
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
        eventDate || undefined,
        province.id,
        aspectRatio || undefined
      );

      showSuccess(t('home.success'), t('home.uploadSuccess'));
      router.back();
    } catch (error: any) {
      showError(t('home.error'), error.message || t('home.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    handleUpload,
  };
};
