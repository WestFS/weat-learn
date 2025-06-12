import { useState } from "react";

import {
  StyleSheet,
  TextInput,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View as ThemedView,
  Text as ThemedText,
  GradientBackground,
} from "@/src/components/Themed";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import HTML from "react-native-render-html";

export default function ManageArticleScreen() {
  const theme = useColorScheme() ?? "light";

  const [articleContent, setArticleContent] = useState("");
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientBackground />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ThemedView style={styles.container}>
          <ThemedText
            style={[styles.headerTitle, { color: Colors[theme].text }]}
          >
            Create your
            <ThemedText style={{ color: "purple" }}> Publication!</ThemedText>
          </ThemedText>

          <ThemedText style={styles.label}>Title:</ThemedText>
          <TextInput style={styles.titleInput} />

          <ThemedText style={styles.label}>Summary:</ThemedText>
          <TextInput style={styles.summaryInput} />

          <ThemedText style={styles.label}>Article:</ThemedText>
          <TextInput
            style={styles.articleInput}
            multiline
            onChangeText={setArticleContent}
            value={articleContent}
          />

          <ThemedText style={styles.label}>Attachments:</ThemedText>
          {/* CRIAR UPLOAD DE ANEXOS */}

          <ThemedText style={styles.label}>Preview:</ThemedText>
          {/* CRIAR UM PREVIEW DO HTML CONSTRUIDO */}
          <ThemedText> {articleContent}</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  container: {
    padding: 20,
    backgroundColor: "transparent",
  },

  // <---- FORM LABEL ---->

  headerTitle: {
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: "#555",
  },

  // <---- FORM INPUT ---->

  titleInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },

  summaryInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },

  articleInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    minHeight: 500,
    textAlignVertical: "top",
  },
});
