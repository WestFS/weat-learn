import { User } from './user';

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
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signOut: () => void;
};
