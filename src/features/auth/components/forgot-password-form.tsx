import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { isAxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../validations/auth.schema';
import { useForgotPassword } from '../hooks/use-forgot-password';

export function ForgotPasswordForm() {
  const router = useRouter();
  const { mutateAsync: sendResetCode, isPending } = useForgotPassword();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setServerError(null);
      setSuccessMessage(null);
      const res = await sendResetCode(data);
      setSentEmail(data.email);
      setSuccessMessage(
        res.message ||
          'Se o e-mail informado estiver cadastrado, um código de verificação foi enviado.',
      );
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
      }
      setServerError('Não foi possível solicitar a recuperação. Tente novamente.');
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

      {successMessage && (
        <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="checkmark-circle" size={22} color="#059669" />
            <Text className="text-emerald-900 font-semibold text-sm ml-2">
              Código enviado!
            </Text>
          </View>
          <Text className="text-emerald-800 text-xs mb-3">{successMessage}</Text>
          <Button
            title="Inserir Código e Redefinir Senha"
            onPress={() =>
              router.push({
                pathname: '/(auth)/reset-password',
                params: { email: sentEmail },
              })
            }
            size="sm"
          />
        </View>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="E-mail Cadastrado"
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

      <Button
        title="Enviar Código de Recuperação"
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        size="lg"
        style={{ marginTop: 8 }}
      />

      <View className="flex-row items-center justify-center mt-6 space-x-4">
        <TouchableOpacity
          onPress={() => router.push('/(auth)/reset-password')}
          accessibilityRole="button"
        >
          <Text className="text-sm font-medium text-[#005C3B]">Já possui o código?</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center mt-4">
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
