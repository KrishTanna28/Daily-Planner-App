import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CustomButton } from '../../components/ui/CustomButton';
import { TaskForm } from '../../components/ui/TaskForm';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { deleteTaskThunk, loadTasksThunk, updateTaskThunk } from '../../redux/slices/tasksSlice';
import { colors } from '../../theme/colors';
import { AppStackParamList } from '../../types';
import { FormErrors, TaskFormValues, hasValidationErrors, validateTaskForm } from '../../utils/validation';
import { taskEditorScreenStyles as styles } from './TaskEditorScreen.styles';

type EditTaskScreenProps = NativeStackScreenProps<AppStackParamList, 'EditTask'>;
type TaskTouchedFields = Partial<Record<keyof TaskFormValues, boolean>>;

const emptyTaskFormValues: TaskFormValues = {
  title: '',
  description: '',
  dueTime: '',
};

export function EditTaskScreen({ navigation, route }: EditTaskScreenProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.tasks.isLoading);
  const task = useAppSelector((state) =>
    state.tasks.items.find((taskItem) => taskItem.id === route.params.taskId),
  );
  const [values, setValues] = useState<TaskFormValues>(emptyTaskFormValues);
  const [touchedFields, setTouchedFields] = useState<TaskTouchedFields>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasRequestedLoad, setHasRequestedLoad] = useState(false);
  const validationErrors = validateTaskForm(values);
  const isFormValid = !hasValidationErrors(validationErrors);
  const visibleErrors: FormErrors<TaskFormValues> = {
    title: touchedFields.title || wasSubmitted ? validationErrors.title : undefined,
    description: touchedFields.description || wasSubmitted ? validationErrors.description : undefined,
    dueTime: touchedFields.dueTime || wasSubmitted ? validationErrors.dueTime : undefined,
  };

  useEffect(() => {
    if (task) {
      setValues({
        title: task.title,
        description: task.description ?? '',
        dueTime: task.dueTime ?? '',
      });
      return;
    }

    setHasRequestedLoad(true);
    void dispatch(loadTasksThunk());
  }, [dispatch, task]);

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
      await dispatch(
        updateTaskThunk({
          taskId: route.params.taskId,
          values: {
            title: values.title,
            description: values.description,
            dueTime: values.dueTime,
            status: task?.status,
          },
        }),
      ).unwrap();

      navigation.goBack();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to update task right now.');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTaskThunk({ taskId: route.params.taskId })).unwrap();
      navigation.goBack();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Unable to delete task right now.');
    }
  };

  if (!task && (!hasRequestedLoad || isLoading)) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Task</Text>
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading task details...</Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (!task && hasRequestedLoad && !isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Task</Text>
          <Text style={styles.notFoundText}>We could not find this task. It may have been deleted.</Text>

          <View style={styles.fallbackActions}>
            <CustomButton onPress={() => navigation.goBack()} title="Back to Dashboard" variant="secondary" />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Task</Text>
        <Text style={styles.subtitle}>Update task details and keep your schedule accurate.</Text>

        <TaskForm
          errors={visibleErrors}
          isLoading={isLoading}
          onChangeField={updateField}
          onSubmit={handleSubmit}
          submitDisabled={!isFormValid}
          submitError={submitError}
          submitLabel="Update Task"
          values={values}
        />

        <View style={styles.deleteAction}>
          <CustomButton
            disabled={isLoading}
            onPress={handleDelete}
            title="Delete Task"
            variant="danger"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
