import { StyleSheet } from 'react-native';

import { Text, View } from "@/src/components/Themed"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import ArticleCard from '@/src/components/ArticleCard';



export default function ArticleScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ArticleCard/>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a altura da tela
    backgroundColor: '#fff', // opcional, para garantir o fundo
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
