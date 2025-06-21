import React, { useState, useCallback, useMemo } from "react"; // Adicione useCallback e useMemo
import {
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View as ThemedView,
  Text as ThemedText,
} from "@/src/components/Themed";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors"; // Importe Colors para a tipagem
import * as ImagePicker from "expo-image-picker";
import { marked } from "marked";
import { Article } from "@/src/types/article";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import ArticleForm from "@/src/components/ArticleForm";
import ArticlePreview from "@/src/components/ArticlePreview";
import { createArticle, CreateArticleData } from "@/src/services/articleService";


export default function ManageArticleScreen() {
  const theme = (useColorScheme() ?? "light") as keyof typeof Colors;
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  // --- Article content states  ---
  const [title, setTitle] = useState("My Awesome Article");
  const [author, setAuthor] = useState(user?.email || "");
  const [date, setDate] = useState(new Date().toLocaleDateString('pt-BR'));
  const [summary, setSummary] = useState("");
  const [articleMarkdownContent, setArticleMarkdownContent] = useState(``);
  const [mainImageUrl, setMainImageUrl] = useState("https://placehold.co/800x450.png");

  // Input focus states for styling effects
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isAuthorFocused, setIsAuthorFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isImageUrlFocused, setIsImageUrlFocused] = useState(false);

  // Preview mode state
  const [previewMode, setPreviewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // Responsive layout detection
  const isLargeScreen = width > 900;

  // --- Funções Memoizadas com useCallback ---
  // Isso garante que essas funções não sejam recriadas a cada renderização,
  // otimizando a performance e permitindo que React.memo funcione nos filhos.

  const handleImagePicker = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your gallery to add images to the article."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      Alert.alert(
        "Image Upload (Simulated)",
        "The image has been selected. In production, it would be uploaded to your storage service, and the real URL would be used."
      );
      const imageUrl = uri;

      if (!mainImageUrl || mainImageUrl.includes('placehold.co')) {
        setMainImageUrl(imageUrl);
      }

      const markdownImage = `![Added Image](${imageUrl})\n\n`;
      setArticleMarkdownContent(prev => prev + markdownImage);
    }
  }, [mainImageUrl, setMainImageUrl, setArticleMarkdownContent]);


  const handlePublish = useCallback(async () => {
    console.log('handlePublish started');
    console.log('Data:', { title, hasContent: !!articleMarkdownContent, userId: user?.id, isLoggedIn });

    // Validações básicas
    if (!title || !articleMarkdownContent) {
      console.log('Validation failed: required fields');
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields (Title, Article Content) before publishing."
      );
      return;
    }

    // Verificar autenticação e permissões
    if (!user?.id || !isLoggedIn) {
      console.log('Validation failed: authentication');
      Alert.alert("Authentication Error", "Please log in to publish articles.");
      return;
    }

    console.log('Validations passed, starting article creation...');

    try {
      console.log('Preparing article data...');

      const safeSummary = summary || title;
      const finalSummary = safeSummary.length > 100 ? safeSummary.substring(0, 97) + '...' : safeSummary;

      // Preparar dados do artigo
      const articleData: CreateArticleData = {
        title,
        content: marked.parse(articleMarkdownContent) as string,
        author_id: user.id,
        article_tag: 'journal',
        summary: finalSummary, // Limita a 100 caracteres conforme schema
        main_image_url: mainImageUrl || null,
        is_published: true,
      };

      console.log('Sending to createArticle:', articleData);

      // Criar artigo usando o serviço
      const newArticle = await createArticle(articleData);

      console.log('✅ Article created successfully:', newArticle);

      // Sucesso
      Alert.alert(
        "Article Published! 🎉",
        "Your article has been successfully published and is now live."
      );

      console.log('Clearing form...');

      // Reset form fields
      setTitle("My Awesome Article");
      setAuthor(user?.email || "");
      setDate(new Date().toLocaleDateString('pt-BR'));
      setSummary("");
      setArticleMarkdownContent('');
      setMainImageUrl("https://placehold.co/800x450.png");

    } catch (error: any) {
      console.error('Error publishing article:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Tratamento de erros específicos
      let errorMessage = 'An unexpected error occurred.';

      if (error.message.includes('slug')) {
        errorMessage = 'An article with a similar title already exists. Please try a different title.';
      } else if (error.message.includes('author_id')) {
        errorMessage = 'Authentication error. Please log out and log in again.';
      } else if (error.message.includes('article_tag')) {
        errorMessage = 'Invalid article category. Please try again.';
      } else if (error.message.includes('summary')) {
        errorMessage = 'Article summary is too long. Please shorten it.';
      } else {
        errorMessage = `Failed to publish article: ${error.message}`;
      }

      Alert.alert("Error", errorMessage);
    }
  }, [title, articleMarkdownContent, user, isLoggedIn, summary, mainImageUrl]);

  const articleHtmlContent = useMemo(() => marked.parse(articleMarkdownContent) as string, [articleMarkdownContent])


  return (
    // SafeAreaView serve como o fundo global da tela
    <SafeAreaView style={styles.globalBackground}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main container for responsive layout and external padding */}
        <ThemedView style={[
          styles.mainContentContainer,
          isLargeScreen && styles.mainContentContainerLarge
        ]}>
          {isLargeScreen ? (
            // Layout de tela grande: Formulário à esquerda, Preview à direita
            <ThemedView style={styles.responsiveLayout}>
              <ArticleForm
                isLargeScreen={isLargeScreen}
                theme={theme} // Passa o tema tipado
                title={title}
                setTitle={setTitle}
                author={author}
                setAuthor={setAuthor}
                date={date}
                setDate={setDate}
                mainImageUrl={mainImageUrl}
                setMainImageUrl={setMainImageUrl}
                articleMarkdownContent={articleMarkdownContent}
                setArticleMarkdownContent={setArticleMarkdownContent}
                isTitleFocused={isTitleFocused}
                setIsTitleFocused={setIsTitleFocused}
                isAuthorFocused={isAuthorFocused}
                setIsAuthorFocused={setIsAuthorFocused}
                isDateFocused={isDateFocused}
                setIsDateFocused={setIsDateFocused}
                isImageUrlFocused={isImageUrlFocused}
                setIsImageUrlFocused={setIsImageUrlFocused}
                setPreviewMode={setPreviewMode}
                previewMode={previewMode}
                handlePublish={handlePublish} // Função memoizada
                handleImagePicker={handleImagePicker} // Função memoizada
              />
              <ArticlePreview
                isLargeScreen={isLargeScreen}
                previewMode={previewMode}
                htmlContent={articleHtmlContent} // Valor memoizado
                title={title}
                author={author}
                date={date}
                imageUrl={mainImageUrl}
                theme={theme} // Passa o tema tipado
              />
            </ThemedView>
          ) : (
            // Layout de tela pequena: Empilhado verticalmente
            <>
              <ArticleForm
                isLargeScreen={isLargeScreen}
                theme={theme} // Passa o tema tipado
                title={title}
                setTitle={setTitle}
                author={author}
                setAuthor={setAuthor}
                date={date}
                setDate={setDate}
                mainImageUrl={mainImageUrl}
                setMainImageUrl={setMainImageUrl}
                articleMarkdownContent={articleMarkdownContent}
                setArticleMarkdownContent={setArticleMarkdownContent}
                isTitleFocused={isTitleFocused}
                setIsTitleFocused={setIsTitleFocused}
                isAuthorFocused={isAuthorFocused}
                setIsAuthorFocused={setIsAuthorFocused}
                isDateFocused={isDateFocused}
                setIsDateFocused={setIsDateFocused}
                isImageUrlFocused={isImageUrlFocused}
                setIsImageUrlFocused={setIsImageUrlFocused}
                setPreviewMode={setPreviewMode}
                previewMode={previewMode}
                handlePublish={handlePublish} // Função memoizada
                handleImagePicker={handleImagePicker} // Função memoizada
              />
              <ArticlePreview
                isLargeScreen={isLargeScreen}
                previewMode={previewMode}
                htmlContent={articleHtmlContent} // Valor memoizado
                title={title}
                author={author}
                date={date}
                imageUrl={mainImageUrl}
                theme={theme} // Passa o tema tipado
              />
            </>
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Component Styles ( ESTILOS GLOBAIS E ESPECÍFICOS DESTE LAYOUT) ---
const styles = StyleSheet.create({
  globalBackground: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContentContainer: {
    padding: 20,
    backgroundColor: "transparent",
  },
  mainContentContainerLarge: {
    paddingHorizontal: 40,
    maxWidth: 1920,
    alignSelf: 'center',
    width: '100%',
  },
  responsiveLayout: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'flex-start',
  },
});
