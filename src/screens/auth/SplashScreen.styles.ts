import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const splashScreenStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
  },
});
