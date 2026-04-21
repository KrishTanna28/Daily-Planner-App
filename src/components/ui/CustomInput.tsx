import { Text, TextInput, TextInputProps, View } from 'react-native';

import { customInputStyles as styles } from './CustomInput.styles';

type CustomInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  errorText?: string;
} & Omit<TextInputProps, 'value' | 'onChangeText'>;

export function CustomInput({ label, value, onChangeText, errorText, ...rest }: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, errorText ? styles.inputWithError : null]}
      />
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}
