import { ActivityIndicator, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppLogo } from '../../components/ui/AppLogo';
import { colors } from '../../theme/colors';
import { splashScreenStyles as styles } from './SplashScreen.styles';

export function SplashScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.logoArea}>
          <AppLogo subtitle="Daily tasks, neatly handled." />
        </View>
        <View style={styles.loadingArea}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Preparing your planner...</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
