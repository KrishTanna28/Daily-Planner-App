import { getTasksStorageKey, STORAGE_KEYS } from '../constants/storageKeys';
import { Task } from '../types';
import { getStoredUsers } from './authService';
import { getJsonItem, setJsonItem } from './storageService';

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

async function clearTasksForAllUsers(): Promise<void> {
  const users = await getStoredUsers();
  const uniqueEmails = Array.from(
    new Set(users.map((user) => user.email.trim().toLowerCase()).filter((email) => Boolean(email))),
  );

  await Promise.all(
    uniqueEmails.map((email) => setJsonItem<Task[]>(getTasksStorageKey(email), [])),
  );
}

export async function applyDailyResetIfNeeded(): Promise<boolean> {
  const todayDateKey = toLocalDateKey(new Date());
  const lastResetDate = await getJsonItem<string | null>(STORAGE_KEYS.lastResetDate, null);

  if (!lastResetDate) {
    await setJsonItem(STORAGE_KEYS.lastResetDate, todayDateKey);
    return false;
  }

  if (lastResetDate === todayDateKey) {
    return false;
  }

  await clearTasksForAllUsers();
  await setJsonItem(STORAGE_KEYS.lastResetDate, todayDateKey);

  return true;
}
