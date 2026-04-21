import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  clearSavedSession,
  getSavedSession,
  loginUser,
  registerUser,
} from '../../services/authService';
import { AuthState, LoginUserPayload, RegisterUserPayload, SessionUser } from '../../types';

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const hydrateSession = createAsyncThunk<SessionUser | null, void, { rejectValue: string }>(
  'auth/hydrateSession',
  async (_, { rejectWithValue }) => {
    try {
      return await getSavedSession();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to restore your session.'));
    }
  },
);

export const registerUserThunk = createAsyncThunk<void, RegisterUserPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      await registerUser(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to register right now.'));
    }
  },
);

export const loginUserThunk = createAsyncThunk<SessionUser, LoginUserPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await loginUser(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to login right now.'));
    }
  },
);

export const logoutUserThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await clearSavedSession();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to logout right now.'));
    }
  },
);

const initialState: AuthState = {
  sessionUser: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrating: true,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateSession.pending, (state) => {
      state.isHydrating = true;
      state.errorMessage = null;
    });
    builder.addCase(hydrateSession.fulfilled, (state, action) => {
      state.sessionUser = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isHydrating = false;
    });
    builder.addCase(hydrateSession.rejected, (state, action) => {
      state.sessionUser = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
      state.errorMessage = action.payload ?? 'Unable to restore your session.';
    });

    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(registerUserThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to register right now.';
    });

    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sessionUser = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to login right now.';
    });

    builder.addCase(logoutUserThunk.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.sessionUser = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logoutUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload ?? 'Unable to logout right now.';
    });
  },
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
