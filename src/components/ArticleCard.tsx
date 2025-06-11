import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "./Themed";

export default function ArticleCard() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <GradientBackground />
        <View style={[styles.card, { backgroundColor: "#3c0a6b" }]}>
          <Image
            source={{ uri: "https://picsum.photos/200/200" }}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {" "}
              Lorem ipsum dolor sit ametaaaa{" "}
            </Text>
            <Text style={styles.sumary} numberOfLines={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              felis metus, dapibus eu ultrices sit amet, elementum sit amet dui.
              ttrttttttttttttttttt
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  card: {
    flexDirection: "row", // <-- linha horizontal
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
  },

  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: 500,
  },

  sumary: {
    fontSize: 12,
    marginTop: 4,
    color: "#555",
    width: "100%",
  },
});
