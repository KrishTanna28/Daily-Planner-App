export type StoredUser = {
  fullName: string;
  email: string;
  password: string;
};

export type SessionUser = Pick<StoredUser, 'fullName' | 'email'>;

export type RegisterUserPayload = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type AuthState = {
  sessionUser: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrating: boolean;
  errorMessage: string | null;
};
