import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const registerScreenStyles = StyleSheet.create({
  content: {
    justifyContent: 'flex-start',
    minHeight: '100%',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  logoWrap: {
    marginBottom: spacing.xl,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  buttonGroup: {
    marginTop: spacing.md,
  },
  helperRow: {
    marginTop: spacing.lg,
  },
  linkButton: {
    alignSelf: 'center',
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.md,
  },
});
