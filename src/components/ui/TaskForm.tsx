import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { GestureResponderEvent, Platform, Pressable, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
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
  submitDisabled?: boolean;
  onChangeField: (field: keyof TaskFormValues, value: string) => void;
  onSubmit: () => void;
};

const canUseNativeTimePicker = Platform.OS === 'android' || Platform.OS === 'ios';

const formatTimeValue = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

const getDateFromTimeValue = (value: string) => {
  const date = new Date();
  const [hours, minutes] = value.split(':').map(Number);

  if (Number.isInteger(hours) && Number.isInteger(minutes)) {
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  date.setHours(9, 0, 0, 0);
  return date;
};

export function TaskForm({
  values,
  errors,
  submitLabel,
  submitError,
  isLoading = false,
  submitDisabled = false,
  onChangeField,
  onSubmit,
}: TaskFormProps) {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const selectedTime = useMemo(() => getDateFromTimeValue(values.dueTime), [values.dueTime]);

  const handleTimeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') {
      setIsTimePickerVisible(false);
    }

    if (selectedDate) {
      onChangeField('dueTime', formatTimeValue(selectedDate));
    }
  };

  const handleClearDueTime = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setIsTimePickerVisible(false);
    onChangeField('dueTime', '');
  };

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
        {canUseNativeTimePicker ? (
          <>
            <Pressable
              accessibilityHint="Opens the time picker"
              accessibilityRole="button"
              onPress={() => setIsTimePickerVisible(true)}
            >
              <CustomInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
                errorText={errors.dueTime}
                label="Due Time"
                leftIcon={<Ionicons color={colors.textSecondary} name="time-outline" size={20} />}
                onChangeText={(value) => onChangeField('dueTime', value)}
                placeholder="Select due time"
                rightAccessory={
                  values.dueTime ? (
                    <Pressable
                      accessibilityLabel="Clear due time"
                      accessibilityRole="button"
                      hitSlop={8}
                      onPress={handleClearDueTime}
                    >
                      <Ionicons color={colors.textSecondary} name="close-circle-outline" size={20} />
                    </Pressable>
                  ) : (
                    <Ionicons color={colors.textSecondary} name="chevron-down-outline" size={20} />
                  )
                }
                value={values.dueTime}
              />
            </Pressable>

            {isTimePickerVisible ? (
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour
                mode="time"
                onChange={handleTimeChange}
                value={selectedTime}
              />
            ) : null}
          </>
        ) : (
          <CustomInput
            autoCapitalize="none"
            autoCorrect={false}
            errorText={errors.dueTime}
            keyboardType="numbers-and-punctuation"
            label="Due Time (HH:mm)"
            leftIcon={<Ionicons color={colors.textSecondary} name="time-outline" size={20} />}
            onChangeText={(value) => onChangeField('dueTime', value)}
            placeholder="09:30"
            value={values.dueTime}
          />
        )}
      </View>

      {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

      <View style={styles.actionRow}>
        <CustomButton disabled={submitDisabled} loading={isLoading} onPress={onSubmit} title={submitLabel} />
      </View>
    </>
  );
}
