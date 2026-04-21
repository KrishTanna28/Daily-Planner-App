import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '../screens/app/DashboardScreen';
import { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
    </Stack.Navigator>
  );
}
