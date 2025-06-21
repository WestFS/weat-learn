import { User } from './user';
import { Session } from '@supabase/supabase-js';

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthContextState = {
  user: User | null | undefined;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signOut: () => void;
  signUp: (data: LoginRequest) => Promise<User | null>
};
