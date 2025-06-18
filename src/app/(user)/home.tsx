import { StyleSheet, FlatList, Pressable } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";

import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import {
  Text as ThemedText,
  View as ThemedView,
} from "@/src/components/Themed";
import CardGrid from "@/src/components/CardGrid";

const BUTTONS = [
  { label: "Articles", path: "/articles" },
  { label: "Tasks", path: "/tasks" },
] as const;

export default function HomeScreen() {
  const theme = useColorScheme() as "light" | "dark";
  const { user } = useAuth();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[theme].background }]}
    >
      <ThemedText style={styles.title}>Bem-vindo, {user?.name}!</ThemedText>
      <ThemedView
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <CardGrid buttons={BUTTONS} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  separator: {
    height: 1,
    width: "80%",
    marginBottom: 16,
  },
});
