import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  View, // Import View for the new container
} from "react-native";
import { View as ThemedView, Text as ThemedText } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import RichTextEditor from "@/src/components/RichTextEditor";
import { Feather } from '@expo/vector-icons'; // Import Feather icons (make sure @expo/vector-icons is installed)

// Defina as props que ArticleForm precisa receber do pai
interface ArticleFormProps {
  isLargeScreen: boolean;
  theme: keyof typeof Colors; // Corrected theme typing
  title: string;
  setTitle: (text: string) => void;
  author: string;
  setAuthor: (text: string) => void;
  date: string;
  setDate: (text: string) => void;
  mainImageUrl: string;
  setMainImageUrl: (url: string) => void;
  articleMarkdownContent: string;
  setArticleMarkdownContent: (text: string) => void;
  isTitleFocused: boolean;
  setIsTitleFocused: (focused: boolean) => void;
  isAuthorFocused: boolean;
  setIsAuthorFocused: (focused: boolean) => void;
  isDateFocused: boolean;
  setIsDateFocused: (focused: boolean) => void;
  isImageUrlFocused: boolean;
  setIsImageUrlFocused: (focused: boolean) => void;
  setPreviewMode: (mode: "mobile" | "tablet" | "desktop") => void;
  previewMode: "mobile" | "tablet" | "desktop";
  handlePublish: () => void;
  handleImagePicker: () => void;
}

