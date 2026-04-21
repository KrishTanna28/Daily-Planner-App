export const STORAGE_KEYS = {
  users: '@daily-planner/users',
  session: '@daily-planner/session',
  lastResetDate: '@daily-planner/last-reset-date',
  tasksPrefix: '@daily-planner/tasks/',
} as const;

export const getTasksStorageKey = (email: string) =>
  `${STORAGE_KEYS.tasksPrefix}${email.trim().toLowerCase()}`;
