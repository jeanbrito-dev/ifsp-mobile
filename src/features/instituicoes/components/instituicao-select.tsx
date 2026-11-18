import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useInstituicoes } from '../hooks/use-instituicoes';
import { InstituicaoCard } from './instituicao-card';
import { Instituicao } from '../../../types/instituicao';
import { Button } from '../../../components/ui/button';

interface InstituicaoSelectProps {
  value?: string | null;
  onChange: (instituicaoId: string, instituicao?: Instituicao) => void;
  label?: string;
  error?: string;
  hint?: string;
}

export function InstituicaoSelect({
  value,
  onChange,
  label = 'Instituição Responsável pelo Evento *',
  error,
  hint = 'Selecione o câmpus ou polo do IFSP responsável por este evento.',
}: InstituicaoSelectProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { data: instituicoes, isLoading, isError, refetch } = useInstituicoes();

  const selectedInstituicao = instituicoes?.find((inst) => inst.id === value);

  const handleSelect = (inst: Instituicao) => {
    onChange(inst.id, inst);
    setModalVisible(false);
  };

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-sm font-medium text-neutral-700 mb-1.5">{label}</Text>
      )}

      {selectedInstituicao ? (
        <View className="relative">
          <InstituicaoCard
            instituicao={selectedInstituicao}
            selected
            onPress={() => setModalVisible(true)}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="mt-1.5 flex-row items-center justify-end"
          >
            <Ionicons name="swap-horizontal" size={14} color="#005C3B" />
            <Text className="text-xs font-semibold text-[#005C3B] ml-1">
              Alterar instituição
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className={`flex-row items-center justify-between bg-neutral-50 rounded-xl border px-3.5 py-3 min-h-[48px] ${
            error ? 'border-red-500' : 'border-neutral-300'
          }`}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center flex-1 mr-2">
            <Ionicons name="business-outline" size={18} color="#6B7280" />
            <Text className="text-base text-neutral-400 ml-2.5">
              Selecione uma instituição...
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}

      {error && <Text className="text-xs text-red-600 mt-1 font-medium">{error}</Text>}
      {!error && hint && <Text className="text-xs text-neutral-500 mt-1">{hint}</Text>}

      {/* Modal de Seleção */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-neutral-50">
          <View className="p-4 border-b border-neutral-200 bg-white flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-neutral-900">
                Selecionar Instituição
              </Text>
              <Text className="text-xs text-neutral-500">
                Vincule o evento a um câmpus do IFSP
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <View className="p-4">
            <Button
              title="Cadastrar Nova Instituição"
              variant="outline"
              size="sm"
              leftIcon={<Ionicons name="add-circle-outline" size={18} color="#005C3B" />}
              onPress={() => {
                setModalVisible(false);
                router.push('/instituicoes/cadastro');
              }}
            />
          </View>

          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#005C3B" />
              <Text className="text-sm text-neutral-500 mt-2">
                Carregando instituições...
              </Text>
            </View>
          ) : isError ? (
            <View className="flex-1 items-center justify-center p-6">
              <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
              <Text className="text-base font-semibold text-neutral-800 mt-2 text-center">
                Erro ao carregar instituições
              </Text>
              <Button
                title="Tentar novamente"
                variant="outline"
                size="sm"
                onPress={() => refetch()}
                style={{ marginTop: 12 }}
              />
            </View>
          ) : !instituicoes || instituicoes.length === 0 ? (
            <View className="flex-1 items-center justify-center p-6">
              <Ionicons name="business-outline" size={48} color="#9CA3AF" />
              <Text className="text-base font-bold text-neutral-800 mt-3 text-center">
                Nenhuma instituição encontrada
              </Text>
              <Text className="text-xs text-neutral-500 text-center mt-1 mb-4 max-w-xs">
                Cadastre a primeira instituição para poder vincular aos seus eventos.
              </Text>
              <Button
                title="Cadastrar Instituição Agora"
                size="md"
                onPress={() => {
                  setModalVisible(false);
                  router.push('/instituicoes/cadastro');
                }}
              />
            </View>
          ) : (
            <FlatList
              data={instituicoes}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16, gap: 12 }}
              renderItem={({ item }) => (
                <InstituicaoCard
                  instituicao={item}
                  selected={item.id === value}
                  onPress={() => handleSelect(item)}
                />
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

