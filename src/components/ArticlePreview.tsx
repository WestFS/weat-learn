import React from 'react';
import { StyleSheet } from "react-native";
import { View as ThemedView, Text as ThemedText } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import DevicePreview from "@/src/components/DevicePreview";

interface ArticlePreviewProps {
  isLargeScreen: boolean;
  previewMode: "mobile" | "tablet" | "desktop";
  htmlContent: string;
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
  theme: keyof typeof Colors;
}

const ArticlePreview = ({
  isLargeScreen,
  previewMode,
  htmlContent,
  title,
  author,
  date,
  imageUrl,
  theme,
}: ArticlePreviewProps) => {


  return (
    <ThemedView style={[
      previewStyles.cardBase,
      isLargeScreen && previewStyles.responsivePreviewCard
    ]}>
      {isLargeScreen && (
        <ThemedView style={previewStyles.previewHeader}>
          <ThemedText
            style={[
              previewStyles.previewLabel,
              {
                // Se quiser que ela mude com o tema, use Colors[theme].tint
                backgroundColor: Colors[theme].tint,
                color: "white",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 5,
                fontSize: 14,
                fontWeight: "600",
              },
            ]}
          >
            {previewMode === "mobile" ? "iPhone Preview" :
              previewMode === "tablet" ? "Tablet Preview" :
                "Desktop Preview"}
          </ThemedText>
        </ThemedView>
      )}

      {/* O componente DevicePreview, que simula o dispositivo */}
      <DevicePreview
        htmlContent={htmlContent}
        deviceType={previewMode}
        title={title}
        author={author}
        date={date}
        imageUrl={imageUrl}
      // theme={theme}
      />
    </ThemedView>
  );
};

// Crie os estilos específicos para este componente
const previewStyles = StyleSheet.create({
  cardBase: {
    backgroundColor: Colors.light.background, // Mude para Colors[theme].background se o card deve mudar de cor com o tema
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  responsivePreviewCard: {
    flex: 2,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  previewLabel: {
    textAlign: 'center',
  },
});

export default React.memo(ArticlePreview); // IMPORTANTE: Memoize o componente
