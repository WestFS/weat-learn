const tintColorLight = '#5A4FCF'; // Azul arroxeado elegante
const tintColorDark = '#BFA8FF';  // Lilás suave com visibilidade no dark

export default {
  light: {
    text: '#1A1A1A',             // Quase preto (mais suave que #000)
    background: '#F5F4FA',       // Lilás claro quase branco (fundo leve)
    tint: tintColorLight,        // Para botões, links etc
    tabIconDefault: '#AAA',
    tabIconSelected: tintColorLight,
    inputBackground: '#fff',
  },
  dark: {
    text: '#FFFFFF',             // Texto branco para contraste
    background: '#1D102B',       // Roxo bem escuro com toque azulado
    tint: tintColorDark,         // Roxo/lilás claro no escuro
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
    inputBackground: '#fff',
  },
};

/**
   #### Default color ####
const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

 */
