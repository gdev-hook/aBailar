import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { TextInput, TextInputProps } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  ...inputProps
}: Props<T>) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <ThemedView className="mb-4">
          {label && (
            <ThemedText className="mb-2 text-base font-medium">
              {label}
            </ThemedText>
          )}

          <TextInput
            className="h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-4 text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            placeholderTextColor={colors.icon}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...inputProps}
          />

          {error && (
            <ThemedText className="text-red-500 text-sm mt-1">
              {error.message}
            </ThemedText>
          )}
        </ThemedView>
      )}
    />
  );
}
