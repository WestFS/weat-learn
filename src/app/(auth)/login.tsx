import { SafeAreaView, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useState } from 'react';


export default function LoginScreen() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  return(
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>
      <View style={styles.container}>
        <Text style={styles.title}>
            Sign in to <Text style={{ color: '#075eec' }}>MyApp</Text>
          </Text>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Username</Text>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              clearButtonMode='while-editing'
              keyboardType="email-address"
              placeholder='someone@example.com'
              placeholderTextColor='gray'
              style={styles.inputControl}
              value={form.email}
              onChangeText={email => setForm({ ...form, email})}/>
            </View>
            <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              clearButtonMode='while-editing'
              keyboardType="email-address"
              placeholder='someone@example.com'
              placeholderTextColor='gray'
              style={styles.inputControl}
              value={form.email}
              onChangeText={email => setForm({ ...form, email})}/>
        </View>
      </View>
    </View>
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#929292'
  },

  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
