import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInstituicoes } from '../../src/features/instituicoes/hooks/use-instituicoes';
import { InstituicaoCard } from '../../src/features/instituicoes/components/instituicao-card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';

export default function InstituicoesScreen() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const {
    data: instituicoes,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useInstituicoes();

  const filteredInstituicoes = (instituicoes || []).filter((inst) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    return (
      inst.nome.toLowerCase().includes(termo) ||
      inst.slug.toLowerCase().includes(termo) ||
      inst.descricao?.toLowerCase().includes(termo)
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['top', 'left', 'right']}>
      {/* Top Bar */}
      <View className="bg-white px-4 py-3.5 border-b border-neutral-200 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center p-1"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
          <Text className="text-base font-medium text-neutral-800 ml-1">Início</Text>
        </TouchableOpacity>

        <Text className="text-base font-bold text-neutral-900">Instituições</Text>

        <TouchableOpacity
          onPress={() => router.push('/instituicoes/cadastro')}
          className="bg-[#005C3B] px-3 py-1.5 rounded-lg flex-row items-center"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text className="text-xs font-bold text-white ml-0.5">Nova</Text>
        </TouchableOpacity>
      </View>

      {/* Busca e Resumo */}
      <View className="p-4 bg-white border-b border-neutral-200">
        <Input
          placeholder="Buscar instituição por nome ou slug..."
          value={busca}
          onChangeText={setBusca}
          leftIcon={<Ionicons name="search" size={18} color="#9CA3AF" />}
          containerClassName="mb-0"
        />

        <View className="flex-row items-center justify-between mt-2 pt-2">
          <Text className="text-xs text-neutral-500">
            {filteredInstituicoes.length} instituição(ões) encontrada(s)
          </Text>
          <Text className="text-[11px] font-semibold text-[#005C3B]">
            Utilizadas nos cadastros de eventos
          </Text>
        </View>
      </View>

      {/* Conteúdo Principal */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color="#005C3B" />
          <Text className="text-sm text-neutral-500 mt-2">
            Carregando instituições...
          </Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle-outline" size={44} color="#DC2626" />
          <Text className="text-base font-bold text-neutral-800 mt-2 text-center">
            Erro ao carregar instituições
          </Text>
          <Text className="text-xs text-neutral-500 text-center mt-1 mb-4">
            Não foi possível comunicar com a API.
          </Text>
          <Button
            title="Tentar novamente"
            variant="outline"
            size="sm"
            onPress={() => refetch()}
          />
        </View>
      ) : filteredInstituicoes.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-16 h-16 rounded-2xl bg-neutral-100 items-center justify-center mb-3">
            <Ionicons name="business-outline" size={32} color="#9CA3AF" />
          </View>
          <Text className="text-lg font-bold text-neutral-800 text-center">
            Nenhuma instituição encontrada
          </Text>
          <Text className="text-xs text-neutral-500 text-center mt-1 mb-5 max-w-xs leading-relaxed">
            {busca.trim()
              ? 'Nenhum resultado corresponde à sua pesquisa. Tente outros termos.'
              : 'Cadastre câmpus e unidades do IFSP para vinculá-los aos eventos criados.'}
          </Text>
          <Button
            title="Cadastrar Primeira Instituição"
            size="md"
            onPress={() => router.push('/instituicoes/cadastro')}
            leftIcon={<Ionicons name="add-circle" size={18} color="#FFFFFF" />}
          />
        </View>
      ) : (
        <FlatList
          data={filteredInstituicoes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#005C3B']}
            />
          }
          renderItem={({ item }) => <InstituicaoCard instituicao={item} />}
        />
      )}
    </SafeAreaView>
  );
}

