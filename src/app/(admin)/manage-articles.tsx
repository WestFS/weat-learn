import { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
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
import HTML from "react-native-render-html";
import GlassView from "@/src/components/GlassView";
import { marked } from "marked";

export default function ManageArticleScreen() {
  const theme = useColorScheme() ?? "light";
  const { width } = useWindowDimensions();

  // State for article content in Markdown
  const [articleMarkdownContent, setArticleMarkdownContent] = useState("");

  // States for input focus (for the "light" effect)
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isSummaryFocused, setIsSummaryFocused] = useState(false);
  const [isArticleFocused, setIsArticleFocused] = useState(false);

  // Ref for the article TextInput (needed to manipulate cursor)
  const articleTextInputRef = useRef<TextInput>(null);

  // State to store the current selection of the article TextInput
  const [articleSelection, setArticleSelection] = useState({
    start: 0,
    end: 0,
  });

  // State to control preview display mode: 'mobile' or 'web'
  const [previewMode, setPreviewMode] = useState("mobile");

  // Function to determine preview width based on the selected mode
  const getPreviewWidth = () => {
    const containerPadding = 20 * 2;
    if (previewMode === "mobile") {
      return width - containerPadding;
    } else {
      return Math.min(width - containerPadding, 768);
    }
  };

  // Function to handle image selection and insertion
  const handleImagePicker = async () => {
    // 1. Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Permission Denied" +
          "\nWe need access to your gallery to add images to the article."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // Allows user to edit/crop the image
      aspect: [4, 3], // Aspect ratio
      quality: 1, // Upload quality
    });

    // 3. TODO: Implement actual image upload to your Object Storage (Firebase Storage, S3, etc.)

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      alert(
        "Image Upload (Simulated)" +
          "The image has been selected. In production, it would be uploaded to your storage service, and the real URL would be used."
      );
      const imageUrl = uri; // Using local URI for now for preview testing

      const markdownImage = `![Added Image](${imageUrl})\n\n`;

      const start = articleSelection.start;
      const end = articleSelection.end;

      let newArticleContent =
        articleMarkdownContent.substring(0, start) +
        markdownImage +
        articleMarkdownContent.substring(end);

      setArticleMarkdownContent(newArticleContent);

      if (articleTextInputRef.current) {
        const newCursorPosition = start + markdownImage.length;
        if (
          Platform.OS !== "web" &&
          articleTextInputRef.current.setNativeProps
        ) {
          articleTextInputRef.current.setNativeProps({
            selection: { start: newCursorPosition, end: newCursorPosition },
          });
        } else if (Platform.OS === "web") {
          console.warn(
            "Moving cursor after image insertion is not fully supported in Expo Web via setNativeProps"
          );
        }
      }
    }
  };

  const articleHtmlContent = marked(articleMarkdownContent);

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
          <TextInput
            style={[
              styles.inputBase,
              styles.titleInput, // Specific style for title
              isTitleFocused ? styles.inputFocused : styles.inputDefault,
              {
                backgroundColor: Colors[theme].inputBackground,
                color: Colors[theme].inputText,
              },
            ]}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
            // Add value and onChangeText for title
          />

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
            onFocus={() => setIsSummaryFocused(true)}
            onBlur={() => setIsSummaryFocused(false)}
            // Add value and onChangeText for summary
          />

          <ThemedText style={styles.label}>Article:</ThemedText>
          <TextInput
            ref={articleTextInputRef}
            style={[
              styles.inputBase,
              styles.articleInput,
              isArticleFocused ? styles.inputFocused : styles.inputDefault,
              {
                backgroundColor: Colors[theme].inputBackground,
                color: Colors[theme].inputText,
              },
            ]}
            multiline
            onChangeText={setArticleMarkdownContent}
            value={articleMarkdownContent}
            onFocus={() => setIsArticleFocused(true)}
            onBlur={() => setIsArticleFocused(false)}
            // Update selection state whenever it changes
            onSelectionChange={(event) =>
              setArticleSelection(event.nativeEvent.selection)
            }
          />

          <TouchableOpacity
            style={styles.insertImageButton}
            onPress={handleImagePicker}
          >
            <ThemedText style={styles.insertImageButtonText}>
              Insert an Image
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.label}>Attachments:</ThemedText>
          {/* SPACE FOR GENERAL ATTACHMENTS*/}

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
                Mobile
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.previewToggleButton,
                previewMode === "web" && styles.previewToggleButtonActive,
              ]}
              onPress={() => setPreviewMode("web")}
            >
              <ThemedText
                style={[
                  styles.previewButtonText,
                  {
                    color:
                      previewMode === "web"
                        ? Colors[theme].background
                        : Colors[theme].text,
                  },
                ]}
              >
                Web
              </ThemedText>
            </TouchableOpacity>
          </GlassView>

          {/* Article preview with Glassmorphism */}
          <GlassView style={styles.previewContainer} hasShadow={true}>
            {articleMarkdownContent ? ( // Only render if there's Markdown content
              <HTML
                source={{ html: articleHtmlContent }} // Pass the converted HTML
                contentWidth={getPreviewWidth()} // Preview width is dynamic
                tagsStyles={htmlTagsStyles} // HTML tag styles
              />
            ) : (
              <ThemedText style={styles.noPreviewText}>
                Type your article to see the preview.
              </ThemedText>
            )}
          </GlassView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
// --- HTML Tag Styles ---
const htmlTagsStyles = {
  p: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: "#333",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#1A1A1A",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#1A1A1A",
  },
  h3: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    color: "#1A1A1A",
  },
  ul: {
    marginBottom: 10,
  },
  li: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
    color: "#333",
  },
  img: {
    maxWidth: "100%",
    height: "auto",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  a: {
    color: "purple",
    textDecorationLine: "underline",
  },
};

// --- Component Styles ---
// (MOVED TO THE END)
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
  articleInput: {
    minHeight: 500,
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

  // <---- PREVIEW CONTAINER STYLES ---->
  previewContainer: {
    padding: 10,
    minHeight: 200,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  noPreviewText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});
