import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const splashScreenStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: 'center',
    flex: 4,
    justifyContent: 'center',
    width: '100%',
  },
  loadingArea: {
    alignItems: 'center',
    flex: 6,
    justifyContent: 'flex-end',
    paddingBottom: 56,
    width: '100%',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
});
