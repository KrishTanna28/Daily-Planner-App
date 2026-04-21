import { ActivityIndicator, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { colors } from '../../theme/colors';
import { splashScreenStyles as styles } from './SplashScreen.styles';

export function SplashScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.title}>Preparing your planner...</Text>
      </View>
    </ScreenContainer>
  );
}
