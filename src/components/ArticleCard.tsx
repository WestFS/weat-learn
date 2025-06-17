import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import { Publication } from "@/src/types/article";
import GlassView from "@/src/components/GlassView";

interface ArticleCardProps {
  publication: Publication;
  onPress: (publication: Publication) => void;
}

export default function ArticleCard({
  publication,
  onPress,
}: ArticleCardProps) {
  const theme = useColorScheme() ?? "light";
  const textColor = Colors[theme].text;
  const glassCardBackgroundColor = theme === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.5)';

  return (
    <TouchableOpacity
      onPress={() => onPress(publication)}
      style={styles.cardContainerWrapper}
    >
      <GlassView
        style={[
          styles.glassCard,
          { backgroundColor: glassCardBackgroundColor }
        ]}
        borderRadius={8}
        hasShadow={true}
        intensity={theme === 'light' ? 50 : 80}
      >
        <Image
          source={{
            uri:
              publication.imageUrl ||
              "https://picsum.photos/200/200",
          }}
          style={styles.image}
          onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {publication.title}
          </Text>
          <Text style={[styles.summary, { color: textColor }]} numberOfLines={4}>
            {publication.summary}
          </Text>
        </View>
      </GlassView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainerWrapper: {
    marginVertical: 8,
    width: "100%",
  },

  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
  },

  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: "#E0E0E0",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summary: {
    fontSize: 12,
    marginTop: 4,
  },
});
