import { Pressable, StyleSheet } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text, View } from '@/src/components/Themed';

export default function HomeScreen() {
  const router = useRouter();


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Pressable
          onPress={() => {
            router.push('/(stacks)/feed');
          }}
          style={({ pressed }) => [
            styles.squareButton,
            {
              backgroundColor: pressed ? 'rgb(3, 174, 231)' : 'rgba(45, 98, 162, 0.44)',
            },
          ]}
        >
          <Text style={styles.buttonText}>Feed</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  squareButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
