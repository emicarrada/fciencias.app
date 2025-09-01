# Configuración de Google Analytics para fciencias.app

## Configuración Inicial

### 1. Crear cuenta de Google Analytics
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad para `fciencias.app`
3. Obtén el ID de medición (formato: `G-XXXXXXXXXX`)

### 2. Configuración en el proyecto
1. Actualiza el archivo `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TU_ID_AQUI
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

2. Para producción, configura las mismas variables en tu servicio de hosting.

## Eventos Trackeados

### Autenticación
- `login` - Usuario inicia sesión
- `register` - Usuario se registra
- `logout` - Usuario cierra sesión

### Contenido (Anuncios)
- `announcement_view` - Vista de anuncio
- `announcement_reaction` - Reacción a anuncio (like, dislike, etc.)
- `announcement_share` - Compartir anuncio

### Eventos Académicos
- `event_view` - Vista de evento
- `event_register` - Registro a evento
- `event_share` - Compartir evento

### Comunidades
- `community_view` - Vista de comunidad
- `community_join` - Unirse a comunidad
- `community_leave` - Salir de comunidad

### Navegación y Búsqueda
- `search` - Búsquedas realizadas
- `filter` - Aplicación de filtros
- `profile_view` - Vista de perfil
- `profile_edit` - Edición de perfil

### Administración
- `content_moderate` - Acciones de moderación

## Configuración Avanzada

### Goals y Conversiones
En Google Analytics, configura estos goals:
1. **Registro de usuarios** - Event: `register`
2. **Participación en eventos** - Event: `event_register`
3. **Unión a comunidades** - Event: `community_join`
4. **Engagement con contenido** - Event: `announcement_reaction`

### Audiencias
Crea audiencias para:
- Estudiantes activos (usuarios que han reaccionado a contenido)
- Organizadores de eventos (usuarios que crean eventos)
- Miembros de comunidades (usuarios en múltiples comunidades)

### Reportes Personalizados
1. **Engagement por tipo de contenido**
2. **Popularidad de eventos por categoría**
3. **Crecimiento de comunidades**
4. **Flujo de usuarios nuevos**

## Privacidad y GDPR

### Datos recopilados
- Páginas visitadas
- Eventos de interacción
- Información demográfica básica (sin PII)
- Dispositivo y navegador

### Configuración de privacidad
El sistema está configurado para:
- No recopilar información personal identificable
- Respetar las preferencias de cookies
- Cumplir con regulaciones de privacidad

### Para cumplir con GDPR
1. Añadir banner de cookies (pendiente)
2. Configurar consentimiento de analytics
3. Permitir opt-out de tracking

## Monitoreo y Alertas

### Métricas clave a monitorear
- Usuarios activos diarios/mensuales
- Tiempo en página de anuncios
- Tasa de participación en eventos
- Crecimiento de comunidades
- Tasa de rebote por página

### Alertas recomendadas
- Caída súbita en usuarios activos
- Errores 404 frecuentes
- Tiempo de carga excesivo
- Picos inusuales de tráfico

## Desarrollo

### Testing en desarrollo
- Analytics está deshabilitado por defecto en desarrollo
- Para testear, cambiar `NEXT_PUBLIC_ENABLE_ANALYTICS=true`
- Usar el ID de testing de GA4

### Debugging
Para debuggear eventos en la consola del navegador:
```javascript
// Ver eventos enviados
window.gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: true
});
```

## Próximos pasos
1. [ ] Configurar cuenta real de Google Analytics
2. [ ] Implementar banner de cookies
3. [ ] Configurar reportes automatizados
4. [ ] Crear dashboard personalizado
5. [ ] Configurar alertas de performance
