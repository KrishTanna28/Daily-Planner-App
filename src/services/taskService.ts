import { getTasksStorageKey } from '../constants/storageKeys';
import { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from '../types';
import { getJsonItem, setJsonItem } from './storageService';

const normalizeOptionalText = (value?: string) => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
};

const buildTaskId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const sortByCreatedAtDescending = (tasks: Task[]) =>
  [...tasks].sort((firstTask, secondTask) =>
    secondTask.createdAt.localeCompare(firstTask.createdAt),
  );

async function persistTasks(email: string, tasks: Task[]): Promise<Task[]> {
  const storageKey = getTasksStorageKey(email);
  const orderedTasks = sortByCreatedAtDescending(tasks);
  await setJsonItem(storageKey, orderedTasks);
  return orderedTasks;
}

export async function getTasksForUser(email: string): Promise<Task[]> {
  const storageKey = getTasksStorageKey(email);
  const tasks = await getJsonItem<Task[]>(storageKey, []);
  return sortByCreatedAtDescending(tasks);
}

export async function createTaskForUser(email: string, payload: CreateTaskPayload): Promise<Task[]> {
  const tasks = await getTasksForUser(email);

  const newTask: Task = {
    id: buildTaskId(),
    title: payload.title.trim(),
    description: normalizeOptionalText(payload.description),
    dueTime: normalizeOptionalText(payload.dueTime),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  return persistTasks(email, [...tasks, newTask]);
}

export async function updateTaskForUser(
  email: string,
  taskId: string,
  payload: UpdateTaskPayload,
): Promise<Task[]> {
  const tasks = await getTasksForUser(email);
  let didUpdate = false;

  const updatedTasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    didUpdate = true;

    return {
      ...task,
      title: payload.title.trim(),
      description: normalizeOptionalText(payload.description),
      dueTime: normalizeOptionalText(payload.dueTime),
      status: payload.status ?? task.status,
    };
  });

  if (!didUpdate) {
    throw new Error('Task not found for update.');
  }

  return persistTasks(email, updatedTasks);
}

export async function deleteTaskForUser(email: string, taskId: string): Promise<Task[]> {
  const tasks = await getTasksForUser(email);
  const filteredTasks = tasks.filter((task) => task.id !== taskId);

  if (filteredTasks.length === tasks.length) {
    throw new Error('Task not found for delete.');
  }

  return persistTasks(email, filteredTasks);
}

export async function toggleTaskStatusForUser(email: string, taskId: string): Promise<Task[]> {
  const tasks = await getTasksForUser(email);
  let didUpdate = false;

  const updatedTasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    didUpdate = true;
    const nextStatus: TaskStatus = task.status === 'pending' ? 'completed' : 'pending';

    return {
      ...task,
      status: nextStatus,
    };
  });

  if (!didUpdate) {
    throw new Error('Task not found for status update.');
  }

  return persistTasks(email, updatedTasks);
}
