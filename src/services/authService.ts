import { STORAGE_KEYS } from '../constants/storageKeys';
import { SessionUser, StoredUser } from '../types';
import { getJsonItem, removeStorageItem, setJsonItem } from './storageService';

type RegisterUserInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginUserInput = {
  email: string;
  password: string;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const toSessionUser = (user: StoredUser): SessionUser => ({
  fullName: user.fullName,
  email: user.email,
});

export async function getStoredUsers(): Promise<StoredUser[]> {
  return getJsonItem<StoredUser[]>(STORAGE_KEYS.users, []);
}

async function persistUsers(users: StoredUser[]): Promise<void> {
  await setJsonItem(STORAGE_KEYS.users, users);
}

export async function registerUser(input: RegisterUserInput): Promise<void> {
  const users = await getStoredUsers();
  const normalizedEmail = normalizeEmail(input.email);

  const isAlreadyRegistered = users.some((user) => normalizeEmail(user.email) === normalizedEmail);

  if (isAlreadyRegistered) {
    throw new Error('This email is already registered.');
  }

  const newUser: StoredUser = {
    fullName: input.fullName.trim(),
    email: normalizedEmail,
    password: input.password,
  };

  await persistUsers([...users, newUser]);
}

export async function loginUser(input: LoginUserInput): Promise<SessionUser> {
  const users = await getStoredUsers();
  const normalizedEmail = normalizeEmail(input.email);
  const matchedUser = users.find((user) => normalizeEmail(user.email) === normalizedEmail);

  if (!matchedUser) {
    throw new Error('No account found with this email.');
  }

  if (matchedUser.password !== input.password) {
    throw new Error('Incorrect password.');
  }

  const sessionUser = toSessionUser(matchedUser);
  await setJsonItem(STORAGE_KEYS.session, sessionUser);

  return sessionUser;
}

export async function getSavedSession(): Promise<SessionUser | null> {
  return getJsonItem<SessionUser | null>(STORAGE_KEYS.session, null);
}

export async function clearSavedSession(): Promise<void> {
  await removeStorageItem(STORAGE_KEYS.session);
}
