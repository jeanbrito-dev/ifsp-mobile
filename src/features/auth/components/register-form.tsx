import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { registerSchema, RegisterFormData } from '../validations/auth.schema';
import { useAuth } from '../hooks/use-auth';

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmSenha: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      await signUp(data);
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
        if (err.code === 'ERR_NETWORK') {
          setServerError('Não foi possível conectar ao servidor. Verifique sua conexão.');
          return;
        }
      }
      setServerError('Não foi possível concluir o cadastro. Tente novamente.');
    }
  };

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
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome Completo"
            placeholder="Seu nome"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.nome?.message}
            leftIcon={<Ionicons name="person-outline" size={18} color="#6B7280" />}
          />
        )}
      />

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
        name="senha"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Senha"
            placeholder="Mínimo de 6 caracteres"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.senha?.message}
            leftIcon={<Ionicons name="lock-closed-outline" size={18} color="#6B7280" />}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmSenha"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirmar Senha"
            placeholder="Repita sua senha"
            isPassword
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmSenha?.message}
            leftIcon={
              <Ionicons name="shield-checkmark-outline" size={18} color="#6B7280" />
            }
          />
        )}
      />

      <Button
        title="Criar Conta"
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        size="lg"
        style={{ marginTop: 8 }}
      />

      <View className="flex-row items-center justify-center mt-6">
        <Text className="text-sm text-neutral-600">Já possui uma conta? </Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
        >
          <Text className="text-sm font-semibold text-[#005C3B]">Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
