import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '../../theme/colors';
import { customInputStyles as styles } from './CustomInput.styles';

type CustomInputProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  errorText?: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
} & Omit<TextInputProps, 'value' | 'onChangeText'>;

export function CustomInput({
  label,
  value,
  onChangeText,
  errorText,
  leftIcon,
  rightAccessory,
  ...rest
}: CustomInputProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, rest.multiline ? styles.inputRowMultiline : null, errorText ? styles.inputWithError : null]}>
        {leftIcon ? <View style={styles.iconWrap}>{leftIcon}</View> : null}
        <TextInput
          {...rest}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, rest.multiline ? styles.multilineInput : null]}
        />
        {rightAccessory ? <View style={styles.iconWrap}>{rightAccessory}</View> : null}
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}
