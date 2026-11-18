import React, { useState, forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      isPassword = false,
      leftIcon,
      containerClassName,
      style,
      ...rest
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const hasError = Boolean(error);

    const getBorderColor = () => {
      if (hasError) return 'border-red-500';
      if (isFocused) return 'border-[#005C3B] ring-1 ring-[#005C3B]';
      return 'border-neutral-300';
    };

    const isMultiline = Boolean(rest.multiline);

    return (
      <View className="w-full mb-4">
        {label && (
          <Text className="text-sm font-medium text-neutral-700 mb-1.5">{label}</Text>
        )}

        <View
          className={`flex-row ${
            isMultiline ? 'items-start py-3' : 'items-center py-2.5'
          } bg-neutral-50 rounded-xl border px-3.5 min-h-[48px] ${getBorderColor()} ${
            containerClassName ?? ''
          }`}
        >
          {leftIcon && (
            <View className={isMultiline ? 'mr-2.5 mt-0.5' : 'mr-2.5'}>
              {leftIcon}
            </View>
          )}

          <TextInput
            ref={ref}
            className="flex-1 text-base text-neutral-900 p-0"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isPassword && !isPasswordVisible}
            textAlignVertical={isMultiline ? 'top' : 'center'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={style}
            {...rest}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="p-1 -mr-1"
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Exibir senha'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          )}
        </View>

        {error && <Text className="text-xs text-red-600 mt-1 font-medium">{error}</Text>}

        {!error && hint && <Text className="text-xs text-neutral-500 mt-1">{hint}</Text>}
      </View>
    );
  },
);

Input.displayName = 'Input';
