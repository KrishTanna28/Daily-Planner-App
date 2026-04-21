import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { TaskForm } from '../../components/ui/TaskForm';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTaskThunk } from '../../redux/slices/tasksSlice';
import { AppStackParamList } from '../../types';
import { FormErrors, TaskFormValues, hasValidationErrors, validateTaskForm } from '../../utils/validation';
import { taskEditorScreenStyles as styles } from './TaskEditorScreen.styles';

type AddTaskScreenProps = NativeStackScreenProps<AppStackParamList, 'AddTask'>;

const initialFormValues: TaskFormValues = {
  title: '',
  description: '',
  dueTime: '',
};

export function AddTaskScreen({ navigation }: AddTaskScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.tasks.isLoading);
  const [values, setValues] = useState<TaskFormValues>(initialFormValues);
  const [errors, setErrors] = useState<FormErrors<TaskFormValues>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: keyof TaskFormValues, value: string) => {
    setValues((previousState) => ({
      ...previousState,
      [field]: value,
    }));

    setErrors((previousState) => ({
      ...previousState,
      [field]: undefined,
    }));

    setSubmitError(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validateTaskForm(values);
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    try {
      await dispatch(addTaskThunk(values)).unwrap();
      navigation.goBack();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to add task right now.');
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Add Task</Text>
        <Text style={styles.subtitle}>Create a task for today and keep your plan focused.</Text>

        <TaskForm
          errors={errors}
          isLoading={isLoading}
          onChangeField={updateField}
          onSubmit={handleSubmit}
          submitError={submitError}
          submitLabel="Save Task"
          values={values}
        />
      </View>
    </ScreenContainer>
  );
}
