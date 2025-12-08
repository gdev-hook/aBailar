import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('profile.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert(
              t('profile.logoutError'),
              error.message || t('profile.logoutErrorDefault')
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <ThemedView className="flex-1">
        {/* Header del perfil */}
        <ThemedView className="px-4 py-8 items-center border-b border-gray-200 dark:border-gray-800">
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              className="w-24 h-24 rounded-full"
              contentFit="cover"
            />
          ) : (
            <ThemedView
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.tint }}
            >
              <ThemedText className="text-white font-semibold text-3xl">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </ThemedText>
            </ThemedView>
          )}
          <ThemedText type="title" className="mt-4 text-xl font-bold">
            {user?.displayName || user?.email?.split('@')[0] || 'Usuario'}
          </ThemedText>
          {user?.email && (
            <ThemedText className="mt-2 text-gray-500 dark:text-gray-400">
              {user.email}
            </ThemedText>
          )}
        </ThemedView>

        {/* Contenido del perfil */}
        <ThemedView className="flex-1 px-4 py-6">
          <TouchableOpacity
            className="flex-row items-center py-4 border-b border-gray-200 dark:border-gray-800"
            onPress={handleLogout}
          >
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={24}
              color={colors.text}
            />
            <ThemedText className="ml-4 text-base">
              {t('profile.logout')}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
