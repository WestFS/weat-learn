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
      base: '#EAEBFF',
      grad1: '#4A00E0',
      grad2: '#F3CFC6',
      grad3: '#FDFD96',
      grad4: '#C3B1E1',
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
      grad1: '#E54D4D',
      grad2: '#4A00E0',
      grad3: '#D6E4FF',
      grad4: '#D94A5C',
    },
  },
};
