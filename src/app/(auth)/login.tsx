import { SafeAreaView, StyleSheet, TextInput, Button, Alert } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import { useColorScheme } from '@/src/components/useColorScheme';
import Colors from '@/src/constants/Colors';
import { useLoginForm } from '@/src/hooks/useLoginForm';

export default function LoginScreen() {
  const { form, handleChange, handleSubmit } = useLoginForm();

  // src/constants/Colors.ts
  const theme = useColorScheme() as 'light' | 'dark';



  return(
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={[styles.title, {color: Colors[theme].text}]}>
            Sign in to <Text style={{ color: '#6a00ec' }}>Weat Learn</Text>
          </Text>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={[styles.inputLabel, {color: Colors[theme].text}]}>Username</Text>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              clearButtonMode='while-editing'
              keyboardType="email-address"
              placeholder='someone@example.com'
              placeholderTextColor='gray'
              style={[styles.inputControl, {
                color: "#1A1A1A",
                backgroundColor:Colors[theme].inputBackground,
              }]}
              value={form.email}
              onChangeText={text => handleChange('email', text)}/>
            </View>
            <View style={styles.input}>
            <Text style={[styles.inputLabel, {color: Colors[theme].text}]}>Password</Text>

            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              clearButtonMode='while-editing'
              keyboardType="default"
              placeholder='********'
              placeholderTextColor='gray'
              secureTextEntry={true}
              style={[styles.inputControl, {
                color: "#1A1A1A",
                backgroundColor:Colors[theme].inputBackground,
              }]}
              value={form.password}
              onChangeText={text => handleChange('password', text)}/>
        <View style={[styles.loginButton]}>
          <Button
            title="Login"
            color={Colors[theme].tint}
            onPress={handleSubmit}
          />
        </View>

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

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
