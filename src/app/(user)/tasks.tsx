import { StyleSheet } from "react-native";

import { Text, View, GradientBackground } from "@/src/components/Themed";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TaskScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <GradientBackground />
        <View>
          <Text>TASK</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
