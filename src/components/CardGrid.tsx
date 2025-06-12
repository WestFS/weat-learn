import { StyleSheet, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { CardItem } from "@/src/types/ui";
import {
  Text as ThemedText,
  View as ThemedView,
} from "@/src/components/Themed";
import GlassView from "./GlassView";

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
              <GlassView
                style={[
                  styles.squareButton,
                  {
                    opacity: pressed ? 0.9 : 1,
                    backgroundColor: pressed
                      ? "rgba(0, 0, 0, 0.1)"
                      : "transparent",
                  },
                ]}
              >
                <ThemedText style={styles.buttonText}>{item.label}</ThemedText>
              </GlassView>
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
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  squareButton: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
