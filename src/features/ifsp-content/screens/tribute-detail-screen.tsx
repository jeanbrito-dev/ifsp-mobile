import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { ErrorState, LoadingState } from '../../../components/ui/state-views';
import { neutral } from '../../../theme/neutral';
import { getErrorMessage } from '../../../utils/get-error-message';
import { TributeActions } from '../components/tribute-actions';
import { useTribute } from '../hooks/use-tribute';
import { useTributeActions } from '../hooks/use-tribute-actions';

export function TributeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError, error, refetch } = useTribute(id);
  const actions = useTributeActions();

  if (isPending) return <LoadingState label="Carregando homenagem…" />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="gap-4 p-4 pb-10">
      <View className="items-center gap-3">
        {data.photoUrl ? (
          <Image
            source={{ uri: data.photoUrl }}
            style={{ width: 160, height: 160, borderRadius: 80 }}
            contentFit="cover"
            accessibilityLabel={`Foto de ${data.name}`}
          />
        ) : (
          <View className="h-40 w-40 items-center justify-center rounded-full bg-gray-100">
            <Ionicons name="person-outline" size={64} color={neutral.muted} />
          </View>
        )}
        <Text accessibilityRole="header" className="text-center text-2xl font-bold text-gray-900">
          {data.name}
        </Text>
        {data.role ? (
          <Text className="text-center text-base font-medium text-brand">{data.role}</Text>
        ) : null}
        {data.period ? <Text className="text-center text-gray-500">{data.period}</Text> : null}
      </View>

      <TributeActions
        tribute={data}
        onToggleLike={() => actions.toggleLike(data)}
        onToggleReaction={(emoji) => actions.toggleReaction(data, emoji)}
        onShare={() => actions.share(data)}
      />

      <Text className="text-base leading-6 text-gray-900">{data.summary}</Text>
      {data.biography ? (
        <Text className="text-base leading-6 text-gray-900">{data.biography}</Text>
      ) : null}
    </ScrollView>
  );
}