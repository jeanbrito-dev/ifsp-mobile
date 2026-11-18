import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  instituicaoSchema,
  InstituicaoFormData,
} from '../validations/instituicao.schema';
import { useCreateInstituicao } from '../hooks/use-create-instituicao';
import { generateSlug } from '../../../utils/slug';
import { InstituicaoCard } from './instituicao-card';
import { Instituicao } from '../../../types/instituicao';

export interface InstituicaoFormProps {
  initialValues?: Partial<InstituicaoFormData>;
  onSuccess?: (instituicao: Instituicao) => void;
  onCancel?: () => void;
  showEventContextBanner?: boolean;
}

export function InstituicaoForm({
  initialValues,
  onSuccess,
  onCancel,
  showEventContextBanner = true,
}: InstituicaoFormProps) {
  const router = useRouter();
  const createInstituicaoMutation = useCreateInstituicao();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(initialValues?.slug),
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InstituicaoFormData>({
    resolver: zodResolver(instituicaoSchema),
    defaultValues: {
      nome: initialValues?.nome ?? '',
      slug: initialValues?.slug ?? '',
      descricao: initialValues?.descricao ?? '',
      logoUrl: initialValues?.logoUrl ?? '',
    },
  });

  const watchedValues = watch();

  const handleNomeChange = (
    text: string,
    onChangeField: (value: string) => void,
  ) => {
    onChangeField(text);
    if (!isSlugManuallyEdited) {
      const generated = generateSlug(text);
      setValue('slug', generated, { shouldValidate: true });
    }
  };

  const handleSyncSlug = () => {
    const generated = generateSlug(watchedValues.nome || '');
    setValue('slug', generated, { shouldValidate: true });
    setIsSlugManuallyEdited(false);
  };

  const onSubmit = async (data: InstituicaoFormData) => {
    try {
      setServerError(null);
      setSuccessMessage(null);

      const payload = {
        nome: data.nome.trim(),
        slug: data.slug.trim().toLowerCase(),
        descricao: data.descricao?.trim() ? data.descricao.trim() : null,
        logoUrl: data.logoUrl?.trim() ? data.logoUrl.trim() : null,
      };

      const created = await createInstituicaoMutation.mutateAsync(payload);

      setSuccessMessage(
        `Instituição "${created.nome}" cadastrada com sucesso! Já está disponível para seleção em novos eventos.`,
      );

      if (onSuccess) {
        onSuccess(created);
      } else {
        // Redireciona após pequeno delay se não houver callback customizado
        setTimeout(() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)');
          }
        }, 1200);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const responseData = err.response?.data as
          | { message?: string | string[]; error?: string }
          | undefined;

        if (status === 409) {
          setServerError(
            'Já existe uma instituição com este slug ou nome no sistema. Por favor, altere o identificador.',
          );
          return;
        }

        if (responseData?.message) {
          const msg = Array.isArray(responseData.message)
            ? responseData.message.join('\n')
            : responseData.message;
          setServerError(msg);
          return;
        }

        if (responseData?.error) {
          setServerError(responseData.error);
          return;
        }

        if (err.code === 'ERR_NETWORK') {
          setServerError(
            'Não foi possível conectar ao servidor. Verifique a URL da API no .env e sua conexão de rede.',
          );
          return;
        }
      }

      setServerError(
        'Não foi possível concluir o cadastro da instituição. Tente novamente.',
      );
    }
  };

  const isBusy = isSubmitting || createInstituicaoMutation.isPending;

  return (
    <View className="w-full">
      {/* Banner de Contexto de Eventos */}
      {showEventContextBanner && (
        <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5 flex-row items-start">
          <View className="w-8 h-8 rounded-full bg-[#005C3B]/10 items-center justify-center mr-3 mt-0.5">
            <Ionicons name="information-circle" size={20} color="#005C3B" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-[#005C3B] uppercase tracking-wider mb-1">
              Uso nos Cadastros de Eventos
            </Text>
            <Text className="text-xs text-neutral-700 leading-relaxed">
              As instituições cadastradas representam câmpus, polos ou organizadores. Ao
              criar um evento, a instituição será vinculada para centralizar programações,
              inscrições e relatórios.
            </Text>
          </View>
        </View>
      )}

      {/* Alerta de Sucesso */}
      {successMessage && (
        <View className="bg-green-50 border border-green-200 rounded-xl p-3.5 mb-4 flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#15803D" />
          <Text className="text-green-800 text-xs font-semibold ml-2.5 flex-1">
            {successMessage}
          </Text>
        </View>
      )}

      {/* Alerta de Erro */}
      {serverError && (
        <View className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <Text className="text-red-700 text-xs font-medium ml-2.5 flex-1">
            {serverError}
          </Text>
        </View>
      )}

      {/* Campo: Nome da Instituição */}
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome da Instituição *"
            placeholder="Ex.: IFSP - Câmpus São Paulo"
            value={value}
            onChangeText={(text) => handleNomeChange(text, onChange)}
            onBlur={onBlur}
            error={errors.nome?.message}
            leftIcon={<Ionicons name="business-outline" size={18} color="#6B7280" />}
          />
        )}
      />

      {/* Campo: Slug (Identificador Único) */}
      <View className="w-full mb-1">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-sm font-medium text-neutral-700">
            Slug (Identificador URL) *
          </Text>
          <TouchableOpacity
            onPress={handleSyncSlug}
            className="flex-row items-center"
            accessibilityRole="button"
          >
            <Ionicons name="refresh-outline" size={13} color="#005C3B" />
            <Text className="text-xs font-semibold text-[#005C3B] ml-1">
              Gerar do nome
            </Text>
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="slug"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="ex: ifsp-campus-sao-paulo"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onChangeText={(text) => {
                setIsSlugManuallyEdited(true);
                onChange(text);
              }}
              onBlur={onBlur}
              error={errors.slug?.message}
              hint="Identificador único utilizado nas URLs e consultas da API."
              leftIcon={<Ionicons name="link-outline" size={18} color="#6B7280" />}
            />
          )}
        />
      </View>

      {/* Campo: Descrição */}
      <View className="w-full mb-1">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-sm font-medium text-neutral-700">Descrição</Text>
          <Text className="text-xs text-neutral-400">
            {watchedValues.descricao?.length || 0}/500
          </Text>
        </View>

        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Informações sobre a instituição, câmpus, cursos ou setor organizador..."
              multiline
              numberOfLines={4}
              maxLength={500}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.descricao?.message}
              hint="Opcional. Exibida nas informações institucionais dos eventos."
              leftIcon={
                <Ionicons name="document-text-outline" size={18} color="#6B7280" />
              }
              style={{ minHeight: 80 }}
            />
          )}
        />
      </View>

      {/* Campo: URL do Logotipo */}
      <Controller
        control={control}
        name="logoUrl"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="URL do Logotipo"
            placeholder="https://exemplo.com/logo-ifsp.png"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            value={value || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.logoUrl?.message}
            hint="Opcional. Link direto (HTTP/HTTPS) para a imagem do brasão ou logotipo."
            leftIcon={<Ionicons name="image-outline" size={18} color="#6B7280" />}
          />
        )}
      />

      {/* Prévia em tempo real */}
      <View className="mt-2 mb-6">
        <InstituicaoCard
          isPreview
          instituicao={{
            nome: watchedValues.nome,
            slug: watchedValues.slug,
            descricao: watchedValues.descricao,
            logoUrl: watchedValues.logoUrl,
          }}
        />
      </View>

      {/* Ações do Formulário */}
      <Button
        title="Cadastrar Instituição"
        onPress={handleSubmit(onSubmit)}
        isLoading={isBusy}
        size="lg"
        leftIcon={
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
        }
      />

      {onCancel ? (
        <Button
          title="Cancelar"
          variant="ghost"
          onPress={onCancel}
          disabled={isBusy}
          style={{ marginTop: 8 }}
        />
      ) : (
        <Button
          title="Voltar"
          variant="ghost"
          onPress={() => router.back()}
          disabled={isBusy}
          style={{ marginTop: 8 }}
        />
      )}
    </View>
  );
}

