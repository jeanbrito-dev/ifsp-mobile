import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const getVariantContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#005C3B] active:bg-[#00472e] border-transparent';
      case 'secondary':
        return 'bg-[#F9C800] active:bg-[#e0b400] border-transparent';
      case 'outline':
        return 'bg-transparent border border-[#005C3B] active:bg-[#005C3B]/10';
      case 'ghost':
        return 'bg-transparent active:bg-neutral-100 border-transparent';
      default:
        return 'bg-[#005C3B] border-transparent';
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'primary':
        return 'text-white font-semibold';
      case 'secondary':
        return 'text-[#1F2937] font-semibold';
      case 'outline':
        return 'text-[#005C3B] font-semibold';
      case 'ghost':
        return 'text-[#005C3B] font-medium';
      default:
        return 'text-white font-semibold';
    }
  };

  const getSizeContainerStyle = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 rounded-lg min-h-[36px]';
      case 'lg':
        return 'py-4 px-6 rounded-xl min-h-[52px]';
      case 'md':
      default:
        return 'py-3.5 px-4 rounded-xl min-h-[46px]';
    }
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-base';
    }
  };

  const getSpinnerColor = () => {
    if (variant === 'primary') return '#FFFFFF';
    if (variant === 'secondary') return '#1F2937';
    return '#005C3B';
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      className={`flex-row items-center justify-center border ${getVariantContainerStyle()} ${getSizeContainerStyle()} ${
        isDisabled ? 'opacity-50' : 'opacity-100'
      }`}
      style={style}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor()}
          testID="button-loading"
        />
      ) : (
        <View className="flex-row items-center justify-center space-x-2">
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <Text className={`${getVariantTextStyle()} ${getSizeTextStyle()} text-center`}>
            {title}
          </Text>
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}
