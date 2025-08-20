# Cronograma MVP - fciencias.app

## Fase 1: Preparación y Planificación (2 semanas)

### Semana 1: Configuración del Entorno

- **Días 1-2:** Configuración del repositorio y estructura base del proyecto
- **Días 3-4:** Configuración del entorno de desarrollo (Docker, PostgreSQL, etc.)
- **Día 5:** Definición de estándares de código y documentación

### Semana 2: Diseño y Arquitectura

- **Días 1-2:** Diseño de la base de datos (esquemas, relaciones)
- **Días 3-4:** Diseño de API REST y endpoints principales
- **Día 5:** Maquetación inicial de UI y componentes clave

## Fase 2: Desarrollo del Backend (4 semanas)

### Semana 3: Autenticación y Usuarios

- **Días 1-2:** Implementación del modelo de usuarios y roles
- **Días 3-4:** Sistema de autenticación con JWT
- **Día 5:** Pruebas unitarias de autenticación

### Semana 4: Módulo de Anuncios y Contenido

- **Días 1-2:** CRUD de anuncios/publicaciones
- **Días 3-4:** Categorización y filtrado de contenido
- **Día 5:** Implementación de interacciones básicas (likes)

### Semana 5: Módulo de Eventos

- **Días 1-3:** Implementación del sistema de eventos
- **Días 4-5:** Calendario básico y notificaciones relacionadas

### Semana 6: Módulo de Comunidades

- **Días 1-3:** Directorio de grupos/comunidades
- **Días 4-5:** Sistema de suscripción a comunidades

## Fase 3: Desarrollo del Frontend (4 semanas)

### Semana 7: Componentes Base y Routing

- **Días 1-2:** Configuración de Next.js y estructura base
- **Días 3-5:** Implementación de componentes comunes y layout

### Semana 8: Autenticación y Perfil

- **Días 1-3:** Páginas de registro/login con validación institucional
- **Días 4-5:** Perfil de usuario básico

### Semana 9: Feed de Anuncios y Dashboard

- **Días 1-2:** Dashboard principal con navegación
- **Días 3-5:** Feed de anuncios con filtros y categorías

### Semana 10: Eventos y Comunidades Frontend

- **Días 1-2:** Páginas de eventos con calendario
- **Días 3-4:** Directorio de comunidades
- **Día 5:** Integración con backend y pruebas

## Fase 4: Integración y Pruebas (2 semanas)

### Semana 11: Integración completa

- **Días 1-2:** Conexión completa frontend-backend
- **Días 3-4:** Pruebas de integración
- **Día 5:** Corrección de bugs críticos

### Semana 12: Preparación para producción

- **Días 1-2:** Optimización de rendimiento
- **Días 3-4:** Configuración de despliegue
- **Día 5:** Documentación final y entrega MVP

## Entregables MVP

### Funcionalidades Core
- [x] Sistema de autenticación institucional
- [ ] CRUD de anuncios con categorías
- [ ] Sistema básico de eventos
- [ ] Directorio de comunidades
- [ ] Perfiles de usuario
- [ ] Feed principal personalizado

### Criterios de Aceptación
- [ ] Registro/login con email @ciencias.unam.mx
- [ ] Crear, ver y filtrar anuncios
- [ ] Ver calendario de eventos
- [ ] Explorar comunidades académicas
- [ ] Interfaz responsive y accesible
- [ ] API documentada con Swagger

## Estado Actual (19 Agosto 2025)

### ✅ Completado
- Configuración de entorno y base de datos
- Modelo de datos completo (Prisma)
- Sistema de autenticación JWT
- Endpoints de auth funcionando
- Estructura base del frontend

### 🔄 En Progreso
- Corrección de guards de autenticación
- Implementación de módulos backend

### ❌ Pendiente
- Módulo de anuncios (backend)
- Módulo de eventos (backend)  
- Módulo de comunidades (backend)
- Páginas de auth (frontend)
- Dashboard y feed (frontend)
- Integración frontend-backend
