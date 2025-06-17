// External libraries
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

// Internal imports using path aliases
import { useColorScheme } from '@/src/components/useColorScheme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create the QueryClient instance outside of the component to prevent re-creation on re-renders.
const queryClient = new QueryClient();

// This is the component that will have access to the auth context.
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { isLoading, isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    SplashScreen.hideAsync();

    if (isLoggedIn) {
      console.log('User is logged in. User ID:', user?.id, 'Role:', user?.role)
      if (user?.role === 'admin') {
        router.replace('/(admin)/home');
      } else if (user?.role === 'user') {
        router.replace('/(user)/home');
      } else {
        console.error('Error attempting to login', user?.role);
        router.replace('/(auth)/login')
      }
    } else {
      // If the user is not logged in, ensure they are in the auth flow.
      console.log('User is NOT logged in. Redirecting to login.');
      router.replace('/(auth)/login');
    }
  }, [isLoading, isLoggedIn, user?.role, user?.id, router]);  // This effect re-runs whenever the loading or logged-in state changes.

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* This Stack navigator is the parent for all our route groups.
          We use it to define global navigation options, like for a modal screen.
        */}
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(user)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    // STEP 1: The QueryClientProvider must wrap everything that uses TanStack Query.
    <QueryClientProvider client={queryClient}>
      {/* STEP 2: The AuthProvider wraps our navigation, making the auth state
          available to all screens. It must be inside QueryClientProvider
          because it uses TanStack Query internally. */}
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
