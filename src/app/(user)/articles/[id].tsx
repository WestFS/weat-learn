import React from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View as ThemedView,
  Text as ThemedText,
  GradientBackground,
} from "@/src/components/Themed";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import HTML, { RenderHTMLProps } from "react-native-render-html";
import { Publication } from "@/src/types/article";
import * as ArticleService from "@/src/services/articleService"; // Import the article service

import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

const htmlTagsStyles: RenderHTMLProps["tagsStyles"] = {
  p: { fontSize: 16, lineHeight: 24, marginBottom: 10 },
  h1: { fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  h2: { fontSize: 20, fontWeight: "bold", marginTop: 15, marginBottom: 8 },
  h3: { fontSize: 18, fontWeight: "bold", marginTop: 12, marginBottom: 6 },
  ul: { marginBottom: 10 },
  li: { fontSize: 16, lineHeight: 22, marginBottom: 5 },
  img: {
    maxWidth: "100%",
    height: "auto",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  a: { color: "purple", textDecorationLine: "underline" },
};

export default function ArticleDetailScreen() {
  const theme = useColorScheme() ?? "light";
  const textColor = Colors[theme].text;

  const { width } = useWindowDimensions();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const {
    data: publication,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userArticle", id as string],
    queryFn: () => ArticleService.getPublicationById(id as string), // Use the article service
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedView style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color={Colors[theme].text} />
            <ThemedText style={[styles.loadingText, { color: textColor }]}>
              Loading article...
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedView style={styles.feedbackContainer}>
            <ThemedText style={[styles.errorText, { color: "red" }]}>
              Error loading article: {error?.message || "Unknown error"}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!publication) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedText style={[styles.noArticleText, { color: textColor }]}>
            Article not found.
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"< Back to list"}</Text>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientBackground />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ThemedView style={styles.container}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"< Back to list"}</Text>
          </TouchableOpacity>

          {publication.imageUrl && (
            <Image
              source={{ uri: publication.imageUrl }}
              style={styles.mainImage}
            />
          )}

          <ThemedText style={[styles.title, { color: textColor }]}>
            {publication.title}
          </ThemedText>
          <ThemedText style={[styles.author, { color: textColor }]}>
            By {publication.author}
          </ThemedText>
          <ThemedText style={[styles.summary, { color: textColor }]}>
            {publication.summary}
          </ThemedText>

          <ThemedView style={styles.contentSeparator} />

          {publication.content && ( // Only render HTML if content exists
            <HTML
              source={{ html: publication.content }}
              contentWidth={width - 40}
              tagsStyles={htmlTagsStyles}
            />
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent"
  },
  backButton: {
    marginBottom: 20,
    alignSelf: "flex-start"
  },
  backButtonText: {
    fontSize: 16,
    color: "purple",
    fontWeight: "bold",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: "cover",
    backgroundColor: "#E0E0E0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8
  },
  author: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20
  },
  contentSeparator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16
  },
  noArticleText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16
  },
});
