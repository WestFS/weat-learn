import * as SecureStore from 'expo-secure-store';
import { User } from '@/src/types/user';
import { LoginRequest } from '@/src/types/auth';
import* as storage from '@/src/services/storageServices'


// we use this for save TOKEN in the storage
const AUTH_TOKEN_KEY = 'authToken';
const ADMIN_TOKEN_KEY = 'adminAuthToken';

const fakeDbUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@email.com',
  role: 'user',
};

const fakeAdminUser: User = {
  id: '99',
  name: 'Admin User',
  email: 'admin@email.com',
  role: 'admin',
};


/**
 * Simulates the sign-in process.
 * It checks credentials, saves a fake token if they are correct, and returns the user object.
 * @param data - The user's login credentials (email and password).
 * @returns A Promise that resolves with the User object on success.
 */

export const signIn = async (data:LoginRequest): Promise<User> => {
  console.log('[AuthService] Trying to login to:', data.email);
  // Simulate network latency.
  await new Promise(r => setTimeout(r, 700));

  if (data.email === 'admin@email.com' && data.password === 'admin') {
    const fakeToken =  'token-fake-admin-123';
    await storage.setItem(ADMIN_TOKEN_KEY,fakeToken);
    console.log('[AuthService] Login successfully. Saved token');
    return fakeAdminUser;
  }

  if (data.email === 'test@email.com' && data.password === '123') {
    const fakeToken =  'token-fake-user-123';
    await storage.setItem(AUTH_TOKEN_KEY,fakeToken);
    console.log('[AuthService] Login successfully. Saved token');
    return fakeDbUser;
  }

  console.log('[AuthService] Login failed: Invalid credentials.');
  throw new Error('Invalid credentials');
};

/**
 * Simulates the sign-out process by deleting the token from storage.
 */

export const signOut = async (): Promise<void> => {
  console.log('[AuthService] Signing out...');
  await storage.deleteItem(AUTH_TOKEN_KEY);
  await storage.deleteItem(ADMIN_TOKEN_KEY);
  console.log('[AuthService] Removed Token');
};


/**
 * Simulates fetching the current user's profile.
 * This is used by TanStack Query on app start to check for an existing session.
 * It reads the token from SecureStore and returns the user if the token exists.
 * @returns A Promise that resolves with the User object if authenticated.
 */

export const getProfile = async (): Promise<User> => {
  console.log('[AuthService] Checking if there are any saved sessions...');
  const adminToken = await storage.getItem(ADMIN_TOKEN_KEY);
  const token = await storage.getItem(AUTH_TOKEN_KEY);

  await new Promise(r => setTimeout(r, 700));

  if (token) {
    console.log('[AuthService] Session found. Returning user data.');
    return fakeDbUser;
  }

  if (adminToken) {
    console.log('[AuthService] Admin session found. Returning admin data.');
    return fakeAdminUser;
  }

  console.log('[AuthService] No sessions found')
  throw new Error('Unauthenticated user.')
}
