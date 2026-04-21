import { Text, View } from 'react-native';

import { snackbarStyles as styles } from './Snackbar.styles';

type SnackbarProps = {
  message: string;
  visible: boolean;
};

export function Snackbar({ message, visible }: SnackbarProps) {
  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
