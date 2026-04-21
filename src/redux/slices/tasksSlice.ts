import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  applyDailyResetIfNeeded,
} from '../../services/dailyResetService';
import {
  createTaskForUser,
  deleteTaskForUser,
  getTasksForUser,
  toggleTaskStatusForUser,
  updateTaskForUser,
} from '../../services/taskService';
import { CreateTaskPayload, Task, TaskFilter, TasksState, UpdateTaskPayload } from '../../types';
import type { RootState } from '../store';
import { logoutUserThunk } from './authSlice';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const getActiveUserEmail = (state: RootState) => {
  const userEmail = state.auth.sessionUser?.email;

  if (!userEmail) {
    throw new Error('No active user session found.');
  }

  return userEmail;
};

type ApplyDailyResetResult = {
  tasks: Task[] | null;
  didReset: boolean;
};

export const loadTasksThunk = createAsyncThunk<Task[], void, { state: RootState; rejectValue: string }>(
  'tasks/loadTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userEmail = getActiveUserEmail(getState());
      return await getTasksForUser(userEmail);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load tasks right now.'));
    }
  },
);

export const applyDailyResetIfNeededThunk = createAsyncThunk<
  ApplyDailyResetResult,
  void,
  { state: RootState; rejectValue: string }
>('tasks/applyDailyResetIfNeeded', async (_, { getState, rejectWithValue }) => {
  try {
    const didReset = await applyDailyResetIfNeeded();

    const userEmail = getState().auth.sessionUser?.email;
    if (!userEmail) {
      return {
        tasks: null,
        didReset,
      };
    }

    return {
      tasks: await getTasksForUser(userEmail),
      didReset,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to apply daily reset right now.'));
  }
});

export const addTaskThunk = createAsyncThunk<
  Task[],
  CreateTaskPayload,
  { state: RootState; rejectValue: string }
>('tasks/addTask', async (payload, { getState, rejectWithValue }) => {
  try {
    const userEmail = getActiveUserEmail(getState());
    return await createTaskForUser(userEmail, payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to add task right now.'));
  }
});

type UpdateTaskThunkPayload = {
  taskId: string;
  values: UpdateTaskPayload;
};

export const updateTaskThunk = createAsyncThunk<
  Task[],
  UpdateTaskThunkPayload,
  { state: RootState; rejectValue: string }
>('tasks/updateTask', async ({ taskId, values }, { getState, rejectWithValue }) => {
  try {
    const userEmail = getActiveUserEmail(getState());
    return await updateTaskForUser(userEmail, taskId, values);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to update task right now.'));
  }
});

export const deleteTaskThunk = createAsyncThunk<
  Task[],
  { taskId: string },
  { state: RootState; rejectValue: string }
>('tasks/deleteTask', async ({ taskId }, { getState, rejectWithValue }) => {
  try {
    const userEmail = getActiveUserEmail(getState());
    return await deleteTaskForUser(userEmail, taskId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to delete task right now.'));
  }
});

export const toggleTaskStatusThunk = createAsyncThunk<
  Task[],
  { taskId: string },
  { state: RootState; rejectValue: string }
>('tasks/toggleTaskStatus', async ({ taskId }, { getState, rejectWithValue }) => {
  try {
    const userEmail = getActiveUserEmail(getState());
    return await toggleTaskStatusForUser(userEmail, taskId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to change task status right now.'));
  }
});

const initialState: TasksState = {
  items: [],
  isLoading: false,
  errorMessage: null,
  activeFilter: 'all',
  searchQuery: '',
  didDailyReset: false,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTaskFilter(state, action: PayloadAction<TaskFilter>) {
      state.activeFilter = action.payload;
    },
    setTaskSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearTasksError(state) {
      state.errorMessage = null;
    },
    clearTasksState() {
      return initialState;
    },
    dismissDailyResetNotice(state) {
      state.didDailyReset = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTasksThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(loadTasksThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(loadTasksThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to load tasks right now.';
    });

    builder.addCase(applyDailyResetIfNeededThunk.fulfilled, (state, action) => {
      if (action.payload.tasks) {
        state.items = action.payload.tasks;
      }

      state.didDailyReset = action.payload.didReset;
    });
    builder.addCase(applyDailyResetIfNeededThunk.rejected, (state, action) => {
      state.errorMessage = action.payload ?? 'Unable to apply daily reset right now.';
    });

    builder.addCase(addTaskThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(addTaskThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(addTaskThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to add task right now.';
    });

    builder.addCase(updateTaskThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(updateTaskThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(updateTaskThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to update task right now.';
    });

    builder.addCase(deleteTaskThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(deleteTaskThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(deleteTaskThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to delete task right now.';
    });

    builder.addCase(toggleTaskStatusThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(toggleTaskStatusThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(toggleTaskStatusThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to change task status right now.';
    });

    builder.addCase(logoutUserThunk.fulfilled, () => initialState);
  },
});

export const {
  setTaskFilter,
  setTaskSearchQuery,
  clearTasksError,
  clearTasksState,
  dismissDailyResetNotice,
} = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

const selectTaskState = (state: RootState) => state.tasks;

export const selectVisibleTasks = (state: RootState) => {
  const { items, activeFilter, searchQuery } = selectTaskState(state);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return items.filter((task) => {
    const isFilterMatch = activeFilter === 'all' || task.status === activeFilter;
    const isQueryMatch =
      !normalizedQuery ||
      task.title.toLowerCase().includes(normalizedQuery) ||
      (task.description?.toLowerCase().includes(normalizedQuery) ?? false);

    return isFilterMatch && isQueryMatch;
  });
};
