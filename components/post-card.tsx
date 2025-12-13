import { Colors } from '@/constants/theme';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Post } from '@/services/posts';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t, locale } = useTranslation();
  const { width } = useWindowDimensions();
  const imageSize = width;
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  return (
    <ThemedView className="mb-4 bg-white dark:bg-black">
      {/* Header */}
      <ThemedView className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        {post.userPhotoURL ? (
          <Image
            source={{ uri: post.userPhotoURL }}
            className="w-10 h-10 rounded-full mr-3"
            contentFit="cover"
          />
        ) : (
          <ThemedView
            className="w-10 h-10 rounded-full mr-3 items-center justify-center"
            style={{ backgroundColor: colors.tint }}
          >
            <ThemedText className="text-white font-semibold text-sm">
              {post.userName?.charAt(0).toUpperCase() ||
                post.userEmail.charAt(0).toUpperCase()}
            </ThemedText>
          </ThemedView>
        )}
        <ThemedView className="flex-1">
          <ThemedText className="font-semibold text-base">
            {post.userName || post.userEmail.split('@')[0]}
          </ThemedText>
          {post.eventDate && (
            <ThemedText className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.eventDate).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      {/* Image */}
      <Image
        source={{ uri: post.imageUrl }}
        style={{
          width: imageSize,
          height: imageHeight || imageSize,
          alignSelf: 'stretch',
        }}
        contentFit="contain"
        transition={200}
        cachePolicy="memory-disk"
        placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
        onLoad={e => {
          const { width: imgWidth, height: imgHeight } = e.source;
          if (imgWidth && imgHeight) {
            const aspectRatio = imgHeight / imgWidth;
            const calculatedHeight = imageSize * aspectRatio;
            setImageHeight(calculatedHeight);
          }
        }}
      />

      {/* Footer */}
      {/* <ThemedView className="px-4 py-3">
        <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(post.createdAt).toLocaleDateString(t('common.dateFormat'), {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </ThemedText>
      </ThemedView> */}
    </ThemedView>
  );
}
