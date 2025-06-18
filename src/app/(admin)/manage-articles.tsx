import { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
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
import * as ImagePicker from "expo-image-picker";
import { marked } from "marked";
import { Article } from "@/src/types/article";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import RichTextEditor from "@/src/components/RichTextEditor";
import DevicePreview from "@/src/components/DevicePreview";
import GlassView from "@/src/components/GlassView";

export default function ManageArticleScreen() {
  const theme = useColorScheme() ?? "light";
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth()

  // State for article content in Markdown
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [articleMarkdownContent, setArticleMarkdownContent] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(
    undefined
  );

  // States for input focus (for the "light" effect)
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isSummaryFocused, setIsSummaryFocused] = useState(false);

  // State to control preview display mode: 'mobile', 'tablet', or 'desktop'
  const [previewMode, setPreviewMode] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // Function to handle image selection and insertion
  const handleImagePicker = async () => {
    // 1. Request media library permissions
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
      allowsEditing: true, // Allows user to edit/crop the image
      aspect: [4, 3], // Aspect ratio
      quality: 0.7, // Upload quality
      base64: true,
    });

    // 3. TODO: Implement actual image upload to your Object Storage (Firebase Storage, S3, etc.)

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      Alert.alert(
        "Image Upload (Simulated)",
        "The image has been selected. In production, it would be uploaded to your storage service, and the real URL would be used."
      );
      const imageUrl = uri; // Using local URI for now for preview testing

      if (!mainImageUrl) {
        setMainImageUrl(imageUrl);
      }

      const markdownImage = `![Added Image](${imageUrl})\n\n`;
      setArticleMarkdownContent(prev => prev + markdownImage);
    }
  };

  const articleHtmlContent = marked.parse(articleMarkdownContent) as string;

  const handlePublish = () => {
    if (!title || !summary || !articleMarkdownContent) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields (Title, Summary, Article Content) before publishing."
      );
      return;
    }

    const newPublication: Omit<
      Article,
      "id" | "created_at" | "updated_at" | "slug"
    > = {
      title,
      article_tag: 'article',
      author_id: user?.id || '',
      author: user?.email || "Admin User",
      summary,
      content: articleHtmlContent, // Store the HTML content
      main_image_url:
        mainImageUrl ||
        "https://placehold.co/600x400/purple/white?text=No+Image", // Use main image or a placeholder
      is_published: true,
    };

    setTitle("");
    setSummary("");
    setArticleMarkdownContent("");
    setMainImageUrl(undefined);
    setIsTitleFocused(false);
    setIsSummaryFocused(false);
  };

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

          {/* Title Input */}
          <ThemedText style={styles.label}>Title:</ThemedText>
          <TextInput
            style={[
              styles.inputBase,
              styles.titleInput,
              isTitleFocused ? styles.inputFocused : styles.inputDefault,
              {
                backgroundColor: Colors[theme].inputBackground,
                color: Colors[theme].inputText,
              },
            ]}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            onChangeText={setTitle}
            value={title}
            placeholder="Enter your article title..."
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          />

          {/* Summary Input */}
          <ThemedText style={styles.label}>Summary:</ThemedText>
          <TextInput
            style={[
              styles.inputBase,
              styles.summaryInput,
              isSummaryFocused ? styles.inputFocused : styles.inputDefault,
              {
                backgroundColor: Colors[theme].inputBackground,
                color: Colors[theme].inputText,
              },
            ]}
            multiline
            onChangeText={setSummary}
            value={summary}
            onFocus={() => setIsSummaryFocused(true)}
            onBlur={() => setIsSummaryFocused(false)}
            placeholder="Write a brief summary of your article..."
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          />

          {/* Rich Text Editor */}
          <ThemedText style={styles.label}>Article Content:</ThemedText>
          <RichTextEditor
            value={articleMarkdownContent}
            onChangeText={setArticleMarkdownContent}
            placeholder="Start writing your article... Use the toolbar above to format your text."
          />

          {/* Image Picker Button */}
          <TouchableOpacity
            style={styles.insertImageButton}
            onPress={handleImagePicker}
          >
            <ThemedText style={styles.insertImageButtonText}>
              Insert an Image
            </ThemedText>
          </TouchableOpacity>

          {/* Preview Section */}
          <ThemedText style={styles.label}>Preview:</ThemedText>

          {/* Preview toggle buttons container with Glassmorphism */}
          <GlassView style={styles.previewToggleContainer} hasShadow={false}>
            <TouchableOpacity
              style={[
                styles.previewToggleButton,
                previewMode === "mobile" && styles.previewToggleButtonActive,
              ]}
              onPress={() => setPreviewMode("mobile")}
            >
              <ThemedText
                style={[
                  styles.previewButtonText,
                  {
                    color:
                      previewMode === "mobile"
                        ? Colors[theme].background
                        : Colors[theme].text,
                  },
                ]}
              >
                📱 Mobile
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.previewToggleButton,
                previewMode === "tablet" && styles.previewToggleButtonActive,
              ]}
              onPress={() => setPreviewMode("tablet")}
            >
              <ThemedText
                style={[
                  styles.previewButtonText,
                  {
                    color:
                      previewMode === "tablet"
                        ? Colors[theme].background
                        : Colors[theme].text,
                  },
                ]}
              >
                📱 Tablet
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.previewToggleButton,
                previewMode === "desktop" && styles.previewToggleButtonActive,
              ]}
              onPress={() => setPreviewMode("desktop")}
            >
              <ThemedText
                style={[
                  styles.previewButtonText,
                  {
                    color:
                      previewMode === "desktop"
                        ? Colors[theme].background
                        : Colors[theme].text,
                  },
                ]}
              >
                💻 Desktop
              </ThemedText>
            </TouchableOpacity>
          </GlassView>

          {/* Device Preview */}
          <DevicePreview
            htmlContent={articleHtmlContent}
            deviceType={previewMode}
            title={title || "Article Title"}
            author={user?.email || "Author Name"}
            date={new Date().toLocaleDateString()}
            imageUrl={mainImageUrl}
          />

          {/* Publish Button */}
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
          >
            <ThemedText style={styles.publishButtonText}>
              Publish Article
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Component Styles ---
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

  // <---- FORM LABEL STYLES ---->
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

  // <---- FORM INPUT STYLES ---->
  inputBase: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  inputDefault: {
    borderColor: "#ccc",
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  inputFocused: {
    borderColor: "purple",
    shadowColor: "purple",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  titleInput: {},
  summaryInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // <---- BUTTON STYLES ---->
  insertImageButton: {
    backgroundColor: "purple",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  insertImageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  publishButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // <---- PREVIEW TOGGLE STYLES ---->
  previewToggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "transparent",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  previewToggleButtonActive: {
    backgroundColor: "purple",
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
