import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../../src/features/auth/components/auth-header';
import { LoginForm } from '../../src/features/auth/components/login-form';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="max-w-md w-full mx-auto">
            <AuthHeader
              title="IFSP Eventos"
              subtitle="Entre com seu e-mail institucional e senha para acessar os eventos e atividades acadêmicas"
              iconName="school"
            />
            <LoginForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
