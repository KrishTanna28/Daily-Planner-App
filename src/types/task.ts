export type TaskStatus = 'pending' | 'completed';

export type TaskFilter = 'all' | TaskStatus;

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueTime?: string;
  status: TaskStatus;
  createdAt: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueTime?: string;
};

export type UpdateTaskPayload = {
  title: string;
  description?: string;
  dueTime?: string;
  status?: TaskStatus;
};

export type TasksState = {
  items: Task[];
  isLoading: boolean;
  errorMessage: string | null;
  activeFilter: TaskFilter;
  searchQuery: string;
  didDailyReset: boolean;
};
