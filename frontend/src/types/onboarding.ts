// Onboarding flow types and data structures

export interface OnboardingData {
  email: string;
  fullName: string;
  username?: string;
  career: string;
  avatarColor?: string;
  interests: string[];
  goals: string[];
  experience?: string;
  joinReason?: string;
}

export interface Career {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  color: string;
}

export interface AvatarColor {
  id: string;
  name: string;
  bg: string;
  text: string;
}

// Career options for FCiencias
export const CAREERS: Career[] = [
  {
    id: 'actuaria',
    name: 'Actuaría',
    shortName: 'ACT',
    icon: '/icons/careers/actuaria.svg',
    description: 'Ciencias actuariales y financieras',
    color: 'green'
  },
  {
    id: 'biologia',
    name: 'Biología',
    shortName: 'BIO',
    icon: '/icons/careers/biologia.svg',
    description: 'Ciencias biológicas y biomédicas',
    color: 'emerald'
  },
  {
    id: 'computacion',
    name: 'Ciencias de la Computación',
    shortName: 'CC',
    icon: '/icons/careers/computacion.svg',
    description: 'Programación y sistemas computacionales',
    color: 'indigo'
  },
  {
    id: 'ciencias-tierra',
    name: 'Ciencias de la Tierra',
    shortName: 'CT',
    icon: '/icons/careers/ciencias-tierra.svg',
    description: 'Geología, meteorología y geofísica',
    color: 'amber'
  },
  {
    id: 'fisica',
    name: 'Física',
    shortName: 'FIS',
    icon: '/icons/careers/fisica.svg',
    description: 'Física teórica y experimental',
    color: 'purple'
  },
  {
    id: 'fisica-biomedica',
    name: 'Física Biomédica',
    shortName: 'FB',
    icon: '/icons/careers/fisica-biomedica.svg',
    description: 'Física aplicada a las ciencias biomédicas',
    color: 'cyan'
  },
  {
    id: 'matematicas',
    name: 'Matemáticas',
    shortName: 'MAT',
    icon: '/icons/careers/matematicas.svg',
    description: 'Matemáticas puras y aplicadas',
    color: 'blue'
  },
  {
    id: 'matematicas-aplicadas',
    name: 'Matemáticas Aplicadas',
    shortName: 'MA',
    icon: '/icons/careers/matematicas-aplicadas.svg',
    description: 'Matemáticas aplicadas a la computación',
    color: 'teal'
  }
];

// Avatar color options
export const AVATAR_COLORS: AvatarColor[] = [
  { id: 'blue', name: 'Azul Océano', bg: 'bg-blue-500', text: 'text-white' },
  { id: 'indigo', name: 'Índigo Profundo', bg: 'bg-indigo-500', text: 'text-white' },
  { id: 'purple', name: 'Púrpura Real', bg: 'bg-purple-500', text: 'text-white' },
  { id: 'pink', name: 'Rosa Coral', bg: 'bg-pink-500', text: 'text-white' },
  { id: 'red', name: 'Rojo Fuego', bg: 'bg-red-500', text: 'text-white' },
  { id: 'orange', name: 'Naranja Vibrante', bg: 'bg-orange-500', text: 'text-white' },
  { id: 'yellow', name: 'Amarillo Sol', bg: 'bg-yellow-500', text: 'text-black' },
  { id: 'green', name: 'Verde Esmeralda', bg: 'bg-green-500', text: 'text-white' },
  { id: 'teal', name: 'Verde Azulado', bg: 'bg-teal-500', text: 'text-white' },
  { id: 'cyan', name: 'Cian Cristal', bg: 'bg-cyan-500', text: 'text-white' },
  { id: 'gray', name: 'Gris Elegante', bg: 'bg-gray-500', text: 'text-white' },
  { id: 'slate', name: 'Pizarra', bg: 'bg-slate-500', text: 'text-white' },
];

// Legacy types for compatibility (old onboarding system)
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
