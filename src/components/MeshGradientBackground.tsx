import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';

/**
 * Um componente de fundo com um efeito de "mesh gradient" (gradiente de malha),
 * baseado no código original do usuário e ajustado para corresponder à imagem de referência.
 */
export default function MeshGradientBackground() {
  const { height, width } = useWindowDimensions();
  // Ampliamos o tamanho do SVG para evitar bordas nítidas após a aplicação do blur.
  // Isso garante que o gradiente cubra toda a tela suavemente.
  const svgViewBox = {
    width: width * 1.5,
    height: height * 1.5,
  };

  return (
    <View style={styles.container}>
      {/* O Svg é posicionado para cobrir toda a área, mesmo sendo maior que a tela. */}
      <Svg
        height={svgViewBox.height}
        width={svgViewBox.width}
        style={[styles.svgContainer, { top: -(height * 0.25), left: -(width * 0.25) }]}
      >
        <Defs>
          {/* Círculo 1: Vermelho/Rosa (Canto Superior Esquerdo) */}
          <RadialGradient id="grad1" cx="15%" cy="15%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor="#E54D4D" stopOpacity="1" />
            <Stop offset="100%" stopColor="#E54D4D" stopOpacity="0" />
          </RadialGradient>

          {/* Círculo 2: Roxo/Azul (Parte Inferior Central) */}
          <RadialGradient id="grad2" cx="50%" cy="100%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor="#4A00E0" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4A00E0" stopOpacity="0" />
          </RadialGradient>

          {/* Círculo 3: Ponto de Luz Azul Claro (Centro-Direita) */}
          <RadialGradient id="grad3" cx="85%" cy="40%" rx="45%" ry="45%">
            <Stop offset="0%" stopColor="#D6E4FF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#D6E4FF" stopOpacity="0" />
          </RadialGradient>

          {/* Círculo 4: Vermelho/Rosa (Canto Inferior Direito para reforçar) */}
          <RadialGradient id="grad4" cx="80%" cy="90%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#D94A5C" stopOpacity="1" />
            <Stop offset="100%" stopColor="#D94A5C" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Usamos uma base escura que complementa os gradientes, em vez de preto puro */}
        <Rect width="100%" height="100%" fill="#1A1D4D" />

        {/* As camadas de gradiente são aplicadas sobre a base */}
        <Rect width="100%" height="100%" fill="url(#grad1)" />
        <Rect width="100%" height="100%" fill="url(#grad2)" />
        <Rect width="100%" height="100%" fill="url(#grad3)" />
        <Rect width="100%" height="100%" fill="url(#grad4)" />
      </Svg>

      {/* A intensidade do BlurView foi significativamente aumentada para criar a
          mistura suave característica do "mesh gradient". Ajuste este valor
          se desejar mais ou menos desfoque.
      */}
      <BlurView
        intensity={10}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden', // Esconde as partes do SVG que ficam fora da tela.
  },
  svgContainer: {
    position: 'absolute',
  },
});
