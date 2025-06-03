import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="forgotPassword" options={{ title: "Forgot Password" }} />
      <Stack.Screen name="resetPassword" options={{ title: "Reset Password" }} />
    </Stack>
  );
}
