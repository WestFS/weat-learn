import React from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text as ThemedText,
  View as ThemedView,
} from "@/src/components/Themed";
import CardGrid from "@/src/components/CardGrid";

const BUTTONS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Article Editor", path: "/article-editor" },
  { label: "Manage Articles", path: "/manage-articles" },
  { label: "Manage User", path: "/users" },
] as const;

export default function HomeScreen() {
  const theme = useColorScheme() as "light" | "dark";

  return (
    <SafeAreaView>
      <CardGrid buttons={BUTTONS} />
    </SafeAreaView>
  );
}
