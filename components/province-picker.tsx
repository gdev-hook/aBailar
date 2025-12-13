import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/contexts/I18nContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Province {
  id: number;
  name: string;
  isoCode: string;
}

interface ProvincePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (province: Province) => void;
  provinces: Province[];
}

export function ProvincePicker({
  visible,
  onClose,
  onSelect,
  provinces,
}: ProvincePickerProps) {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const filteredProvinces = provinces.filter(province =>
    province.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-1 bg-white dark:bg-black">
          {/* Header */}
          <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.text} />
            </TouchableOpacity>
            <ThemedText type="title" className="text-xl font-bold">
              {t('home.selectProvince')}
            </ThemedText>
            <View className="w-6" />
          </ThemedView>

          {/* Search */}
          <ThemedView className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <TextInput
              placeholder={t('home.searchProvince')}
              placeholderTextColor={colors.icon}
              value={search}
              onChangeText={setSearch}
              className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base"
              style={{ color: colors.text }}
            />
          </ThemedView>

          {/* List */}
          <FlatList
            data={filteredProvinces}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  onClose();
                  setSearch('');
                }}
                className="px-4 py-3 border-b border-gray-200 dark:border-gray-800"
              >
                <ThemedText className="text-base">{item.name}</ThemedText>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <ThemedView className="px-4 py-8 items-center">
                <ThemedText className="text-gray-500 dark:text-gray-400">
                  No se encontraron provincias
                </ThemedText>
              </ThemedView>
            }
          />
        </ThemedView>
      </SafeAreaView>
    </Modal>
  );
}
