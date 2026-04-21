import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const noticeBannerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  dismissButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  dismissText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
