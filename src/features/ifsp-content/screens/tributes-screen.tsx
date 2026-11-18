
import { FlatList, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '../../../components/ui/state-views';
import { getErrorMessage } from '../../../utils/get-error-message';
import { TributePost } from '../components/tribute-post';
import { useTributeActions } from '../hooks/use-tribute-actions';
import { useTributes } from '../hooks/use-tributes';

export function TributesScreen() {
  const { data, isPending, isError, error, refetch, isRefetching } = useTributes();
  const actions = useTributeActions();

  if (isPending) return <LoadingState label="Carregando homenagens…" />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerClassName="flex-grow"
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <EmptyState
            icon="ribbon-outline"
            title="Nenhuma homenagem por aqui"
            description="Quando novas homenagens forem publicadas, elas aparecerão nesta lista."
          />
        }
        renderItem={({ item }) => (
          <TributePost
            tribute={item}
            onToggleLike={() => actions.toggleLike(item)}
            onToggleReaction={(emoji) => actions.toggleReaction(item, emoji)}
            onShare={() => actions.share(item)}
          />
        )}
      />
    </View>
  );
}
