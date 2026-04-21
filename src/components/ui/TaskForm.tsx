import { Text, View } from 'react-native';

import { FormErrors, TaskFormValues } from '../../utils/validation';
import { CustomButton } from './CustomButton';
import { CustomInput } from './CustomInput';
import { taskFormStyles as styles } from './TaskForm.styles';

type TaskFormProps = {
  values: TaskFormValues;
  errors: FormErrors<TaskFormValues>;
  submitLabel: string;
  submitError?: string | null;
  isLoading?: boolean;
  onChangeField: (field: keyof TaskFormValues, value: string) => void;
  onSubmit: () => void;
};

export function TaskForm({
  values,
  errors,
  submitLabel,
  submitError,
  isLoading = false,
  onChangeField,
  onSubmit,
}: TaskFormProps) {
  return (
    <>
      <View style={styles.fieldGroup}>
        <CustomInput
          autoCapitalize="sentences"
          errorText={errors.title}
          label="Task Title"
          onChangeText={(value) => onChangeField('title', value)}
          placeholder="Enter task title"
          value={values.title}
        />
      </View>

      <View style={styles.fieldGroup}>
        <CustomInput
          autoCapitalize="sentences"
          errorText={errors.description}
          label="Task Description (Optional)"
          multiline
          numberOfLines={3}
          onChangeText={(value) => onChangeField('description', value)}
          placeholder="Add notes for this task"
          textAlignVertical="top"
          value={values.description}
        />
      </View>

      <View style={styles.fieldGroup}>
        <CustomInput
          autoCapitalize="none"
          autoCorrect={false}
          errorText={errors.dueTime}
          label="Due Time (HH:mm)"
          onChangeText={(value) => onChangeField('dueTime', value)}
          placeholder="09:30"
          value={values.dueTime}
        />
      </View>

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <View style={styles.actionRow}>
        <CustomButton loading={isLoading} onPress={onSubmit} title={submitLabel} />
      </View>
    </>
  );
}
