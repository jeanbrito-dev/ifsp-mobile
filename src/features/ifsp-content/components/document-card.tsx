import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { theme } from '../../../theme/tokens';
import { neutral } from '../../../theme/neutral';
import type { IfspDocument } from '../../../types/ifsp-content';
import { formatDate } from '../../../utils/format-date';
import { formatFileSize } from '../../../utils/format-file-size';
import { DOCUMENT_CATEGORY_LABELS } from '../constants';

export function DocumentCard({
  document,
  onPress,
}: {
  document: IfspDocument;
  onPress: () => void;
}) {
  const categoryLabel = DOCUMENT_CATEGORY_LABELS[document.category];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${categoryLabel}: ${document.title}, publicado em ${formatDate(document.publishedAt)}. Abrir detalhes`}
      className="flex-row gap-3 rounded-2xl border border-gray-200 bg-white p-4 active:bg-gray-100"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
        <Ionicons name="document-text-outline" size={24} color={theme.colors.brand} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-xs font-semibold uppercase text-brand">
          {categoryLabel}
        </Text>
        <Text className="text-base font-semibold text-gray-900" numberOfLines={3}>
          {document.title}
        </Text>
        <Text className="text-sm text-gray-500">
          {formatDate(document.publishedAt)}
          {document.fileSizeBytes ? ` · ${formatFileSize(document.fileSizeBytes)}` : ''}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={neutral.muted} />
    </Pressable>
  );
}
