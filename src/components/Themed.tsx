/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";

import { type BlurTint } from "expo-blur";
import Colors from "@/src/constants/Colors";
import { useColorScheme } from "./useColorScheme";
import MeshGradientBackground from "@/src/components/MeshGradientBackground";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  ) as string;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  ) as string;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function GradientBackground() {
  const theme = useColorScheme() ?? "light";
  const themeColors = Colors[theme].meshGradient;
  const tint = theme as BlurTint; // 'light' ou 'dark'
  return <MeshGradientBackground colors={themeColors} tint={tint} />;
}
