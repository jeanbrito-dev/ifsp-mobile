import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ErrorState, LoadingState } from '../../../components/ui/state-views';
import { theme } from '../../../theme/tokens';
import { formatDate } from '../../../utils/format-date';
import { formatFileSize } from '../../../utils/format-file-size';
import { getErrorMessage } from '../../../utils/get-error-message';
import { DOCUMENT_CATEGORY_LABELS } from '../constants';
import { useDocument } from '../hooks/use-document';
import { useDownloadDocument, useViewDocument } from '../hooks/use-document-files';

export function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError, error, refetch } = useDocument(id);
  const view = useViewDocument();
  const download = useDownloadDocument();

  if (isPending) return <LoadingState label="Carregando documento…" />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  const actionError = view.error ?? download.error;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="gap-4 p-4 pb-10">
      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase text-brand">
          {DOCUMENT_CATEGORY_LABELS[data.category]}
        </Text>
        <Text accessibilityRole="header" className="text-2xl font-bold text-gray-900">
          {data.title}
        </Text>
        <Text className="text-gray-500">
          Publicado em {formatDate(data.publishedAt)}
          {data.fileSizeBytes ? ` · ${formatFileSize(data.fileSizeBytes)}` : ''}
        </Text>
      </View>

      {data.description ? (
        <Text className="text-base leading-6 text-gray-900">{data.description}</Text>
      ) : null}

      <View className="gap-3">
        <Pressable
          onPress={() => view.mutate(data)}
          disabled={view.isPending}
          accessibilityRole="button"
          accessibilityLabel="Visualizar documento"
          accessibilityState={{ disabled: view.isPending, busy: view.isPending }}
          className="min-h-[48px] flex-row items-center justify-center gap-2 rounded-xl bg-brand px-4 disabled:opacity-60"
        >
          <Ionicons name="eye-outline" size={20} color={theme.colors.background} />
          <Text className="font-semibold text-white">
            {view.isPending ? 'Abrindo…' : 'Visualizar'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => download.mutate(data)}
          disabled={download.isPending}
          accessibilityRole="button"
          accessibilityLabel="Baixar documento"
          accessibilityState={{ disabled: download.isPending, busy: download.isPending }}
          className="min-h-[48px] flex-row items-center justify-center gap-2 rounded-xl border border-brand px-4 disabled:opacity-60"
        >
          <Ionicons name="download-outline" size={20} color={theme.colors.brand} />
          <Text className="font-semibold text-brand">
            {download.isPending ? 'Baixando…' : 'Baixar'}
          </Text>
        </Pressable>
      </View>

      <View accessibilityLiveRegion="polite">
        {download.isSuccess ? (
          <Text className="text-brand">
            Download concluído. Use a janela do sistema para salvar ou abrir o arquivo.
          </Text>
        ) : null}
        {actionError ? (
          <Text accessibilityRole="alert" className="text-red-700">
            Não foi possível concluir a ação. Verifique sua conexão e tente novamente.
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
