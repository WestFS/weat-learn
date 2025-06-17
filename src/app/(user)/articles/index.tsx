import React from "react";
import { StyleSheet, FlatList, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View as ThemedView,
  Text as ThemedText,
  GradientBackground,
} from "@/src/components/Themed";
import ArticleCard from "@/src/components/ArticleCard";
import { Publication } from "@/src/types/article";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import * as ArticleService from "@/src/services/articleService";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";


export default function ArticleListScreen() {
  const theme = useColorScheme() ?? "light";
  const textColor = Colors[theme].text;
  const router = useRouter();

  const {
    data: publications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userPublications"],
    queryFn: ArticleService.getPublications,
  });

  const handleSelectArticle = (publication: Publication) => {
    router.push({
      pathname: "/(user)/articles/[id]",
      params: { id: publication.id },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>
            Available Articles
          </ThemedText>
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color={Colors[theme].tint} />
            <ThemedText style={[styles.loadingText, { color: textColor }]}>
              Loading articles...
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedText style={[styles.headerTitle, { color: textColor }]}>
            Available Articles
          </ThemedText>
          <View style={styles.feedbackContainer}>
            <ThemedText style={[styles.errorText, { color: "red" }]}>
              Error loading articles: {error?.message || "Unknown error"}
            </ThemedText>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientBackground />
      <ThemedView style={styles.container}>
        <ThemedText style={[styles.headerTitle, { color: textColor }]}>
          Available Articles
        </ThemedText>

        {publications?.length === 0 ? (
          <ThemedText style={[styles.noArticlesText, { color: textColor }]}>
            No articles available yet.
          </ThemedText>
        ) : (
          <FlatList
            data={publications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ArticleCard publication={item} onPress={handleSelectArticle} />
            )}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent"
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noArticlesText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16
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

  listContentContainer: {
    paddingBottom: 20
  },
});
