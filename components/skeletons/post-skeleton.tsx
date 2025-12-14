import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ThemedView } from '../themed-view';

const SkeletonItem = ({
  width,
  height,
  borderRadius,
  style,
}: {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? '#333' : '#E1E9EE',
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export function PostSkeleton() {
  const { width } = useWindowDimensions();

  return (
    <ThemedView className="mb-4 bg-white dark:bg-black">
      {/* Header Skeleton */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
        {/* Avatar */}
        <SkeletonItem width={40} height={40} borderRadius={20} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          {/* Name */}
          <SkeletonItem width={120} height={16} borderRadius={4} />
          {/* Date */}
          <SkeletonItem
            width={80}
            height={12}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        </View>
      </View>

      {/* Image Skeleton */}
      <SkeletonItem width={width} height={width} />
    </ThemedView>
  );
}
