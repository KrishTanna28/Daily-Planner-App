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
type TaskTouchedFields = Partial<Record<keyof TaskFormValues, boolean>>;

const initialFormValues: TaskFormValues = {
  title: '',
  description: '',
  dueTime: '',
};

export function AddTaskScreen({ navigation }: AddTaskScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.tasks.isLoading);
  const [values, setValues] = useState<TaskFormValues>(initialFormValues);
  const [touchedFields, setTouchedFields] = useState<TaskTouchedFields>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const validationErrors = validateTaskForm(values);
  const isFormValid = !hasValidationErrors(validationErrors);
  const visibleErrors: FormErrors<TaskFormValues> = {
    title: touchedFields.title || wasSubmitted ? validationErrors.title : undefined,
    description: touchedFields.description || wasSubmitted ? validationErrors.description : undefined,
    dueTime: touchedFields.dueTime || wasSubmitted ? validationErrors.dueTime : undefined,
  };

  const updateField = (field: keyof TaskFormValues, value: string) => {
    setValues((previousState) => ({
      ...previousState,
      [field]: value,
    }));

    setTouchedFields((previousState) => ({
      ...previousState,
      [field]: true,
    }));

    setSubmitError(null);
  };

  const handleSubmit = async () => {
    setWasSubmitted(true);

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
          errors={visibleErrors}
          isLoading={isLoading}
          onChangeField={updateField}
          onSubmit={handleSubmit}
          submitDisabled={!isFormValid}
          submitError={submitError}
          submitLabel="Save Task"
          values={values}
        />
      </View>
    </ScreenContainer>
  );
}
