import { Pressable, StyleSheet, FlatList } from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';


const BUTTONS = [
  { label: 'Feed', path: '/(stacks)/feed' },
  { label: 'Task', path: '/(stacks)/tasks' },
] as const;

type ButtonItem = (typeof BUTTONS)[number];

export default function HomeScreen() {
  const router = useRouter();

  const theme = useColorScheme() as 'light' | 'dark';

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[theme].background }
        ]}
      >
        <Text style={styles.title}>Home</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <FlatList
          data={BUTTONS}
          numColumns={2}
          keyExtractor={(item) => item.path}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          renderItem={({ item }: { item: ButtonItem}) => (
            <Pressable
              onPress={() => router.push(item.path)}
              style={({ pressed }) => [
                styles.squareButton,
                {
                  backgroundColor: pressed ? 'rgb(93, 38, 155)': 'rgba(93, 8, 190, 0.44)',
                },
              ]}
            >
              <Text style={styles.buttonText}>{item.label}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  separator: {
    height: 1,
    width: '80%',
    marginBottom: 16,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  squareButton: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
