import { PostCard } from '@/components/post-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Post, subscribeToPosts } from '@/services/posts';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const unsubscribe = subscribeToPosts(newPosts => {
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ThemedView className="flex-1">
        {/* Feed */}
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {posts.length === 0 ? (
            <ThemedView className="flex-1 items-center justify-center py-20 px-4">
              <IconSymbol name="photo" size={64} color={colors.icon} />
              <ThemedText className="text-center mt-4 text-gray-500 dark:text-gray-400">
                {t('home.noPosts')}
              </ThemedText>
            </ThemedView>
          ) : (
            <View className="pb-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Botón flotante */}
        <TouchableOpacity
          className="absolute w-14 h-14 rounded-full justify-center items-center shadow-lg"
          style={{
            backgroundColor: colors.tint,
            bottom: '5%',
            right: '5%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
          onPress={() => router.push('/(tabs)/(home)/upload')}
          activeOpacity={0.8}
        >
          <IconSymbol name="plus" size={28} color="white" />
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}
