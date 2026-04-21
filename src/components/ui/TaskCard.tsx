import { Ionicons } from '@expo/vector-icons';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { Task } from '../../types';
import { taskCardStyles as styles } from './TaskCard.styles';

type TaskCardProps = {
  task: Task;
  onToggleStatus: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isBusy?: boolean;
};

export function TaskCard({ task, onToggleStatus, onEdit, onDelete, isBusy = false }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const statusLabel = isCompleted ? 'Completed' : 'Pending';

  const handleToggleStatus = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleStatus(task.id);
  };

  const handleDelete = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Pressable
      accessibilityHint="Opens the edit task screen"
      accessibilityRole="button"
      onPress={() => onEdit(task.id)}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.topRow}>
        <Pressable
          accessibilityLabel={isCompleted ? 'Mark task pending' : 'Mark task completed'}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted, disabled: isBusy }}
          disabled={isBusy}
          hitSlop={8}
          onPress={handleToggleStatus}
          style={[styles.checkbox, isCompleted ? styles.checkboxChecked : null]}
        >
          {isCompleted ? <Ionicons color={colors.surface} name="checkmark" size={16} /> : null}
        </Pressable>

        <View style={styles.textBlock}>
          <Text numberOfLines={2} style={[styles.title, isCompleted ? styles.titleCompleted : null]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text numberOfLines={2} style={styles.description}>
              {task.description}
            </Text>
          ) : null}
        </View>

        <Pressable
          accessibilityLabel="Delete task"
          accessibilityRole="button"
          disabled={isBusy}
          hitSlop={8}
          onPress={handleDelete}
          style={styles.iconButton}
        >
          <Ionicons color={colors.danger} name="trash-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.dueTimeWrap}>
          <Ionicons color={colors.primary} name="time-outline" size={15} />
          <Text style={styles.dueTime}>{task.dueTime ? task.dueTime : 'No time'}</Text>
        </View>
        <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}
