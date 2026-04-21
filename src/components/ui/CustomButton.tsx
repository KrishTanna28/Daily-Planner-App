import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '../../theme/colors';
import { customButtonStyles as styles } from './CustomButton.styles';

type CustomButtonVariant = 'primary' | 'secondary' | 'danger';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: CustomButtonVariant;
  disabled?: boolean;
  loading?: boolean;
};

const buttonVariantStyleMap = {
  primary: styles.primaryButton,
  secondary: styles.secondaryButton,
  danger: styles.dangerButton,
} as const;

const textVariantStyleMap = {
  primary: styles.primaryText,
  secondary: styles.secondaryText,
  danger: styles.dangerText,
} as const;

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: CustomButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        buttonVariantStyleMap[variant],
        pressed && !isDisabled ? styles.pressedButton : null,
        isDisabled ? styles.disabledButton : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.textPrimary : colors.surface} />
      ) : (
        <Text style={[styles.textBase, textVariantStyleMap[variant]]}>{title}</Text>
      )}
    </Pressable>
  );
}
