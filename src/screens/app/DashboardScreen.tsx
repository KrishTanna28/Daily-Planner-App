import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { CustomButton } from '../../components/ui/CustomButton';
import { CustomInput } from '../../components/ui/CustomInput';
import { TaskCard } from '../../components/ui/TaskCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logoutUserThunk } from '../../redux/slices/authSlice';
import {
  deleteTaskThunk,
  loadTasksThunk,
  selectVisibleTasks,
  setTaskFilter,
  setTaskSearchQuery,
  toggleTaskStatusThunk,
} from '../../redux/slices/tasksSlice';
import { colors } from '../../theme/colors';
import { AppStackParamList, TaskFilter } from '../../types';
import { dashboardScreenStyles as styles } from './DashboardScreen.styles';

const filterOptions: TaskFilter[] = ['all', 'completed', 'pending'];

const filterLabelMap: Record<TaskFilter, string> = {
  all: 'All',
  pending: 'Pending',
  completed: 'Completed',
};

type DashboardScreenProps = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const dispatch = useAppDispatch();
  const { sessionUser, isLoading: isAuthLoading } = useAppSelector((state) => state.auth);
  const { activeFilter, errorMessage, isLoading: isTasksLoading, items, searchQuery } = useAppSelector(
    (state) => state.tasks,
  );
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const visibleTasks = useAppSelector(selectVisibleTasks);
  const todayDateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      setIsLogoutModalVisible(false);
    } catch {
      setIsLogoutModalVisible(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>Hello, {sessionUser?.fullName}!</Text>
            <Text style={styles.date}>{todayDateLabel}</Text>
          </View>
          <Pressable
            accessibilityLabel="Logout"
            accessibilityRole="button"
            onPress={() => setIsLogoutModalVisible(true)}
            style={styles.logoutButton}
          >
            <Ionicons color={colors.textPrimary} name="log-out-outline" size={22} />
          </Pressable>
        </View>

        <View style={styles.searchSection}>
          <CustomInput
            label="Search tasks"
            leftIcon={<Ionicons color={colors.textSecondary} name="search-outline" size={20} />}
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
            <View style={styles.emptyIcon}>
              <Ionicons color={colors.primary} name="calendar-clear-outline" size={30} />
            </View>
            <Text style={styles.emptyTitle}>No tasks for today!</Text>
            <Text style={styles.emptyText}>Create your first plan and keep the day easy to scan.</Text>
            <View style={styles.emptyAction}>
              <CustomButton onPress={() => navigation.navigate('AddTask')} title="Add Task" />
            </View>
          </View>
        ) : null}

        {!isTasksLoading && items.length > 0 && visibleTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons color={colors.primary} name="search-outline" size={30} />
            </View>
            <Text style={styles.emptyTitle}>No matching tasks</Text>
            <Text style={styles.emptyText}>Try changing the search text or active filter.</Text>
          </View>
        ) : null}

        {!isTasksLoading && visibleTasks.length > 0 ? (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={visibleTasks}
            keyExtractor={(task) => task.id}
            style={styles.taskList}
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

        <Pressable
          accessibilityLabel="Add task"
          accessibilityRole="button"
          onPress={() => navigation.navigate('AddTask')}
          style={({ pressed }) => [styles.fab, pressed ? styles.fabPressed : null]}
        >
          <Ionicons color={colors.surface} name="add" size={30} />
        </Pressable>

        <Modal
          animationType="fade"
          onRequestClose={() => setIsLogoutModalVisible(false)}
          transparent
          visible={isLogoutModalVisible}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalIcon}>
                <Ionicons color={colors.danger} name="log-out-outline" size={24} />
              </View>
              <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
              <Text style={styles.modalText}>Your tasks stay saved locally for this account.</Text>

              <View style={styles.modalActions}>
                <View style={styles.modalButton}>
                  <CustomButton
                    disabled={isAuthLoading}
                    onPress={() => setIsLogoutModalVisible(false)}
                    title="Cancel"
                    variant="secondary"
                  />
                </View>
                <View style={styles.modalButton}>
                  <CustomButton
                    loading={isAuthLoading}
                    onPress={handleLogout}
                    title="Yes"
                    variant="danger"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
}
