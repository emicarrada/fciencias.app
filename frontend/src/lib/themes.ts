// Sistema de temas y personalización para FCiencias.app

export const THEME_COLORS = {
  'unam-blue': {
    primary: '#003366',
    secondary: '#0066CC',
    accent: '#4A90E2',
    gradient: 'linear-gradient(135deg, #003366 0%, #0066CC 100%)',
    name: 'Azul UNAM'
  },
  'science-green': {
    primary: '#00A651',
    secondary: '#28A745',
    accent: '#34CE57',
    gradient: 'linear-gradient(135deg, #00A651 0%, #28A745 100%)',
    name: 'Verde Ciencias'
  },
  'math-purple': {
    primary: '#6F42C1',
    secondary: '#9C27B0',
    accent: '#BA68C8',
    gradient: 'linear-gradient(135deg, #6F42C1 0%, #9C27B0 100%)',
    name: 'Púrpura Matemático'
  },
  'physics-orange': {
    primary: '#FF6B35',
    secondary: '#FF8C00',
    accent: '#FFB74D',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)',
    name: 'Naranja Físico'
  },
  'chemistry-red': {
    primary: '#DC3545',
    secondary: '#E74C3C',
    accent: '#F8BBD9',
    gradient: 'linear-gradient(135deg, #DC3545 0%, #E74C3C 100%)',
    name: 'Rojo Química'
  }
} as const;

export type ThemeColor = keyof typeof THEME_COLORS;

export const getThemeColor = (themeColor: ThemeColor) => {
  return THEME_COLORS[themeColor] || THEME_COLORS['unam-blue'];
};

// Avatares sin imágenes - usando iniciales
export const generateInitialsAvatar = (
  name: string, 
  themeColor: ThemeColor = 'unam-blue'
) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const theme = getThemeColor(themeColor);
  
  return {
    type: 'initials' as const,
    initials,
    backgroundColor: theme.primary,
    textColor: '#FFFFFF',
    gradient: theme.gradient
  };
};

// Avatares basados en carrera
export const CAREER_AVATARS = {
  'matematicas': '🔢',
  'fisica': '⚛️',
  'quimica': '🧪',
  'biologia': '🧬',
  'computacion': '💻',
  'actuaria': '📊',
  'matematicas-aplicadas': '📐',
  'ciencias-tierra': '🌍',
  'otros': '🎓'
} as const;

export const generateCareerAvatar = (career: string, themeColor: ThemeColor = 'unam-blue') => {
  const careerKey = career.toLowerCase().replace(/\s+/g, '-') as keyof typeof CAREER_AVATARS;
  const emoji = CAREER_AVATARS[careerKey] || CAREER_AVATARS.otros;
  const theme = getThemeColor(themeColor);

  return {
    type: 'career' as const,
    emoji,
    backgroundColor: theme.secondary,
    borderColor: theme.primary
  };
};

// Configuración de perfil por defecto
export const DEFAULT_PROFILE_CONFIG = {
  themeColor: 'unam-blue' as ThemeColor,
  dashboardLayout: 'cards' as 'cards' | 'list' | 'grid',
  avatarType: 'initials' as 'initials' | 'career',
  showFields: {
    career: true,
    semester: true,
    bio: true,
    joinDate: false,
    achievements: true,
    interests: true
  },
  dashboardWidgets: {
    'upcoming-events': true,
    'recent-announcements': true,
    'my-communities': true,
    'trending-topics': false,
    'academic-calendar': false,
    'study-groups': false
  }
};
