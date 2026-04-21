import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/redux/store';
import { appStyles } from './src/theme/appStyles';
import { colors } from './src/theme/colors';

const appNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={appStyles.root}>
      <Provider store={store}>
        <NavigationContainer theme={appNavigationTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}
