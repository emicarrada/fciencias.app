

### 9. Seguridad

La seguridad en la plataforma *Fciencias* es un componente crítico, ya que se manejan datos sensibles de estudiantes, profesores y personal académico. Esta sección documenta las prácticas, herramientas y protocolos implementados para garantizar **confidencialidad, integridad y disponibilidad** del sistema.


---


## **9.1. Autenticación y autorización**



* **Autenticación \
**
    * Basada en **JSON Web Tokens (JWT)** firmados con clave privada/clave pública (RSA o HMAC). \

    * Soporte para **sesiones persistentes** con refresh tokens de corta vida. \

    * Posibilidad futura de integración con **OAuth 2.0 / OpenID Connect** (Google UNAM, GitHub, etc.). \

    * Multi-factor authentication (MFA) previsto en roadmap (app de autenticación o correo). \

* **Autorización \
**
    * Basada en **roles (RBAC)**: \

        * **Estudiante**: acceso limitado a cursos, grupos, eventos. \

        * **Profesor**: gestión de contenidos, grupos y actividades. \

        * **Administrador**: gestión global del sistema. \

    * Políticas de **control de acceso basado en atributos (ABAC)** en módulos críticos (ejemplo: visibilidad de datos solo dentro de la facultad correspondiente). \

    * Middleware en el backend valida permisos antes de procesar la solicitud. \



---


## **9.2. Gestión de contraseñas y datos sensibles**



* **Contraseñas \
**
    * Almacenadas con **hashing Argon2id** (o bcrypt como fallback). \

    * Uso de *salts* únicas por usuario. \

    * Políticas de complejidad: longitud mínima 8 caracteres, combinación de mayúsculas, minúsculas, dígitos y símbolos. \

    * Bloqueo temporal tras múltiples intentos fallidos (prevención de fuerza bruta). \

* **Datos sensibles \
**
    * Información personal (nombre, matrícula, correo) almacenada en **PostgreSQL** en tablas con acceso restringido. \

    * Campos críticos cifrados con **AES-256-GCM** en reposo. \

    * En tránsito, todo tráfico cifrado vía **TLS 1.3**. \

    * Variables secretas gestionadas en **vault seguro** (ej: HashiCorp Vault o secretos de Kubernetes). \



---


## **9.3. Prevención de ataques comunes**



* **XSS (Cross-Site Scripting) \
**
    * Escape de salida en el frontend (React/Next.js maneja sanitización por defecto). \

    * Sanitización de entradas con librerías (DOMPurify en formularios). \

* **CSRF (Cross-Site Request Forgery) \
**
    * Uso de tokens CSRF en formularios sensibles. \

    * JWT transmitidos únicamente vía **Authorization Header** y no cookies sin protección. \

* **SQLi (SQL Injection) \
**
    * ORM seguro (Prisma/TypeORM) con consultas parametrizadas. \

    * Validación estricta de inputs en backend (DTOs con class-validator). \

* **Otros ataques \
**
    * **Rate limiting** y **IP throttling** en endpoints sensibles. \

    * **Helmet middleware** para cabeceras HTTP seguras. \

    * Logs de seguridad centralizados para detección de anomalías (SIEM). \



---


## **9.4. Cumplimiento normativo (protección de datos de estudiantes)**



* **Protección de datos personales (LFPDPPP, México) \
**
    * Consentimiento explícito al registrar cuenta. \

    * Política de privacidad publicada y accesible en todo momento. \

    * Derecho de acceso, rectificación, cancelación y oposición (ARCO). \

* **Buenas prácticas GDPR (adaptadas a contexto UNAM) \
**
    * Minimización de datos: solo se almacena lo estrictamente necesario. \

    * Posibilidad de anonimizar datos en reportes estadísticos. \

    * Borrado seguro de cuentas y datos personales bajo solicitud. \

* **Seguridad operacional \
**
    * Auditorías periódicas de seguridad (internas y externas). \

    * Pruebas de penetración en cada versión mayor. \

    * Cumplimiento de estándares **OWASP Top 10**. \
