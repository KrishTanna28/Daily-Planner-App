import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { NoticeBanner } from '../../components/ui/NoticeBanner';
import { TaskCard } from '../../components/ui/TaskCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUserThunk } from '../../redux/slices/authSlice';
import {
  deleteTaskThunk,
  dismissDailyResetNotice,
  loadTasksThunk,
  selectVisibleTasks,
  setTaskFilter,
  setTaskSearchQuery,
  toggleTaskStatusThunk,
} from '../../redux/slices/tasksSlice';
import { colors } from '../../theme/colors';
import { AppStackParamList, TaskFilter } from '../../types';
import { dashboardScreenStyles as styles } from './DashboardScreen.styles';

const filterOptions: TaskFilter[] = ['all', 'pending', 'completed'];

const filterLabelMap: Record<TaskFilter, string> = {
  all: 'All',
  pending: 'Pending',
  completed: 'Completed',
};

type DashboardScreenProps = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const dispatch = useAppDispatch();
  const { sessionUser, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
  const { activeFilter, didDailyReset, errorMessage, isLoading: isTasksLoading, items, searchQuery } = useAppSelector(
    (state) => state.tasks,
  );
  const visibleTasks = useAppSelector(selectVisibleTasks);
  const todayDateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const isBusy = isTasksLoading || isAuthLoading;

  useEffect(() => {
    if (!sessionUser?.email) {
      return;
    }

    void dispatch(loadTasksThunk());
  }, [dispatch, sessionUser?.email]);

  const handleFilterPress = (filter: TaskFilter) => {
    dispatch(setTaskFilter(filter));
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Hello, {sessionUser?.fullName ?? 'Planner User'}!</Text>
        <Text style={styles.date}>{todayDateLabel}</Text>

        {didDailyReset ? (
          <NoticeBanner
            dismissLabel="Hide"
            message="A new day has started. Previous-day tasks were cleared automatically."
            onDismiss={() => dispatch(dismissDailyResetNotice())}
          />
        ) : null}

        <View style={styles.searchSection}>
          <CustomInput
            label="Search tasks"
            onChangeText={(value) => dispatch(setTaskSearchQuery(value))}
            placeholder="Search by title or description"
            value={searchQuery}
          />
        </View>

        <View style={styles.filterRow}>
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => handleFilterPress(filter)}
                style={[styles.filterButton, isActive ? styles.filterButtonActive : null]}
              >
                <Text style={[styles.filterButtonText, isActive ? styles.filterButtonTextActive : null]}>
                  {filterLabelMap[filter]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {isTasksLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading tasks...</Text>
          </View>
        ) : null}

        {!isTasksLoading && items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks for today!</Text>
            <Text style={styles.emptyText}>Tap Add Task to create your first plan for today.</Text>
          </View>
        ) : null}

        {!isTasksLoading && items.length > 0 && visibleTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matching tasks</Text>
            <Text style={styles.emptyText}>Try changing the search text or active filter.</Text>
          </View>
        ) : null}

        {!isTasksLoading && visibleTasks.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={visibleTasks}
            keyExtractor={(task) => task.id}
            renderItem={({ item }) => (
              <TaskCard
                isBusy={isBusy}
                onDelete={(taskId) => {
                  void dispatch(deleteTaskThunk({ taskId }));
                }}
                onEdit={(taskId) => {
                  navigation.navigate('EditTask', { taskId });
                }}
                onToggleStatus={(taskId) => {
                  void dispatch(toggleTaskStatusThunk({ taskId }));
                }}
                task={item}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : null}

        <View style={styles.actionRow}>
          <View style={styles.actionButton}>
            <CustomButton onPress={() => navigation.navigate('AddTask')} title="Add Task" />
          </View>
          <View style={styles.actionButton}>
            <CustomButton
              loading={isAuthLoading}
              onPress={() => dispatch(logoutUserThunk())}
              title="Logout"
              variant="danger"
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
