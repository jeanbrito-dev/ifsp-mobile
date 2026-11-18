import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InstituicaoHeader } from '../../src/features/instituicoes/components/instituicao-header';
import { InstituicaoForm } from '../../src/features/instituicoes/components/instituicao-form';

export default function CadastroInstituicaoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['top', 'left', 'right']}>
      {/* Barra de Navegação Superior */}
      <View className="bg-white px-4 py-3.5 border-b border-neutral-200 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center p-1"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
          <Text className="text-base font-medium text-neutral-800 ml-1">Voltar</Text>
        </TouchableOpacity>

        <Text className="text-base font-bold text-neutral-900">Nova Instituição</Text>

        <View className="w-16" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="px-5 py-6 pb-12"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="max-w-lg w-full mx-auto">
            <InstituicaoHeader
              title="Cadastro de Instituição"
              subtitle="Preencha os dados da instituição de ensino ou polo realizador para vincular a futuros eventos e conferências."
            />

            <InstituicaoForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

