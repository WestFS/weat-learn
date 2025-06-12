const tintColorLight = '#5A4FCF';
const tintColorDark = '#BFA8FF';

export default {
  light: {
    text: '#1A1A1A',
    background: '#F5F4FA',
    tint: tintColorLight,
    tabIconDefault: '#AAA',
    tabIconSelected: tintColorLight,
    inputBackground: '#FFFFFF',
    inputText: '#1A1A1A',

    // MeshGradient (light)
    meshGradient: {
      base: '#C3B1E1',
      grad1: '#957DAD',
      grad2: '#E0BBE4',
      grad3: '#A0D9FF',
      grad4: '#8A2BE2',
    },
  },
  dark: {
    text: '#FFFFFF',
    background: '#1D102B',
    tint: tintColorDark,
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    inputBackground: '#2E1A47',
    inputText: '#FFFFFF',

    // MeshGradient (dark)
    meshGradient: {
      base: '#1A1D4D',
      grad1: '#6A057F',
      grad2: '#9B59B6',
      grad3: '#4B0082',
      grad4: '#FFC0CB',
    },
  },
};
