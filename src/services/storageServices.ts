import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';


/**
 * Saves an item. It uses SecureStore on mobile devices and localStorage on the web.
 * @param key - The key of the item.
 * @param value - The value to be saved.
 */

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key,value);
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  } else {
    await SecureStore.setItemAsync(key,value);
  }
}

/**
 * Pick up an item. It uses SecureStore on mobile and localStorage on the web.
 * @param key - The key to the item.
 * @returns  - The value of the item or null if it is not found.
 */

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Failed to get from localStorage', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

/**
 * Deletes an item. It uses SecureStore on mobile and localStorage on the web
 * @param key - The key of the item to be deleted
 */

export async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to  remove item from LocalStorage', e);
    }
  } else {
    await SecureStore.deleteItemAsync(key)
  }
}
