import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Redirect href="/(auth)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
