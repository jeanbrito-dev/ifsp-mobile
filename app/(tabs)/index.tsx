import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/auth-context';
import { Button } from '../../src/components/ui/button';

export default function HomeRoute() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView contentContainerClassName="p-6" showsVerticalScrollIndicator={false}>
        <View className="bg-[#005C3B] rounded-3xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="w-12 h-12 rounded-2xl bg-white/10 items-center justify-center">
              <Ionicons name="school" size={24} color="#FFFFFF" />
            </View>
            <View className="bg-[#F9C800] px-3 py-1 rounded-full">
              <Text className="text-xs font-bold text-neutral-900 uppercase">
                {user?.cargo ?? 'USUARIO'}
              </Text>
            </View>
          </View>

          <Text className="text-white/80 text-sm font-medium">Bem-vindo(a),</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">
            {user?.nome ?? 'Estudante'}
          </Text>
          <Text className="text-white/70 text-xs mt-1">{user?.email}</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-6 border border-neutral-200">
          <Text className="text-base font-bold text-neutral-900 mb-3">
            Sua Sessão Ativa
          </Text>

          <View className="flex-row items-center py-2 border-b border-neutral-100">
            <Ionicons name="person-outline" size={18} color="#6B7280" />
            <Text className="text-xs text-neutral-500 ml-2.5 w-20">Nome:</Text>
            <Text className="text-xs font-medium text-neutral-800 flex-1">
              {user?.nome ?? '-'}
            </Text>
          </View>

          <View className="flex-row items-center py-2 border-b border-neutral-100">
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
            <Text className="text-xs text-neutral-500 ml-2.5 w-20">E-mail:</Text>
            <Text className="text-xs font-medium text-neutral-800 flex-1">
              {user?.email ?? '-'}
            </Text>
          </View>

          <View className="flex-row items-center py-2">
            <Ionicons name="shield-outline" size={18} color="#6B7280" />
            <Text className="text-xs text-neutral-500 ml-2.5 w-20">Perfil:</Text>
            <Text className="text-xs font-medium text-neutral-800 flex-1">
              {user?.cargo === 'ADMIN' ? 'Administrador' : 'Usuário Padrão'}
            </Text>
          </View>
        </View>

        {/* Gestão de Instituições e Eventos */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-neutral-200">
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-xl bg-emerald-50 items-center justify-center mr-3">
              <Ionicons name="business" size={20} color="#005C3B" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-neutral-900">
                Instituições de Ensino
              </Text>
              <Text className="text-xs text-[#005C3B] font-medium">
                Vínculo obrigatório nos eventos
              </Text>
            </View>
          </View>

          <Text className="text-xs text-neutral-600 mt-1 mb-4 leading-relaxed">
            Cadastre novos câmpus ou polos do IFSP para disponibilizá-los como entidades
            responsáveis durante a criação e gestão de eventos.
          </Text>

          <View className="space-y-2.5">
            <Button
              title="Cadastrar Nova Instituição"
              onPress={() => router.push('/instituicoes/cadastro')}
              leftIcon={<Ionicons name="add-circle" size={18} color="#FFFFFF" />}
            />
            <Button
              title="Ver Instituições Cadastradas"
              variant="outline"
              onPress={() => router.push('/instituicoes')}
              leftIcon={<Ionicons name="list" size={18} color="#005C3B" />}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>

        <Button
          title="Sair da Conta"
          variant="outline"
          onPress={signOut}
          leftIcon={<Ionicons name="log-out-outline" size={18} color="#005C3B" />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
