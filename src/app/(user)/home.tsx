import { StyleSheet, FlatList, Pressable } from 'react-native';

import { Link } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as ThemedText, View as ThemedView } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';


const BUTTONS = [
  { label: 'Articles', path: '/articles' },
  { label: 'Tasks', path: '/tasks' },
] as const;

type ButtonItem = (typeof BUTTONS)[number];

export default function HomeScreen() {
  const theme = useColorScheme() as 'light' | 'dark';
  const { user } = useAuth();

  return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[theme].background }
        ]}
      >
        <ThemedText style={styles.title}>Bem-vindo, {user?.name}!</ThemedText>
        <ThemedView style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <FlatList
          data={BUTTONS}
          numColumns={2}
          keyExtractor={(item) => item.path}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
          renderItem={({ item }: { item: ButtonItem }) => (
          <Link href={item.path} asChild>
            <Pressable>
              {({ pressed }) => (
                // Usando Themed.View para o fundo do botão
                <ThemedView
                  // Define cores diferentes para o fundo no modo claro e escuro
                  lightColor={pressed ? '#e0e0e0' : '#f2f2f2'}
                  darkColor={pressed ? '#444444' : '#333333'}
                  style={[
                    styles.squareButton,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  {/* Usando Themed.Text para garantir que o texto também se adapte */}
                  <ThemedText style={styles.buttonText}>{item.label}</ThemedText>
                </ThemedView>
              )}
            </Pressable>
          </Link>
        )}
      />
    </SafeAreaView>
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
