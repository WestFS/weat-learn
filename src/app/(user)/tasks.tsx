import { StyleSheet } from 'react-native';

import { Text, View } from "@/src/components/Themed"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import MeshGradientBackground from "@/src/components/MeshGradientBackground";


export default function TaskScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <MeshGradientBackground />
        <View>
          <Text>
            TASK
          </Text>
        </View>
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

});
