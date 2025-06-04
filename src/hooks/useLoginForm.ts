import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { LoginForm } from "../types/AuthTypes";


export function useLoginForm() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const router = useRouter();

  function handleChange(field: keyof LoginForm, value: string) {
    setForm(prev => ({...prev, [field]: value}));
  }

  function handleSubmit() {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    // TODO: Add authentication logic here
    Alert.alert('Sucesso', 'Login realizado com sucesso!');

    // Redirect to another screen after successful login
     router.replace('/(tabs)'); // Navega para a tela inicial
  }
  return { form, handleChange, handleSubmit };
}
