2. Descripción General del Sistema

El sistema **Fciencias** es una plataforma web que busca **centralizar y simplificar la comunicación y organización de la comunidad de la Facultad de Ciencias**. Está diseñada como un **MVP escalable**, con una arquitectura modular y desacoplada que facilite futuras integraciones (p. ej., apps móviles, LMS, sistemas institucionales).

En esta sección se presentan los **objetivos del sistema**, la **visión arquitectónica general**, los **módulos principales** y las **restricciones actuales** del MVP.


---


## **2.1. Objetivos del sistema**


### **Objetivo general**

Proveer a estudiantes, docentes y personal académico/administrativo de la Facultad de Ciencias una **plataforma digital unificada** para la difusión de anuncios, gestión de eventos, directorio de comunidades y comunicación básica, en un entorno seguro, accesible y escalable.


### **Objetivos específicos**



* **Unificación de canales de comunicación**: centralizar noticias, eventos y avisos institucionales en un solo espacio confiable. \

* **Facilitar la participación comunitaria**: habilitar la creación y visibilización de grupos estudiantiles y comunidades académicas. \

* **Garantizar accesibilidad y usabilidad**: ofrecer un diseño inclusivo y compatible con dispositivos móviles. \

* **Seguridad y confianza**: proteger la información de usuarios mediante autenticación, roles y medidas de seguridad modernas. \

* **Escalabilidad y extensibilidad**: diseñar el MVP con bases sólidas que permitan integrar nuevas funcionalidades (ej. integración con el sistema escolar, mensajería avanzada, apps móviles nativas). \

* **Soporte a la toma de decisiones**: recolectar métricas de uso y participación para retroalimentar a coordinadores y administradores de la facultad. \



---


## **2.2. Arquitectura general (visión de alto nivel)**

La arquitectura del sistema está concebida bajo un **modelo cliente-servidor** con separación clara de responsabilidades:



* **Frontend (Cliente web) \
**
    * Aplicación SPA (Single Page Application) construida con framework moderno (ej. React/Next.js). \

    * Interacción con backend vía **API REST** autenticada. \

    * UI adaptativa (**Responsive Web Design**). \

    * Manejo de sesiones con tokens (JWT). \

* **Backend (Servidor de aplicación) \
**
    * API RESTful para exposición de recursos (anuncios, eventos, usuarios, comunidades). \

    * Gestión de autenticación, autorización (RBAC), validación y lógica de negocio. \

    * Servicios modulares desacoplados (contenido, usuarios, notificaciones, moderación). \

    * Logging y métricas instrumentadas. \

* **Base de Datos (Persistencia) \
**
    * Motor relacional (ej. PostgreSQL) por consistencia y soporte de relaciones. \

    * Estructura normalizada para usuarios, roles, anuncios, eventos, comunidades y reportes. \

    * Soporte de índices para búsquedas y filtros básicos. \

* **Servicios externos / Infraestructura \
**
    * **Correo transaccional**: envío de notificaciones (reset de contraseña, confirmaciones, avisos). \

    * **Almacenamiento de archivos**: repositorio externo tipo objeto (ej. S3 compatible) para imágenes/documentos. \

    * **CDN opcional**: para contenido estático (imágenes, assets). \

    * **CI/CD**: pipeline para automatizar despliegue y pruebas.




### **Diagrama conceptual (alto nivel)**


## **2.3. Principales módulos y funcionalidades**

El sistema se organiza en módulos que cubren las necesidades prioritarias del MVP:



1. **Módulo de Usuarios y Autenticación \
**
    * Registro con correo institucional/permitido. \

    * Inicio de sesión con autenticación segura (JWT). \

    * Roles y permisos (RBAC). \

    * Recuperación de contraseña. \

2. **Módulo de Contenido (Anuncios/Noticias) \
**
    * Creación, edición y publicación de anuncios. \

    * Gestión de borradores y publicaciones programadas. \

    * Comentarios, reacciones y reportes de contenido. \

    * Moderación (ocultar/bloquear contenido). \

3. **Módulo de Eventos \
**
    * Creación y edición de eventos. \

    * Registro de participantes (opcional). \

    * Recordatorios por correo y notificaciones. \

    * Exportación básica de calendario (ICS). \

4. **Módulo de Comunidades/Directorio \
**
    * Listado de grupos estudiantiles, semilleros, colectivos. \

    * Solicitudes de alta de comunidad con flujo de aprobación. \

    * Información básica: responsables, canales de contacto. \

5. **Módulo de Búsqueda \
**
    * Búsqueda de anuncios, eventos y comunidades. \

    * Filtros por fecha, relevancia, categoría. \

6. **Módulo de Notificaciones \
**
    * Notificaciones en la aplicación (web). \

    * Envío de correos automáticos para avisos relevantes. \

7. **Módulo de Administración/Moderación \
**
    * Panel para administradores y moderadores. \

    * Gestión de usuarios y roles. \

    * Revisión de reportes y métricas de actividad. \



---


## **2.4. Restricciones y limitaciones actuales del MVP**

Aunque la plataforma está pensada para crecer, el MVP tiene **alcances acotados** para garantizar un despliegue rápido y estable:



* **Escalabilidad limitada:** el MVP soportará una carga inicial de hasta ~5,000 usuarios activos mensuales, con recursos cloud básicos. \

* **Disponibilidad:** objetivo de **99.5% en horario hábil**, pero sin redundancia geográfica avanzada en la primera fase. \

* **Integración con sistemas institucionales:** no incluye aún integración completa con **SSO/LDAP** institucional; se usará autenticación propia con opción de migración futura. \

* **Mensajería interna:** no se incluye chat/mensajería privada en tiempo real (fuera del MVP). \

* **Soporte móvil:** accesible vía navegador móvil (RWD), pero no habrá apps nativas en la primera fase. \

* **Analítica básica:** métricas de uso limitadas a logs y estadísticas simples (sin dashboards avanzados). \

* **Soporte 24/7:** administración y soporte técnico bajo disponibilidad limitada (horarios laborales). \

* **Accesibilidad:** cumplimiento inicial con pautas WCAG, pero sin auditoría completa certificada. \

* **Idioma único:** interfaz en **es-MX**, sin soporte multilenguaje en la primera versión.