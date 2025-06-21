// External libraries (React, React Native, Expo)
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Internal application components and hooks
import { Text, View } from '@/src/components/Themed';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useAuth } from '@/src/contexts/AuthContext';
import Colors from '@/src/constants/Colors';
import MeshGradientBackground from '@/src/components/MeshGradientBackground';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, signUp, isLoading, isLoggedIn } = useAuth();
  const router = useRouter();

  const theme = useColorScheme() ?? 'light';

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/(user)/home');
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    try {
      await signIn({ email, password });
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Your credentials are not correct. Please try again.');
    }
  };

  const handleSignUpSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    try {
      const registeredUser = await signUp({ email, password });
      if (registeredUser === null) {
        Alert.alert('Registration Successful!', 'Please check your email to confirm your account.');
      } else {
        Alert.alert('Registration Successful!', 'Welcome! You are now logged in.');
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not register. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[theme].background }}>
      <MeshGradientBackground 
        colors={Colors[theme].meshGradient}
        tint={theme === 'dark' ? 'dark' : 'light'}
        intensity={80}
      />
      <View style={styles.outerContainer}>
        <View style={[styles.card, { backgroundColor: Colors[theme].background }]}>
          <Text style={[styles.title, { color: Colors[theme].tint }]}>
            Welcome to <Text style={{ color: Colors[theme].text }}>Weat Learn</Text>
          </Text>
          <Text style={[styles.subtitle, { color: Colors[theme].text }]}>
            Sign in to continue
          </Text>

          <View style={styles.form}>
            <Text style={[styles.inputLabel, { color: Colors[theme].text }]}>Email</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType="email-address"
              placeholder='someone@example.com'
              placeholderTextColor={Colors[theme].inputBackground}
              style={[styles.inputControl, { color: Colors[theme].text, backgroundColor: Colors[theme].inputBackground }]}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />

            <Text style={[styles.inputLabel, { color: Colors[theme].text }]}>Password</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='********'
              placeholderTextColor={Colors[theme].inputBackground}
              secureTextEntry
              style={[styles.inputControl, { color: Colors[theme].text, backgroundColor: Colors[theme].inputBackground }]}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors[theme].tint, opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleLoginSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleSignUpSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: Colors[theme].tint }]}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  card: {
    width: '95%',
    maxWidth: 400,
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#888',
  },
  form: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  inputControl: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#6a00ec',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6a00ec',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
