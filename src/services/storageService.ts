import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getJsonItem<T>(key: string, fallbackValue: T): Promise<T> {
  const storedValue = await AsyncStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    throw new Error(`Stored data is corrupted for key: ${key}`);
  }
}

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeStorageItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
