# 📊 Google Analytics - fciencias.app

## ✅ Implementación Completada

He configurado Google Analytics 4 (GA4) en la aplicación web de fciencias.app con las siguientes características:

### 🛠️ Componentes Implementados

1. **Hook personalizado** (`useGoogleAnalytics.ts`)
   - Tracking automático de page views
   - Funciones para eventos personalizados
   - Eventos específicos para plataforma académica

2. **Componente Analytics Tracker** (`AnalyticsTracker.tsx`)
   - Integración automática con Next.js App Router
   - Tracking de navegación client-side

3. **Integración en Layout principal**
   - Google Analytics script cargado condicionalmente
   - Variables de entorno para control de analytics

4. **Eventos en componentes**
   - ReactionButton ahora trackea interacciones
   - Preparado para tracking en otros componentes

### 🔧 Configuración Requerida

Para activar Google Analytics:

1. **Obtener ID de Google Analytics:**
   - Crear cuenta en [Google Analytics](https://analytics.google.com/)
   - Crear propiedad para fciencias.app
   - Obtener Measurement ID (formato: G-XXXXXXXXXX)

2. **Configurar variables de entorno:**
   ```bash
   # En .env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TU_ID_AQUI
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

### 📈 Eventos Trackeados

#### Navegación
- Page views automáticos
- Transiciones entre páginas

#### Interacciones de Usuario
- **Reacciones:** `announcement_reaction` (tipo + ID del contenido)
- **Autenticación:** `login`, `register`, `logout`
- **Contenido:** `announcement_view`, `event_view`, `community_view`
- **Acciones:** `share`, `join`, `leave`, `search`, etc.

#### Datos de Contexto
- Categorías de eventos
- IDs de contenido
- Tipos de interacción
- Labels descriptivos

### 🚀 Estado de la Implementación

✅ **Completado:**
- Instalación de `@next/third-parties`
- Hook de Google Analytics
- Tracker automático de páginas
- Integración en ReactionButton
- Variables de entorno configuradas
- Documentación completa

🔄 **En progreso:**
- Configuración de cuenta real de GA4

❌ **Pendiente:**
- Banner de cookies/consentimiento
- Eventos en otras páginas (login, dashboard, etc.)
- Configuración de Goals en GA4
- Reportes personalizados

### 📝 Próximos Pasos

1. **Configurar cuenta de Google Analytics real**
2. **Añadir tracking a páginas restantes:**
   - Login/Register forms
   - Dashboard interactions
   - Search functionality
   - Community actions
3. **Implementar banner de cookies**
4. **Configurar reportes en GA4**

### 🧪 Testing

Para probar en desarrollo:
```bash
cd frontend
# Activar analytics en desarrollo
export NEXT_PUBLIC_ENABLE_ANALYTICS=true
npm run dev
```

Visita `/demo-reacciones` y haz clic en las reacciones para ver eventos en GA4 (una vez configurado).

### 📊 Métricas Importantes

Una vez configurado, podrás monitorear:
- Usuarios activos diarios/mensuales
- Páginas más visitadas
- Interacciones con contenido
- Flujo de navegación
- Eventos académicos populares
- Crecimiento de comunidades

### 🔒 Privacidad

- No se recopila información personal identificable
- Solo datos de navegación y interacciones
- Configurado para cumplir estándares de privacidad
- Fácil de deshabilitar por usuario
