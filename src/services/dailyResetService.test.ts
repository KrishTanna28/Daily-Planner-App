import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getTasksStorageKey, STORAGE_KEYS } from '../constants/storageKeys';
import { applyDailyResetIfNeeded } from './dailyResetService';

const mockedGetStoredUsers = vi.fn();
const mockedGetJsonItem = vi.fn();
const mockedSetJsonItem = vi.fn();

vi.mock('./authService', () => ({
  getStoredUsers: (...args: unknown[]) => mockedGetStoredUsers(...args),
}));

vi.mock('./storageService', () => ({
  getJsonItem: (...args: unknown[]) => mockedGetJsonItem(...args),
  setJsonItem: (...args: unknown[]) => mockedSetJsonItem(...args),
}));

describe('applyDailyResetIfNeeded', () => {
  const todayDateKey = '2026-04-21';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-21T09:15:00.000Z'));

    mockedGetStoredUsers.mockReset();
    mockedGetJsonItem.mockReset();
    mockedSetJsonItem.mockReset();

    mockedSetJsonItem.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes last reset date when missing', async () => {
    mockedGetJsonItem.mockResolvedValue(null);

    const didReset = await applyDailyResetIfNeeded();

    expect(didReset).toBe(false);
    expect(mockedSetJsonItem).toHaveBeenCalledTimes(1);
    expect(mockedSetJsonItem).toHaveBeenCalledWith(STORAGE_KEYS.lastResetDate, todayDateKey);
    expect(mockedGetStoredUsers).not.toHaveBeenCalled();
  });

  it('does nothing when already reset today', async () => {
    mockedGetJsonItem.mockResolvedValue(todayDateKey);

    const didReset = await applyDailyResetIfNeeded();

    expect(didReset).toBe(false);
    expect(mockedGetStoredUsers).not.toHaveBeenCalled();
    expect(mockedSetJsonItem).not.toHaveBeenCalled();
  });

  it('clears tasks for all unique users when day changes', async () => {
    mockedGetJsonItem.mockResolvedValue('2026-04-20');
    mockedGetStoredUsers.mockResolvedValue([
      { fullName: 'A', email: 'alpha@example.com', password: '123456' },
      { fullName: 'B', email: 'BETA@example.com', password: '123456' },
      { fullName: 'A2', email: 'ALPHA@example.com', password: '123456' },
    ]);

    const didReset = await applyDailyResetIfNeeded();

    expect(didReset).toBe(true);
    expect(mockedSetJsonItem).toHaveBeenCalledTimes(3);
    expect(mockedSetJsonItem).toHaveBeenCalledWith(getTasksStorageKey('alpha@example.com'), []);
    expect(mockedSetJsonItem).toHaveBeenCalledWith(getTasksStorageKey('beta@example.com'), []);
    expect(mockedSetJsonItem).toHaveBeenCalledWith(STORAGE_KEYS.lastResetDate, todayDateKey);
  });

  it('still updates last reset date even when there are no users', async () => {
    mockedGetJsonItem.mockResolvedValue('2026-04-20');
    mockedGetStoredUsers.mockResolvedValue([]);

    const didReset = await applyDailyResetIfNeeded();

    expect(didReset).toBe(true);
    expect(mockedSetJsonItem).toHaveBeenCalledTimes(1);
    expect(mockedSetJsonItem).toHaveBeenCalledWith(STORAGE_KEYS.lastResetDate, todayDateKey);
  });
});
