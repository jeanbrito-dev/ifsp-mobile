import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { theme } from '../../theme/tokens';
import { neutral } from '../../theme/neutral';

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <View
      className="flex-1 items-center justify-center gap-3 p-6"
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={theme.colors.brand} />
      <Text className="text-gray-500">{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  description,
  icon = 'file-tray-outline',
}: {
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-2 p-8">
      <Ionicons name={icon} size={40} color={neutral.muted} />
      <Text className="text-center text-lg font-semibold text-gray-900">{title}</Text>
      {description ? (
        <Text className="text-center text-gray-500">{description}</Text>
      ) : null}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View
      className="flex-1 items-center justify-center gap-3 p-8"
      accessibilityRole="alert"
    >
      <Ionicons name="alert-circle-outline" size={40} color={neutral.danger} />
      <Text className="text-center text-gray-900">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Tentar novamente"
          className="min-h-[44px] justify-center rounded-full bg-brand px-6"
        >
          <Text className="font-semibold text-white">Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
