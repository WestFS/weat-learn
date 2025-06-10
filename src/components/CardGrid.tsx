import { StyleSheet, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { CardItem } from "@/src/types/ui";
import {
  Text as ThemedText,
  View as ThemedView,
} from "@/src/components/Themed";

type CardGridProps = {
  buttons: readonly CardItem[];
};

export default function CardGrid({ buttons }: CardGridProps) {
  return (
    <FlatList
      data={buttons}
      numColumns={2}
      keyExtractor={(item) => item.label}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <Link href={item.path} asChild>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                lightColor={pressed ? "#e0e0e0" : "#f2f2f2"}
                darkColor={pressed ? "#444444" : "#333333"}
                style={[styles.squareButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <ThemedText style={styles.buttonText}>{item.label}</ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  squareButton: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
