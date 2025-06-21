import React from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View as ThemedView,
  Text as ThemedText,
  GradientBackground,
} from "@/src/components/Themed";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import HTML, { RenderHTMLProps, MixedStyleDeclaration } from "react-native-render-html";
import * as ArticleService from "@/src/services/articleService";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const htmlTagsStyles: NonNullable<RenderHTMLProps["tagsStyles"]> = {
  p: { fontSize: 16, lineHeight: 24, marginBottom: 10, color: 'inherit' },
  h1: { fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: 'inherit' },
  h2: { fontSize: 20, fontWeight: "bold", marginTop: 15, marginBottom: 8, color: 'inherit' },
  h3: { fontSize: 18, fontWeight: "bold", marginTop: 12, marginBottom: 6, color: 'inherit' },
  h4: { fontSize: 16, fontWeight: "bold", marginTop: 10, marginBottom: 4, color: 'inherit' },
  ul: { marginBottom: 10, paddingLeft: 20 },
  ol: { marginBottom: 10, paddingLeft: 20 },
  li: { fontSize: 16, lineHeight: 22, marginBottom: 5, color: 'inherit' },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#ddd',
    paddingLeft: 15,
    marginVertical: 10,
    fontStyle: 'italic',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 4,
  },
  img: {
    maxWidth: "100%",
    height: "auto",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  a: { color: "purple", textDecorationLine: "underline" },
  code: {
    backgroundColor: '#f4f4f4',
    padding: 2,
    borderRadius: 3,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  pre: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
};

export default function ArticleDetailScreen() {
  const theme = useColorScheme() ?? "light";
  const textColor = Colors[theme].text;
  const backgroundColor = Colors[theme].background;

  const { width } = useWindowDimensions();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  console.log('📱 ArticleDetailScreen - Article ID:', id);

  const {
    data: publication,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Publication | null, Error>(
    {
      queryKey: ["userArticle", id as string],
      queryFn: async () => {
        console.log('🔄 Fetching article with ID:', id);
        const result = await ArticleService.getArticleByID(id as string);
        if (Array.isArray(result) && result.length > 0) {
          return result[0] as Publication;
        }
        return result as Publication | null;
      },
      enabled: !!id,
      retry: 2,
      staleTime: 5 * 60 * 1000,
      onSuccess: (data: Publication | null) => { // Explicitly type data here
        if (data) {
          console.log('Article loaded successfully:', data.title);
        } else {
          console.log('Article not found for ID:', id);
        }
      },
      onError: (error: Error) => { // Explicitly type error here
        console.error('Error loading article:', error.message);
      },
    } as UseQueryOptions<Publication | null, Error>
  );

  const handleRetry = () => {
    console.log('🔄 Retrying article fetch...');
    refetch();
  };

  const handleImageError = (error: any) => {
    console.log("Error loading image:", error);
  };

  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedView style={styles.feedbackContainer}>
            <ActivityIndicator size="large" color={textColor} />
            <ThemedText style={[styles.loadingText, { color: textColor }]}>
              Carregando artigo...
            </ThemedText>
            <ThemedText style={[styles.loadingSubText, { color: textColor }]}>
              ID: {id}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedView style={styles.feedbackContainer}>
            <ThemedText style={[styles.errorTitle, { color: textColor }]}>
              Erro ao carregar artigo
            </ThemedText>
            <ThemedText style={styles.errorText}>
              {error?.message || "Erro desconhecido"}
            </ThemedText>

            <TouchableOpacity
              onPress={handleRetry}
              style={[styles.retryButton, { backgroundColor: Colors[theme].tint }]}
            >
              <Text style={styles.retryButtonText}>🔄 Tentar novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={[styles.backButtonText, { color: Colors[theme].tint }]}>
                ← Voltar
              </Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!publication) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <GradientBackground />
        <ThemedView style={styles.container}>
          <ThemedView style={styles.feedbackContainer}>
            <ThemedText style={[styles.noArticleText, { color: textColor }]}>
              Artigo não encontrado
            </ThemedText>
            <ThemedText style={[styles.noArticleSubText, { color: textColor }]}>
              O artigo solicitado não existe ou foi removido.
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={[styles.backButtonText, { color: Colors[theme].tint }]}>
                ← Voltar para lista
              </Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  console.log('📖 Rendering article:', publication.title);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <GradientBackground />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          {/* Header com botão de voltar */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={[styles.backButtonText, { color: Colors[theme].tint }]}>
              ← Voltar
            </Text>
          </TouchableOpacity>

          {/* Imagem principal */}
          {publication.imageUrl && (
            <Image
              source={{ uri: publication.imageUrl }}
              style={styles.mainImage}
              onError={handleImageError}
              onLoad={handleImageLoad}
              resizeMode="cover"
            />
          )}

          {/* Título do artigo */}
          <ThemedText style={[styles.title, { color: textColor }]}>
            {publication.title}
          </ThemedText>

          {/* Informações do autor e data */}
          <ThemedView style={styles.metaContainer}>
            {publication.author && (
              <ThemedText style={[styles.author, { color: textColor }]}>
                👤 {publication.author}
              </ThemedText>
            )}

            {publication.publishedAt && (
              <ThemedText style={[styles.date, { color: textColor }]}>
                {new Date(publication.publishedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </ThemedText>
            )}
          </ThemedView>

          {/* Resumo do artigo */}
          {publication.summary && (
            <ThemedView style={styles.summaryContainer}>
              <ThemedText style={[styles.summaryLabel, { color: textColor }]}>
                📝 Resumo
              </ThemedText>
              <ThemedText style={[styles.summary, { color: textColor }]}>
                {publication.summary}
              </ThemedText>
            </ThemedView>
          )}

          {/* Separador */}
          <ThemedView style={[styles.contentSeparator, { backgroundColor: Colors[theme].tabIconDefault }]} />

          {/* Conteúdo do artigo */}
          {publication.content ? (
            <ThemedView style={styles.contentContainer}>
              <HTML
                source={{ html: publication.content }}
                contentWidth={width - 40}
                tagsStyles={{
                  ...htmlTagsStyles,
                  p: { ...htmlTagsStyles.p, color: textColor },
                  h1: { ...htmlTagsStyles.h1, color: textColor },
                  h2: { ...htmlTagsStyles.h2, color: textColor },
                  h3: { ...htmlTagsStyles.h3, color: textColor },
                  h4: { ...htmlTagsStyles.h4, color: textColor },
                  li: { ...htmlTagsStyles.li, color: textColor },
                }}
                defaultTextProps={{
                  style: { color: textColor }
                }}
              />
            </ThemedView>
          ) : (
            <ThemedView style={styles.noContentContainer}>
              <ThemedText style={[styles.noContentText, { color: textColor }]}>
                📄 Conteúdo não disponível
              </ThemedText>
            </ThemedView>
          )}

          {/* Rodapé com espaçamento */}
          <ThemedView style={styles.footer} />
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
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#E0E0E0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 36,
  },
  metaContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  author: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    opacity: 0.8,
  },
  summaryContainer: {
    backgroundColor: "transparent",
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    opacity: 0.9,
  },
  contentSeparator: {
    height: 1,
    marginVertical: 24,
    opacity: 0.3,
  },
  contentContainer: {
    backgroundColor: "transparent",
  },
  noContentContainer: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "transparent",
  },
  noContentText: {
    fontSize: 16,
    fontStyle: "italic",
    opacity: 0.7,
  },
  footer: {
    height: 40,
    backgroundColor: "transparent",
  },

  // Estados de feedback
  feedbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 18,
    fontWeight: "500",
  },
  loadingSubText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 22,
    color: "#ef4444",
    paddingHorizontal: 20,
  },
  noArticleText: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "600",
  },
  noArticleSubText: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});


export interface Article {
  id: string;
  title: string;
  author_id: string;
  author: string;
  article_tag: 'movie' | 'notice' | 'journal' | 'tips' | 'cybersecurity' | 'article';
  summary: string;
  main_image_url?: string | null;
  content: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  is_published: boolean;
}


export interface ArticleWithAuthor extends Article {
  author_name: string;
  publishedAt: string;
}


export interface Publication {
  id: string;
  title: string;
  content: string;
  author: string;
  summary: string;
  imageUrl?: string;
  publishedAt: string;
  category?: string;
}
