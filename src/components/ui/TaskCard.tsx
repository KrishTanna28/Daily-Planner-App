import { Text, View } from 'react-native';

import { Task } from '../../types';
import { CustomButton } from './CustomButton';
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

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, isCompleted ? styles.titleCompleted : null]}>{task.title}</Text>
        <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>

      {task.description ? <Text style={styles.description}>{task.description}</Text> : null}
      {task.dueTime ? <Text style={styles.dueTime}>Due: {task.dueTime}</Text> : null}

      <View style={styles.actionRow}>
        <View style={styles.actionButton}>
          <CustomButton disabled={isBusy} onPress={() => onEdit(task.id)} title="Edit" variant="primary" />
        </View>
        <View style={styles.actionButton}>
          <CustomButton
            disabled={isBusy}
            onPress={() => onToggleStatus(task.id)}
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
            variant="secondary"
          />
        </View>
        <View style={styles.actionButton}>
          <CustomButton
            disabled={isBusy}
            onPress={() => onDelete(task.id)}
            title="Delete"
            variant="danger"
          />
        </View>
      </View>
    </View>
  );
}
