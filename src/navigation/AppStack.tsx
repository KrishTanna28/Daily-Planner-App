import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddTaskScreen } from '../screens/app/AddTaskScreen';
import { DashboardScreen } from '../screens/app/DashboardScreen';
import { EditTaskScreen } from '../screens/app/EditTaskScreen';
import { AppStackParamList } from '../types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
    </Stack.Navigator>
  );
}
