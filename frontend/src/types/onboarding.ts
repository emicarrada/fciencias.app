// Onboarding flow para personalización sin imágenes

export const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "¡Bienvenido a FCiencias! 👋",
    description: "Configuremos tu perfil académico",
    component: "BasicInfo", // Nombre, carrera, semestre
  },
  {
    step: 2,
    title: "Personaliza tu experiencia 🎨",
    description: "Elige tu tema visual favorito",
    component: "ThemeSelector",
    options: [
      { 
        id: 'unam-blue', 
        name: 'Azul UNAM', 
        colors: { primary: '#003366', accent: '#0066CC' },
        preview: 'Clásico y académico'
      },
      { 
        id: 'science-green', 
        name: 'Verde Ciencias', 
        colors: { primary: '#00A651', accent: '#28A745' },
        preview: 'Natural y científico'
      },
      { 
        id: 'math-purple', 
        name: 'Púrpura Matemático', 
        colors: { primary: '#6F42C1', accent: '#9C27B0' },
        preview: 'Abstracto y lógico'
      },
      { 
        id: 'physics-orange', 
        name: 'Naranja Físico', 
        colors: { primary: '#FF6B35', accent: '#FF8C00' },
        preview: 'Energético y dinámico'
      }
    ]
  },
  {
    step: 3,
    title: "Configura tu dashboard 📊",
    description: "¿Qué quieres ver en tu página principal?",
    component: "DashboardConfig",
    options: {
      layout: [
        { id: 'cards', name: 'Tarjetas', icon: '🗃️', description: 'Vista tipo Pinterest' },
        { id: 'list', name: 'Lista', icon: '📋', description: 'Vista tradicional' },
        { id: 'grid', name: 'Cuadrícula', icon: '⚏', description: 'Vista compacta' }
      ],
      widgets: [
        { id: 'upcoming-events', name: 'Próximos Eventos', default: true },
        { id: 'recent-announcements', name: 'Anuncios Recientes', default: true },
        { id: 'my-communities', name: 'Mis Comunidades', default: true },
        { id: 'trending-topics', name: 'Temas Trending', default: false },
        { id: 'academic-calendar', name: 'Calendario Académico', default: false },
        { id: 'study-groups', name: 'Grupos de Estudio', default: false }
      ]
    }
  },
  {
    step: 4,
    title: "Tu perfil público 👤",
    description: "¿Qué información quieres mostrar?",
    component: "ProfileVisibility",
    options: {
      showCareer: { default: true, description: "Tu carrera" },
      showSemester: { default: true, description: "Semestre actual" },
      showBio: { default: true, description: "Descripción personal" },
      showJoinDate: { default: false, description: "Fecha de registro" },
      showAchievements: { default: true, description: "Logros académicos" },
      showInterests: { default: true, description: "Áreas de interés" }
    }
  },
  {
    step: 5,
    title: "¡Listo para comenzar! 🎉",
    description: "Explora tu nueva red académica",
    component: "OnboardingComplete",
    cta: "Ir a mi Dashboard"
  }
];

// Alternativas de avatar sin imágenes
export const AVATAR_STYLES = [
  'initials', // Iniciales con color de fondo
  'geometric', // Formas geométricas generadas
  'pattern', // Patrones basados en nombre
  'emoji', // Emoji representativo de carrera
  'academic-icons' // Iconos académicos
];

// Generador de avatar por iniciales
export const generateAvatarFromInitials = (name: string, themeColor: string) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return {
    initials,
    backgroundColor: themeColor,
    textColor: '#FFFFFF'
  };
};
