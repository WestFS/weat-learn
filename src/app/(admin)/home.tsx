import React from "react";
import { useColorScheme } from "@/src/components/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
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
