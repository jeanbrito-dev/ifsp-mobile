import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InstituicaoHeaderProps {
  title?: string;
  subtitle?: string;
}

export function InstituicaoHeader({
  title = 'Nova Instituição',
  subtitle = 'Cadastre câmpus, polos ou entidades que sediarão e organizarão os eventos da plataforma.',
}: InstituicaoHeaderProps) {
  return (
    <View className="mb-6">
      <View className="flex-row items-center space-x-3 mb-2">
        <View className="w-12 h-12 rounded-2xl bg-[#005C3B] items-center justify-center shadow-sm mr-3">
          <Ionicons name="business" size={24} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-neutral-900 tracking-tight">
            {title}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Ionicons name="calendar-outline" size={12} color="#005C3B" />
            <Text className="text-xs font-semibold text-[#005C3B] ml-1">
              Vínculo com Eventos
            </Text>
          </View>
        </View>
      </View>
      <Text className="text-sm text-neutral-600 leading-relaxed">{subtitle}</Text>
    </View>
  );
}

