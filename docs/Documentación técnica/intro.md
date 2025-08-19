

1. Introducción

El proyecto **Fciencias** es una plataforma web orientada a la comunidad de la Facultad de Ciencias, diseñada para centralizar comunicación, anuncios, eventos, directorio de grupos/comunidades y herramientas básicas de colaboración. El MVP prioriza un stack moderno, escalable y seguro, con API abierta para futuras apps móviles y extensiones.

La presente sección define el propósito del documento, el alcance del sistema, su audiencia y un glosario de términos y siglas que se utilizarán a lo largo de la documentación.


---


## **1.1. Propósito del documento**



* **Fuente única de verdad (SSOT):** servir como referencia oficial para el diseño, desarrollo, pruebas, despliegue, operación y evolución del sistema.
* **Alineación del equipo:** asegurar que desarrolladores, DevOps, QA, UX y administradores compartan el mismo entendimiento de objetivos, restricciones y decisiones de arquitectura.
* **Base para auditorías y seguridad:** documentar supuestos, controles, cumplimiento normativo y riesgos conocidos.
* **Onboarding acelerado:** reducir el tiempo de incorporación de nuevos miembros del equipo con una guía completa y actualizada.
* **Trazabilidad técnica:** relacionar requisitos con componentes, endpoints, casos de prueba y métricas operativas.
* **Vinculación con roadmap:** establecer el estado actual del MVP y los límites entre lo implementado y lo planificado. \


    **Criterios de calidad del documento:** versionado en el repositorio, cambios revisados vía PR, enlaces vivos a diagramas/colecciones de API, y actualización obligatoria en cada release.


---


## 
    **1.2. Alcance del sistema**


### 
    **1.2.1. Alcance funcional (IN)**

* **Gestión de cuentas y acceso \
**
    * Registro/autenticación (correo institucional o cuenta permitida), recuperación de contraseña. \

    * Sesiones seguras (p. ej., JWT) y soporte para 2FA opcional. \

    * **Roles y permisos (RBAC):** estudiante, docente, administrativo, moderador, administrador de sistema, invitado. \

* **Contenido y comunicación \
**
    * **Anuncios/Noticias:** creación, edición, publicación programada, borradores, estados. \

    * **Comentarios y reacciones** (con moderación y reportes). \

    * **Notificaciones** (correo y/o push web) por nuevos anuncios, cambios de evento y respuestas. \

* **Eventos \
**
    * Alta/edición de eventos con aforo/registro, calendario y recordatorios. \

    * Exportación/consumo vía iCal/ICS (cuando aplique). \

* **Directorio y comunidades \
**
    * Listado de grupos/semilleros/comunidades con descripciones, responsables y canales de contacto. \

    * Solicitudes de alta y flujo de aprobación. \

* **Búsqueda \
**
    * Búsqueda de texto en anuncios, eventos y comunidades con filtros básicos. \

* **Moderación y reportes \
**
    * Panel para revisión de reportes de contenido y acciones de moderación (ocultar, bloquear, advertir). \

* **API \
**
    * **API REST** documentada para consumo interno y futuras apps móviles (lectura de contenido público, endpoints autenticados bajo RBAC). \


### 
    **1.2.2. Requisitos no funcionales**

* **Seguridad:** protección contra OWASP Top 10 (XSS, CSRF, SQLi, etc.), cifrado en tránsito (HTTPS/TLS), manejo seguro de secretos, registros de auditoría. \

* **Privacidad y cumplimiento:** tratamiento de datos personales conforme a **LFPDPPP** (México) y lineamientos institucionales; minimización de datos; políticas de retención/borrado. \

* **Disponibilidad y rendimiento:** objetivo inicial ≥ 99.5% en horario hábil; **P95** de respuesta para vistas clave &lt; 500 ms bajo carga esperada del MVP. \

* **Escalabilidad:** diseño que permita escalar horizontalmente servicios de lectura y caché de contenido. \

* **Observabilidad:** métricas, logs estructurados y trazas distribuidas; alertas sobre SLOs. \

* **Accesibilidad:** cumplimiento **WCAG 2.1 AA** en vistas públicas; soporte de teclado y lectores de pantalla. \

* **Compatibilidad:** navegadores modernos con soporte de ES2020+; **RWD** para móviles y escritorio. \

* **Internacionalización:** interfaz base en **es-MX** con capacidad de localización futura. \


### 
    **1.2.3. Fuera de alcance (OUT) del MVP**

* **Control escolar**: inscripción, calificaciones, constancias, historiales. \

* **Pagos y facturación**. \

* **LMS completo**: cursos, tareas y calificación (puede integrarse con plataformas externas). \

* **Soporte 24/7** y mesa de ayuda en tiempo real. \