const ArticleForm = ({
  isLargeScreen,
  theme,
  title,
  setTitle,
  author,
  setAuthor,
  date,
  setDate,
  mainImageUrl,
  setMainImageUrl,
  articleMarkdownContent,
  setArticleMarkdownContent,
  isTitleFocused,
  setIsTitleFocused,
  isAuthorFocused,
  setIsAuthorFocused,
  isDateFocused,
  setIsDateFocused,
  isImageUrlFocused,
  setIsImageUrlFocused,
  setPreviewMode,
  previewMode,
  handlePublish,
  handleImagePicker,
}: ArticleFormProps) => {
  return (
    <ThemedView style={[
      formStyles.cardBase,
      isLargeScreen && formStyles.responsiveFormCard
    ]}>
      <ThemedText style={[formStyles.headerTitle, { color: Colors[theme].text }]}>
        Create your <ThemedText style={{ color: Colors.light.tint }}>Publication</ThemedText>
      </ThemedText>
      <ThemedText style={[formStyles.subtitle, { color: Colors[theme].text }]}>
        Create and visualize your articles.
      </ThemedText>

      {/* Title Input */}
      <ThemedText style={formStyles.label}>Title</ThemedText>
      <TextInput
        style={[
          formStyles.inputBase,
          formStyles.titleInput,
          isTitleFocused ? formStyles.inputFocused : formStyles.inputDefault,
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

      {/* Author and Date Row */}
      <ThemedView style={formStyles.rowContainer}>
        <ThemedView style={formStyles.halfWidth}>
          <ThemedText style={formStyles.label}>Author</ThemedText>
          <TextInput
            style={[
              formStyles.inputBase,
              formStyles.shortInput,
              isAuthorFocused ? formStyles.inputFocused : formStyles.inputDefault,
              {
                backgroundColor: Colors[theme].inputBackground,
                color: Colors[theme].inputText,
              },
            ]}
            onFocus={() => setIsAuthorFocused(true)}
            onBlur={() => setIsAuthorFocused(false)}
            onChangeText={setAuthor}
            value={author}
            placeholder="Author name..."
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          />
        </ThemedView>

        <ThemedView style={formStyles.halfWidth}>
          <ThemedText style={formStyles.label}>Date</ThemedText>
          <TextInput
            style={[
              formStyles.inputBase,
              formStyles.shortInput,
              isDateFocused ? formStyles.inputFocused : formStyles.inputDefault,
              {
                backgroundColor: Colors[theme].inputBackground,
                color: Colors[theme].inputText,
              },
            ]}
            onFocus={() => setIsDateFocused(true)}
            onBlur={() => setIsDateFocused(false)}
            onChangeText={setDate}
            value={date}
            placeholder="dd/mm/yyyy"
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          />
        </ThemedView>
      </ThemedView>

      {/* Image URL Input */}
      <ThemedText style={formStyles.label}>Image URL (Optional)</ThemedText>
      <View style={formStyles.imageInputContainer}> {/* Changed to standard 'View' as it's just for layout */}
        <TextInput
          style={[
            formStyles.inputBase,
            formStyles.titleInput,
            isImageUrlFocused ? formStyles.inputFocused : formStyles.inputDefault,
            {
              backgroundColor: Colors[theme].inputBackground,
              color: Colors[theme].inputText,
              flex: 1,
              marginRight: 10, // Spacing between input and button
            },
          ]}
          onFocus={() => setIsImageUrlFocused(true)}
          onBlur={() => setIsImageUrlFocused(false)}
          onChangeText={setMainImageUrl}
          value={mainImageUrl}
          placeholder="https://example.com/image.jpg"
          placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        />
        {/* NEW PICK IMAGE BUTTON */}
        <TouchableOpacity
          onPress={handleImagePicker}
          style={[
            formStyles.imagePickerButton,
            { backgroundColor: Colors[theme].tint }
          ]}
        >
          <Feather name="image" size={24} color="white" /> {/* Image icon */}
        </TouchableOpacity>
      </View>

      {/* HTML Content Editor */}
      <ThemedText style={formStyles.label}>HTML Content</ThemedText>
      <RichTextEditor
        value={articleMarkdownContent}
        onChangeText={setArticleMarkdownContent}
        placeholder="Start writing your article... Use Markdown formatting."
        style={formStyles.contentEditor}
      />

      {/* Device Type Selection with Radio Buttons */}
      <ThemedText style={formStyles.label}>Device Type</ThemedText>
      <ThemedView style={formStyles.deviceTypeContainer}>
        {/* Mobile Radio Option */}
        <TouchableOpacity
          style={formStyles.radioButtonOption}
          onPress={() => setPreviewMode("mobile")}
        >
          <ThemedView style={[
            formStyles.radioButton,
            previewMode === "mobile" && formStyles.radioButtonActive
          ]}>
            {previewMode === "mobile" && <ThemedView style={formStyles.radioButtonInner} />}
          </ThemedView>
          <ThemedText style={formStyles.deviceTypeButtonText}>
            Mobile
          </ThemedText>
        </TouchableOpacity>

        {/* Tablet Radio Option */}
        <TouchableOpacity
          style={formStyles.radioButtonOption}
          onPress={() => setPreviewMode("tablet")}
        >
          <ThemedView style={[
            formStyles.radioButton,
            previewMode === "tablet" && formStyles.radioButtonActive
          ]}>
            {previewMode === "tablet" && <ThemedView style={formStyles.radioButtonInner} />}
          </ThemedView>
          <ThemedText style={formStyles.deviceTypeButtonText}>
            Tablet
          </ThemedText>
        </TouchableOpacity>

        {/* Desktop Radio Option */}
        <TouchableOpacity
          style={formStyles.radioButtonOption}
          onPress={() => setPreviewMode("desktop")}
        >
          <ThemedView style={[
            formStyles.radioButton,
            previewMode === "desktop" && formStyles.radioButtonActive
          ]}>
            {previewMode === "desktop" && <ThemedView style={formStyles.radioButtonInner} />}
          </ThemedView>
          <ThemedText style={formStyles.deviceTypeButtonText}>
            Desktop
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Publish Button */}
      <TouchableOpacity
        style={formStyles.publishButton}
        onPress={handlePublish}
      >
        <ThemedText style={formStyles.publishButtonText}>
          Publish Article
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const formStyles = StyleSheet.create({
  cardBase: {
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  responsiveFormCard: {
    flex: 1,
  },
  headerTitle: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    opacity: 0.8,
    textAlign: "left",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#555",
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    backgroundColor: 'transparent',
  },
  halfWidth: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inputBase: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginTop: 5,
    fontSize: 16,
  },
  inputDefault: {
    borderColor: "#E5E7EB",
  },
  inputFocused: {
    borderColor: "purple",
    shadowColor: "purple",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleInput: {
    minHeight: 50,
  },
  shortInput: {
    minHeight: 45,
  },
  contentEditor: {
    minHeight: 200,
    maxHeight: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
  },
  deviceTypeContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 5,
    alignItems: 'center',
    gap: 20,
  },
  radioButtonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioButton: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
  },
  radioButtonActive: {
    borderColor: 'purple',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'purple',
  },
  deviceTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  // NEW STYLES FOR THE IMAGE PICKER BUTTON
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  imagePickerButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  // END NEW STYLES
  publishButton: {
    backgroundColor: Colors.light.tint,
    padding: 18,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  publishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default React.memo(ArticleForm);
