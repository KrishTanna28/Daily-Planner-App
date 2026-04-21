import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const taskFormStyles = StyleSheet.create({
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  submitError: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  actionRow: {
    marginTop: spacing.md,
  },
});
