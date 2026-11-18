import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { isAxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { resetPasswordSchema, ResetPasswordFormData } from '../validations/auth.schema';
import { useResetPassword } from '../hooks/use-reset-password';

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: params.email ?? '',
      codigo: '',
      novaSenha: '',
      confirmNovaSenha: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setServerError(null);
      await resetPassword(data);
      setIsSuccess(true);
    } catch (err) {
      if (isAxiosError(err)) {
        const responseData = err.response?.data as
          | { message?: string | string[]; error?: string }
          | undefined;
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
      }
      setServerError(
        'Código inválido ou expirado. Verifique os dados e tente novamente.',
      );
    }
  };

  if (isSuccess) {
    return (
      <View className="w-full items-center py-6">
        <View className="w-16 h-16 rounded-full bg-emerald-100 items-center justify-center mb-4">
          <Ionicons name="checkmark-circle" size={40} color="#059669" />
        </View>
        <Text className="text-xl font-bold text-neutral-900 text-center mb-2">
          Senha alterada com sucesso!
        </Text>
        <Text className="text-sm text-neutral-600 text-center mb-6 px-4">
          Sua senha foi redefinida. Agora você já pode acessar sua conta com a nova senha.
        </Text>
        <Button
          title="Fazer Login"
          onPress={() => router.replace('/(auth)/login')}
          size="lg"
          style={{ width: '100%' }}
        />
      </View>
    );
  }

  return (
    <View className="w-full">
      {serverError && (
        <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <Text className="text-red-700 text-xs font-medium ml-2 flex-1">
            {serverError}
          </Text>
        </View>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="E-mail"
            placeholder="seu.email@ifsp.edu.br"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            leftIcon={<Ionicons name="mail-outline" size={18} color="#6B7280" />}
          />
        )}
      />

      <Controller
        control={control}
        name="codigo"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Código de Verificação"
            placeholder="Código recebido no e-mail"
            autoCapitalize="characters"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.codigo?.message}
            hint="Consulte o código recebido em sua caixa postal"
            leftIcon={<Ionicons name="key-outline" size={18} color="#6B7280" />}
          />
        )}
      />

      <Controller
        control={control}
        name="novaSenha"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nova Senha"
            placeholder="Mínimo de 6 caracteres"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.novaSenha?.message}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#6B7280" />}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmNovaSenha"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirmar Nova Senha"
            placeholder="Repita sua nova senha"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmNovaSenha?.message}
            leftIcon={
              <Ionicons name="shield-checkmark-outline" size={18} color="#6B7280" />
            }
          />
        )}
      />

      <Button
        title="Redefinir Senha"
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        size="lg"
        style={{ marginTop: 8 }}
      />

      <View className="flex-row items-center justify-center mt-6">
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={16} color="#4B5563" />
          <Text className="text-sm font-medium text-neutral-600 ml-1">
            Voltar para o login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
