import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AdminLayout() {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn || user?.role !== "admin") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen
        name="article-editor"
        options={{ title: "Editor Article" }}
      />
      <Stack.Screen
        name="manage-articles"
        options={{ title: "Management Article" }}
      />
      <Stack.Screen name="users" options={{ title: "Management Users" }} />
    </Stack>
  );
}
