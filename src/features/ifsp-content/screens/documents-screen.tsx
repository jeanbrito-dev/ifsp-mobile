import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, TextInput, View } from 'react-native';

import { Chip } from '../../../components/ui/chip';
import { EmptyState, ErrorState, LoadingState } from '../../../components/ui/state-views';
import { DOCUMENT_CATEGORIES, type DocumentCategory } from '../../../types/ifsp-content';
import { getErrorMessage } from '../../../utils/get-error-message';
import { DocumentCard } from '../components/document-card';
import { DOCUMENT_CATEGORY_LABELS } from '../constants';
import { useDebouncedValue } from '../hooks/use-debounced-value';
import { useDocuments } from '../hooks/use-documents';
import { neutral } from '../../../theme/neutral';

export function DocumentsScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocumentCategory | undefined>();
  const debouncedSearch = useDebouncedValue(search.trim());

  const { data, isPending, isError, error, refetch, isRefetching } = useDocuments({
    category,
    search: debouncedSearch,
  });

  return (
    <View className="flex-1 bg-white">
      <View className="gap-3 px-4 pt-4">
        <View className="min-h-[44px] flex-row items-center gap-2 rounded-xl border border-gray-200 px-3">
          <Ionicons name="search" size={20} color={neutral.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar editais e documentos"
            placeholderTextColor={neutral.muted}
            accessibilityLabel="Buscar editais e documentos"
            returnKeyType="search"
            autoCorrect={false}
            className="flex-1 py-2 text-base text-gray-900"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          <Chip
            label="Todos"
            selected={!category}
            onPress={() => setCategory(undefined)}
          />
          {DOCUMENT_CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={DOCUMENT_CATEGORY_LABELS[item]}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </ScrollView>
      </View>

      {isPending ? (
        <LoadingState label="Carregando documentos…" />
      ) : isError ? (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 p-4 flex-grow"
          keyboardShouldPersistTaps="handled"
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <EmptyState
              icon="document-outline"
              title="Nenhum documento encontrado"
              description="Tente outra busca ou remova o filtro de categoria."
            />
          }
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={() =>
                router.push({
                  pathname: '/panorama/documentos/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}
