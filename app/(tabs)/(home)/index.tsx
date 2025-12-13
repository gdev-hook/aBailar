import { PostCard } from '@/components/post-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Routes } from '@/constants/routes';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePosts } from '@/hooks/usePosts';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const { data: posts } = usePosts();
  const [refreshing, setRefreshing] = useState(false);
  const { permissions } = useAuth();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const canUploadPosts = permissions.length > 0;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ThemedView className="flex-1">
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
          ListEmptyComponent={
            <ThemedView className="flex-1 items-center justify-center py-20 px-4">
              <IconSymbol name="photo" size={64} color={colors.icon} />
              <ThemedText className="text-center mt-4 text-gray-500 dark:text-gray-400">
                {t('home.noPosts')}
              </ThemedText>
            </ThemedView>
          }
        />

        {canUploadPosts && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 20,
              bottom: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.tint,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => router.push(Routes.tabs.home.upload)}
            activeOpacity={0.8}
          >
            <IconSymbol name="plus" size={28} color="white" />
          </TouchableOpacity>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
