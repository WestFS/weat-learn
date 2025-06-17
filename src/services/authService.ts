import { supabase } from "@/src/utils/supabase";
import { User } from "../types/user";
import { LoginRequest } from "../types";
import { Session } from '@supabase/supabase-js';

const mapSupabaseUserToAppUser = (supabaseUser: any): User => {

  const role: 'user' | 'admin' = supabaseUser.app_metadata?.role || 'user';

  const name = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User';

  return {
    id: supabaseUser.id,
    name: name,
    email: supabaseUser.email || '',
    role: role,
  };
};


/**
 * Simulates the sign-in process.
 * It checks credentials, saves a fake token if they are correct, and returns the user object.
 * @param data - The user's login credentials (email and password).
 * @returns A Promise that resolves with the User object on success.
 * @throws {Error} if the login fails.
 */
export const signIn = async (data: LoginRequest): Promise<User> => {
  console.log('[AuthService] Attempting to sign in for:', data.email);

  try {
      const {data: authData, error} = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password!,
    });

    if (error) {
      console.error('[AuthService] Supabase signIn error: ', error.message);
      throw new Error(error.message);
    };

    if(!authData.user) {
      console.warn('[AuthService] Sign-in successful but no user object returned. Email confirmation pending?');
      throw new Error('Please check your credentials or confirm your email.');
    }

    console.log('[AuthService] User successfully signed in:', authData.user.id);
    return mapSupabaseUserToAppUser(authData.user);

  } catch (error: any) {
    console.error('[AuthService] Failed to sign in:', error.message);
    throw error;
  }
};

/**
 *
 * @param data The user's registration credentials (email and password).
 * @returns A promise that resolves with the User object (if automatically logged in) or null (if email confirmation is pending).
 * @throws {Error} if the registration fails
 */

export const signUp = async (data: LoginRequest): Promise<User | null> => {
  console.log('[AuthService] Attempting to sign up:', data.email);

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password!,
      options: {
        data: {
          role: 'user', // default role to 'user'
          full_name: data.email.split('@')[0], // initial name
        }
      }
    });

    if (error) {
      console.error('[AuthService] Supabase signUp error:', error.message);
      throw new Error(error.message);
    }

    if (authData.user) {

      console.log('[AuthService] User signed up:', authData.user.id);
      return mapSupabaseUserToAppUser(authData.user);

    } else {
      console.log('[AuthService] Sign up initiated. Please check your email for confirmation.');
      return null;
    }
  } catch (error: any) {
    console.error('[AuthService] Failed to sign up', error.message);
    throw error
  }
};


/**
 * Handles the user sign-out process using Supabase Auth.
 * @returns A Promise that resolves when the sign-out is complete.
 * @throws {Error} if the sign-out fails.
 */
export const signOut = async (): Promise<void> => {
  console.log('[AuthService] Signing out...');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthService] Supabase signOut error:', error.message);
      throw new Error(error.message);
    }
    console.log('[AuthService] Successfully signed out.');
  } catch (error: any) {
    console.error('[AuthService] Failed to sign out:', error.message);
    throw error;
  }
};


/**
 * Fetches the currently authenticated user's.
 * @returns A Promise that resolves with the User object if authenticated.
 * @throws {Error} if no authenticated user is found, to signal to TanStack Query.
 */
export const getProfile = async (): Promise<User> => {
  console.log('[AuthService] Checking for active Supabase session...');
  try {
    // supabase.auth.getUser() returns the currently logged-in user (if any).
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('[AuthService] Supabase getUser error:', error.message);
      throw new Error('Error fetching user: ' + error.message);
    }

    if (!user) {
      console.log('[AuthService] No authenticated user found.');
      throw new Error('Unauthenticated user.');
    }

    console.log('[AuthService] Session found for user:', user.id);
    return mapSupabaseUserToAppUser(user);

  } catch (error: any) {
    console.error('[AuthService] Failed to get profile:', error.message);
    throw error;
  }
};




/**
 * Subscribes to authentication state change events from Supabase.
 * Useful for reacting to logins/logouts in real-time
 * @param callback - Function to be called with (event, session).
 * @returns An object with an `unsubscribe` method to stop listening.
 */
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  console.log('[AuthService] Subscribing to auth state changes.');
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
    callback(event, session);
  });
  return { unsubscribe: () => subscription.unsubscribe() };
};
