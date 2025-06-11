import { Href } from "expo-router";
import { type BlurTint } from 'expo-blur';

export type CardItem = {
  label: string;
  path: Href;
};

export type GradientColors = {
  base: string;
  grad1: string;
  grad2: string;
  grad3: string;
  grad4: string;
};

export type MeshGradientBackgroundProps = {
  colors: GradientColors;
  tint: BlurTint;
  intensity?: number;
};
