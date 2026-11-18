import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Instituicao } from '../../../types/instituicao';

interface InstituicaoCardProps {
  instituicao: Partial<Instituicao>;
  onPress?: () => void;
  selected?: boolean;
  isPreview?: boolean;
}

export function InstituicaoCard({
  instituicao,
  onPress,
  selected = false,
  isPreview = false,
}: InstituicaoCardProps) {
  const { nome, slug, descricao, logoUrl, _count } = instituicao;

  const content = (
    <View
      className={`bg-white rounded-2xl p-4 border ${
        selected
          ? 'border-[#005C3B] bg-emerald-50/30'
          : isPreview
            ? 'border-dashed border-neutral-300'
            : 'border-neutral-200'
      } shadow-xs`}
    >
      {isPreview && (
        <View className="flex-row items-center justify-between mb-3 pb-2 border-b border-neutral-100">
          <View className="flex-row items-center">
            <Ionicons name="eye-outline" size={14} color="#6B7280" />
            <Text className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">
              Prévia de exibição em eventos
            </Text>
          </View>
          <View className="bg-amber-100 px-2 py-0.5 rounded-full">
            <Text className="text-[10px] font-bold text-amber-800">EM TEMPO REAL</Text>
          </View>
        </View>
      )}

      <View className="flex-row items-start">
        {logoUrl && logoUrl.trim() !== '' ? (
          <Image
            source={{ uri: logoUrl }}
            style={{ width: 48, height: 48, borderRadius: 12 }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View className="w-12 h-12 rounded-xl bg-neutral-100 items-center justify-center border border-neutral-200">
            <Ionicons name="business" size={24} color="#9CA3AF" />
          </View>
        )}

        <View className="flex-1 ml-3.5">
          <View className="flex-row items-center justify-between flex-wrap gap-1">
            <Text
              className="text-base font-bold text-neutral-900 flex-1 mr-2"
              numberOfLines={2}
            >
              {nome && nome.trim() !== '' ? nome : 'Nome da Instituição'}
            </Text>

            {slug && slug.trim() !== '' && (
              <View className="bg-neutral-100 px-2.5 py-0.5 rounded-md self-start border border-neutral-200">
                <Text className="text-[11px] font-mono text-neutral-600 font-medium">
                  #{slug}
                </Text>
              </View>
            )}
          </View>

          {descricao && descricao.trim() !== '' ? (
            <Text
              className="text-xs text-neutral-600 mt-1.5 leading-relaxed"
              numberOfLines={isPreview ? 3 : 2}
            >
              {descricao}
            </Text>
          ) : (
            <Text className="text-xs text-neutral-400 italic mt-1.5">
              Sem descrição cadastrada
            </Text>
          )}

          <View className="flex-row items-center mt-3 pt-2.5 border-t border-neutral-100">
            <View className="flex-row items-center mr-4">
              <Ionicons name="calendar-outline" size={13} color="#005C3B" />
              <Text className="text-[11px] font-medium text-neutral-600 ml-1">
                {typeof _count?.eventos === 'number'
                  ? `${_count.eventos} eventos vinculados`
                  : 'Pronta para vincular a eventos'}
              </Text>
            </View>

            {selected && (
              <View className="flex-row items-center ml-auto">
                <Ionicons name="checkmark-circle" size={16} color="#005C3B" />
                <Text className="text-xs font-bold text-[#005C3B] ml-1">Selecionada</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

