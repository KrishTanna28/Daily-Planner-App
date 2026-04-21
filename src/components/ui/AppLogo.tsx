import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { appLogoStyles as styles } from './AppLogo.styles';

type AppLogoProps = {
  subtitle?: string;
};

export function AppLogo({ subtitle }: AppLogoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Ionicons color={colors.primary} name="checkmark-done" size={22} />
      </View>
      <Text style={styles.title}>Daily Planner</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
