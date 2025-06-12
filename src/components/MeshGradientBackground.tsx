import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { BlurView } from "expo-blur";
import { type MeshGradientBackgroundProps } from "@/src/types/ui";

export default function MeshGradientBackground({
  colors,
  tint,
  intensity = 80,
}: MeshGradientBackgroundProps) {
  const { height, width } = useWindowDimensions();

  const svgViewBox = {
    width: width * 1.5,
    height: height * 1.5,
  };

  return (
    <View style={styles.container}>
      <Svg
        height={svgViewBox.height}
        width={svgViewBox.width}
        style={[
          styles.svgContainer,
          { top: -(height * 0.25), left: -(width * 0.25) },
        ]}
      >
        <Defs>
          {/* Círculo 1:(Canto Superior Esquerdo) */}
          <RadialGradient id="grad1" cx="15%" cy="15%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor={colors.grad1} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.grad1} stopOpacity="0" />
          </RadialGradient>

          {/* Círculo 2: (Parte Inferior Central) */}
          <RadialGradient id="grad2" cx="50%" cy="100%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor={colors.grad2} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.grad2} stopOpacity="0" />
          </RadialGradient>

          {/* Círculo 3: (Centro-Direita) */}
          <RadialGradient id="grad3" cx="85%" cy="40%" rx="45%" ry="45%">
            <Stop offset="0%" stopColor={colors.grad3} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.grad3} stopOpacity="0" />
          </RadialGradient>

          {/* Círculo 4: (Canto Inferior Direito para reforçar) */}
          <RadialGradient id="grad4" cx="80%" cy="90%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={colors.grad4} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.grad4} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect width="100%" height="100%" fill={colors.base} />

        <Rect width="100%" height="100%" fill="url(#grad1)" />
        <Rect width="100%" height="100%" fill="url(#grad2)" />
        <Rect width="100%" height="100%" fill="url(#grad3)" />
        <Rect width="100%" height="100%" fill="url(#grad4)" />
      </Svg>

      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  svgContainer: {
    position: "absolute",
  },
});
