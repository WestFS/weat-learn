// ARQUIVO: src/components/GlassView.tsx

import React from "react";
import { View, StyleSheet, type ViewProps } from "react-native";
import { BlurView, type BlurTint } from "expo-blur";
import { useColorScheme } from "./useColorScheme";

interface GlassViewProps extends ViewProps {
  children?: React.ReactNode;
  intensity?: number;
  tint?: BlurTint;
  hasShadow?: boolean;
}

export default function GlassView({
  children,
  style,
  intensity = 50,
  tint,
  hasShadow = false,
  ...props
}: GlassViewProps) {
  const theme = useColorScheme() ?? "light";
  const resolvedTint = tint || theme;

  const borderStyle =
    theme === "light"
      ? {
          // Light
          borderBottomColor: "rgba(0, 0, 0, 0.1)",
          borderRightColor: "rgba(0, 0, 0, 0.1)",
          borderTopColor: "rgba(255, 255, 255, 0.5)",
          borderLeftColor: "rgba(255, 255, 255, 0.5)",
        }
      : {
          // Dark
          borderBottomColor: "rgba(0, 0, 0, 0.5)",
          borderRightColor: "rgba(0, 0, 0, 0.5)",
          borderTopColor: "rgba(255, 255, 255, 0.2)",
          borderLeftColor: "rgba(255, 255, 255, 0.2)",
        };

  const shadowStyle = hasShadow
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
      }
    : {};

  return (
    <View
      style={[styles.container, borderStyle, shadowStyle, style]}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint={resolvedTint}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderWidth: 1,
  },
});
