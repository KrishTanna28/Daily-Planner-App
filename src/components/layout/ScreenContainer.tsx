import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenContainerStyles as styles } from './ScreenContainer.styles';

type ScreenContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>;
}