* **Integraciones complejas con SSO institucional** si no están disponibles en el corto plazo (se considerarán en roadmap). \


### 
    **1.2.4. Supuestos y dependencias**

* **Infraestructura en la nube** (p. ej., IaaS/PaaS) con pipeline **CI/CD**. \

* **Correo transaccional** mediante proveedor externo o servicio institucional. \

* **Almacenamiento de archivos** en objeto (p. ej., S3-compatible) con CDN opcional. \

* **Gestor de identidades** institucional (LDAP/SSO) **si** está disponible; de lo contrario, autenticación local con futura migración. \

* **Cumplimiento legal** revisado por instancia institucional competente. \


---


## 
    **1.3. Audiencia objetivo**

* **Desarrolladores Frontend:** componentes, patrones de estado, estándares de accesibilidad, contratos de API. \

* **Desarrolladores Backend:** arquitectura de servicios, modelos de dominio, endpoints, seguridad, persistencia y colas. \

* **DevOps / Plataforma:** Iac, CI/CD, observabilidad, secretos, escalamiento y políticas de backup/restore. \

* **QA/Testing:** criterios de aceptación, matrices de prueba, datos semilla y cobertura mínima esperada. \

* **UX/UI:** guías de diseño, tokens de diseño, lineamientos de contenido y accesibilidad. \

* **Administradores del sistema / Moderadores:** gestión de roles, ciclos de publicación, moderación y reportes. \

* **Seguridad / Cumplimiento:** controles, flujos de aprobación, política de datos personales y bitácoras. \

* **Stakeholders (académicos/administrativos):** objetivos del MVP, límites del alcance, métricas de éxito y roadmap. \


    Cada perfil encontrará en el documento referencias cruzadas a secciones específicas (API, infraestructura, seguridad, pruebas) y anexos con diagramas.


---


## 
    **1.4. Definiciones, acrónimos y abreviaturas**

* **API (Application Programming Interface):** interfaz para exponer y consumir funcionalidades de forma programática. \

* **REST:** estilo arquitectónico para APIs usando HTTP y recursos. \

* **Endpoint:** URL y método HTTP que expone una operación de la API. \

* **JWT (JSON Web Token):** token firmado para autenticación/autorización. \

* **RBAC (Role-Based Access Control):** control de acceso basado en roles. \

* **SSO (Single Sign-On):** inicio de sesión único a través de un proveedor de identidad. \

* **LDAP:** protocolo para directorios de usuarios; común en SSO institucional. \

* **MVP (Minimum Viable Product):** versión mínima utilizable para validar hipótesis y generar aprendizaje. \

* **SLA / SLO / SLI:** acuerdo/objetivo/indicador de nivel de servicio. \

* **P95 / P99:** percentiles de latencia (95%/99% de solicitudes por debajo de un umbral). \

* **CI/CD (Continuous Integration/Continuous Delivery):** prácticas de integración y entrega/despliegue continuo. \

* **IaC (Infrastructure as Code):** definición de infraestructura mediante código versionado. \

* **Observabilidad:** capacidad de entender el estado del sistema mediante **logs**, **métricas** y **trazas**. \

* **WCAG 2.1 AA:** estándar de accesibilidad web de nivel AA. \

* **OWASP Top 10:** principales riesgos de seguridad en aplicaciones web. \

* **CSRF / XSS / SQLi:** ataques comunes (solicitudes cruzadas, scripts cruzados, inyección SQL). \

* **CORS (Cross-Origin Resource Sharing):** política de acceso entre orígenes en navegadores. \

* **CSP (Content Security Policy):** cabecera de seguridad para restringir recursos ejecutables. \

* **PII / Datos personales:** información que identifica a una persona; su tratamiento exige salvaguardas. \

* **LFPDPPP:** Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México). \

* **RPO / RTO:** punto y tiempo objetivo de recuperación ante desastres. \

* **MTTD / MTTR:** tiempo medio de detección y de recuperación de incidentes. \

* **UAT (User Acceptance Testing):** pruebas de aceptación por usuarios clave. \

* **Staging / Producción:** entornos previos y finales de despliegue. \

* **Blue/Green / Canary:** estrategias de despliegue para reducir riesgo. \

* **CDN (Content Delivery Network):** red de entrega de contenido estático. \

* **Idempotencia:** propiedad por la que ejecutar una operación varias veces produce el mismo estado. \

* **Rate limiting:** limitación del número de solicitudes por cliente para proteger recursos. \

* **Feature flag:** interruptor para activar/desactivar funcionalidades en tiempo de ejecución. \

* **RWD (Responsive Web Design):** diseño adaptable a diferentes tamaños de pantalla.