// External libraries (React, React Native, Expo)
import { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

// Internal application components and hooks
import { Text, View } from '@/src/components/Themed';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useAuth } from '@/src/contexts/AuthContext';
import Colors from '@/src/constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, signUp, isLoading } = useAuth();

  const theme = useColorScheme() ?? 'light';

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
      <View style={styles.container}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>
          Sign in to <Text style={{ color: '#6a00ec' }}>Weat Learn</Text>
        </Text>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={[styles.inputLabel, { color: Colors[theme].text }]}>Email</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              clearButtonMode='while-editing'
              keyboardType="email-address"
              placeholder='someone@example.com'
              placeholderTextColor='gray'
              style={[styles.inputControl, {
                color: Colors[theme].text,
                backgroundColor: Colors[theme].inputBackground,
              }]}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.input}>
            <Text style={[styles.inputLabel, { color: Colors[theme].text }]}>Password</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              clearButtonMode='while-editing'
              keyboardType="default"
              placeholder='********'
              placeholderTextColor='gray'
              secureTextEntry={true}
              style={[styles.inputControl, {
                color: Colors[theme].text,
                backgroundColor: Colors[theme].inputBackground,
              }]}
              value={password}
              onChangeText={setPassword}
            />
            <View style={[styles.loginButton]}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors[theme].tint} />
              ) : (
                <>
                  <Button
                    title="Login"
                    color={Colors[theme].tint}
                    onPress={handleLoginSubmit}
                    disabled={isLoading}
                  />
                  <View style={{ height: 10 }} />
                  <Button
                    title="Register"
                    color={Colors[theme].tint}
                    onPress={handleSignUpSubmit}
                    disabled={isLoading}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#929292',
    textAlign: 'center',
    marginBottom: 24,
  },

  /** Form */
  form: {
    width: '100%',
  },

  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  loginButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fff'
  },
});
