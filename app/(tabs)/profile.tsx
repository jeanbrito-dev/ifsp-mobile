import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Controller,
  useForm,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

// TODO (backend): trocar estes dados de exemplo pelos dados reais da API (GET /users/me).
const MOCK_USER = {
  name: 'Maysa Alves',
  email: 'maysa.alves@aluno.ifsp.edu.br',
  phone: '(11) 91234-5678',
};

             /* validações */

const profileSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo'),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v === '' || [10, 11].includes(v.replace(/\D/g, '').length),
      'Telefone inválido. Informe o DDD e o número',
    ),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual'),
    newPassword: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Inclua ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Inclua ao menos um número'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });
type PasswordForm = z.infer<typeof passwordSchema>;

              /*  utilitários  */

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (parts[0].charAt(0) + last).toUpperCase();
}

            /*  componentes pequenos  */

type FieldProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  formatValue?: (value: string) => string;
};

function Field<T extends FieldValues>({
  control,
  name,
  label,
  formatValue,
  ...inputProps
}: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View className="gap-1.5">
          <Text className="text-sm font-medium text-gray-800">{label}</Text>
          <TextInput
            {...inputProps}
            accessibilityLabel={label}
            value={String(field.value ?? '')}
            onChangeText={(text) => field.onChange(formatValue ? formatValue(text) : text)}
            onBlur={field.onBlur}
            className={`min-h-12 rounded-xl border bg-white px-3 text-base text-gray-900 ${
              fieldState.error ? 'border-red-600' : 'border-gray-300'
            }`}
          />
          {fieldState.error ? (
            <Text accessibilityLiveRegion="polite" className="text-sm text-red-600">
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}

function Button({
  title,
  onPress,
  danger = false,
}: {
  title: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      className={`min-h-12 items-center justify-center rounded-xl px-5 active:opacity-80 ${
        danger ? 'border border-red-600 bg-white' : 'bg-brand'
      }`}>
      <Text className={`text-base font-semibold ${danger ? 'text-red-600' : 'text-white'}`}>
        {title}
      </Text>
    </Pressable>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <Text accessibilityRole="header" className="text-lg font-bold text-brand">
        {title}
      </Text>
      {children}
    </View>
  );
}

            /*  formulários  */

function EditProfileCard() {
  const { control, handleSubmit } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: MOCK_USER.name, phone: MOCK_USER.phone },
  });

  const onSubmit = handleSubmit((values) => {
    // TODO (backend): enviar `values` para a API (PATCH /users/me).
    console.log('Salvar perfil:', values);
    Alert.alert('Perfil atualizado', 'Suas informações foram salvas.');
  });

  return (
    <Card title="Informações pessoais">
      <Field control={control} name="name" label="Nome completo" autoCapitalize="words" />
      <Field
        control={control}
        name="phone"
        label="Telefone (opcional)"
        keyboardType="phone-pad"
        formatValue={formatPhone}
      />
      <View className="gap-1.5">
        <Text className="text-sm font-medium text-gray-800">E-mail</Text>
        <View className="min-h-12 justify-center rounded-xl border border-gray-200 bg-gray-100 px-3">
          <Text className="text-base text-gray-600">{MOCK_USER.email}</Text>
        </View>
      </View>
      <Button title="Salvar alterações" onPress={() => void onSubmit()} />
    </Card>
  );
}

function ChangePasswordCard() {
  const { control, handleSubmit, reset } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    // TODO (backend): enviar para a API (PUT /users/me/password).
    console.log('Alterar senha para:', values.newPassword.length, 'caracteres');
    reset();
    Alert.alert('Senha alterada', 'Sua senha foi atualizada com sucesso.');
  });

  return (
    <Card title="Alterar senha">
      <Field
        control={control}
        name="currentPassword"
        label="Senha atual"
        secureTextEntry
        autoCapitalize="none"
      />
      <Field
        control={control}
        name="newPassword"
        label="Nova senha"
        secureTextEntry
        autoCapitalize="none"
      />
      <Field
        control={control}
        name="confirmPassword"
        label="Confirmar nova senha"
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Alterar senha" onPress={() => void onSubmit()} />
    </Card>
  );
}

          /*  tela */

export default function ProfileRoute() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair do IFSP Eventos?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        // TODO (auth): apagar os tokens do Secure Store e ir para a tela de login.
        onPress: () => router.replace('/'),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-4 p-4 pb-10">
          <View className="items-center gap-2 py-4">
            <View
              accessible
              accessibilityLabel={`Avatar de ${MOCK_USER.name}`}
              className="h-24 w-24 items-center justify-center rounded-full bg-brand">
              <Text className="text-3xl font-bold text-white">
                {getInitials(MOCK_USER.name)}
              </Text>
            </View>
            <Text accessibilityRole="header" className="text-xl font-bold text-gray-900">
              {MOCK_USER.name}
            </Text>
            <Text className="text-base text-gray-500">{MOCK_USER.email}</Text>
          </View>

          <EditProfileCard />
          <ChangePasswordCard />
          <Button title="Sair da conta" danger onPress={handleLogout} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}