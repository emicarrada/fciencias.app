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

### Semana 9: Feed Principal y Anuncios

- **Días 1-3:** Implementación del feed con filtros
- **Días 4-5:** Vista detallada de anuncios y eventos

### Semana 10: Comunidades y Accesibilidad

- **Días 1-3:** Implementación del directorio de comunidades
- **Días 4-5:** Mejoras de accesibilidad (WCAG 2.1 AA)

## Fase 4: Integración y Pruebas (3 semanas)

### Semana 11: Integración Frontend-Backend

- **Días 1-3:** Conexión de todos los módulos con la API
- **Días 4-5:** Manejo de estados y respuestas de error

### Semana 12: Pruebas y Optimización

- **Días 1-2:** Pruebas unitarias y de integración
- **Días 3-4:** Pruebas E2E de flujos críticos
- **Día 5:** Optimización de rendimiento y accesibilidad

### Semana 13: Revisión de Seguridad

- **Días 1-3:** Auditoría de seguridad (OWASP Top 10)
- **Días 4-5:** Correcciones de vulnerabilidades identificadas

## Fase 5: Despliegue y Beta Cerrada (2 semanas)

### Semana 14: Preparación para Producción

- **Días 1-2:** Configuración de entorno de producción
- **Días 3-4:** Implementación de CI/CD
- **Día 5:** Configuración de monitoreo y logs

### Semana 15: Lanzamiento Beta

- **Días 1-2:** Despliegue en entorno de producción
- **Días 3-4:** Pruebas con grupo piloto (estudiantes seleccionados)
- **Día 5:** Recolección de retroalimentación inicial

## Fase 6: Iteración y Mejora (Continua)

### Semanas 16-18: Primera Iteración Post-MVP

- Análisis de métricas y feedback de usuarios
- Correcciones prioritarias
- Implementación de mejoras basadas en retroalimentación

## Equipos de Trabajo

Para dividir el trabajo eficientemente, se establecen los siguientes equipos:

1. **Equipo Backend:**  
   - Desarrolladores enfocados en API, base de datos y lógica de negocio
   - Responsables de implementar endpoints y servicios
   - Gestión de autenticación y seguridad

2. **Equipo Frontend:**  
   - Desarrolladores enfocados en la UI/UX y experiencia de usuario
   - Implementación de componentes y flujos de usuario
   - Integración con API y manejo de estados

3. **Equipo DevOps:**  
   - Infraestructura, CI/CD, monitoreo y seguridad
   - Configuración de entornos de desarrollo y producción
   - Automatización de despliegues

4. **Equipo QA:**  
   - Pruebas y aseguramiento de calidad
   - Definición de casos de prueba
   - Validación de requisitos funcionales y no funcionales

## Dependencias Críticas

- Validación de correos institucionales (@ciencias.unam.mx)
- Integración con sistemas de almacenamiento para imágenes/archivos
- Configuración de servidor SMTP para notificaciones
- Adquisición de dominio y configuración de DNS
- Servidor o servicio de hosting para despliegue

## Puntos de Control y Hitos

1. **Semana 2:** Arquitectura completa aprobada
2. **Semana 6:** Backend MVP funcional
3. **Semana 10:** Frontend MVP integrado
4. **Semana 13:** Producto probado y seguro
5. **Semana 15:** Lanzamiento beta a grupo piloto

## Consideraciones de Riesgo

- **Validación de acceso institucional:**
  - Riesgo: Dificultades en la integración con correos institucionales
  - Mitigación: Pruebas tempranas de verificación de dominio

- **Rendimiento del sistema con carga real:**
  - Riesgo: Degradación de rendimiento bajo carga de usuarios concurrentes
  - Mitigación: Pruebas de carga previas al lanzamiento beta

- **Adopción inicial por parte de la comunidad:**
  - Riesgo: Baja participación en fase beta
  - Mitigación: Campaña de comunicación y grupo piloto comprometido

## Métricas de Éxito

- **Técnicas:**
  - Tiempo de respuesta promedio < 300ms
  - Disponibilidad > 99.5%
  - Cobertura de pruebas > 80% (backend) y > 70% (frontend)

- **De producto:**
  - Registro de al menos 200 usuarios en fase beta
  - Tasa de retención del 60% tras 2 semanas
  - NPS > 40 entre usuarios beta

## Estrategia de Comunicación

- Actualizaciones semanales al equipo completo
- Revisiones de sprint cada 2 semanas
- Demostración a stakeholders clave al final de cada fase principal
- Reporte semanal de progreso vs. cronograma
- Canal dedicado para retroalimentación de usuarios beta

## Equipos de Trabajo

Para dividir el trabajo eficientemente, se establecen los siguientes equipos:

1. **Equipo Backend:** Desarrolladores enfocados en API, base de datos y lógica de negocio
2. **Equipo Frontend:** Desarrolladores enfocados en la UI/UX y experiencia de usuario
3. **Equipo DevOps:** Infraestructura, CI/CD, monitoreo y seguridad
4. **Equipo QA:** Pruebas y aseguramiento de calidad

## Dependencias Críticas

- Validación de correos institucionales (@ciencias.unam.mx)
- Integración con sistemas de almacenamiento para imágenes/archivos
- Configuración de servidor SMTP para notificaciones

## Puntos de Control y Hitos

1. **Semana 2:** Arquitectura completa aprobada
2. **Semana 6:** Backend MVP funcional
3. **Semana 10:** Frontend MVP integrado
4. **Semana 13:** Producto probado y seguro
5. **Semana 15:** Lanzamiento beta a grupo piloto

## Consideraciones de Riesgo

- Validación de acceso institucional
- Rendimiento del sistema con carga real
- Adopción inicial por parte de la comunidad

## Métricas de Éxito

- **Técnicas:**
  - Tiempo de respuesta promedio < 300ms
  - Disponibilidad > 99.5%
  - Cobertura de pruebas > 80% (backend) y > 70% (frontend)

- **De producto:**
  - Registro de al menos 200 usuarios en fase beta
  - Tasa de retención del 60% tras 2 semanas
  - NPS > 40 entre usuarios beta

## Estrategia de Comunicación

- Actualizaciones semanales al equipo completo
- Revisiones de sprint cada 2 semanas
- Demostración a stakeholders clave al final de cada fase principal
