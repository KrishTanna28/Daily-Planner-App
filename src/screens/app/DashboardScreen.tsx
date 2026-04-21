import { Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CustomButton } from '../../components/ui/CustomButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUserThunk } from '../../redux/slices/authSlice';
import { dashboardScreenStyles as styles } from './DashboardScreen.styles';

export function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { sessionUser, isLoading } = useAppSelector((state) => state.auth);
  const todayDateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Hello, {sessionUser?.fullName ?? 'Planner User'}!</Text>
        <Text style={styles.date}>{todayDateLabel}</Text>
        <Text style={styles.subtitle}>
          Task management modules are next. Authentication and session persistence are now active.
        </Text>

        <View style={styles.actionRow}>
          <CustomButton
            loading={isLoading}
            onPress={() => dispatch(logoutUserThunk())}
            title="Logout"
            variant="danger"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
