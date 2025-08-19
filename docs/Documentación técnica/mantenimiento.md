
### 11. Mantenimiento y Operación

El mantenimiento y operación del sistema *Fciencias* busca garantizar la disponibilidad, confiabilidad y escalabilidad de la plataforma en producción. Esta sección describe los procesos y buenas prácticas que deben seguir desarrolladores, administradores de sistemas y el equipo de soporte técnico.


---


## **11.1. Guía de instalación y despliegue**

**Requisitos previos:**



* **Servidor**: Ubuntu 22.04 LTS o superior. \

* **Dependencias**: Node.js LTS (18+), Docker y Docker Compose, PostgreSQL 14+, Redis. \

* **Entorno de red**: acceso HTTPS con certificado TLS válido (ej. Let’s Encrypt). \


**Pasos de instalación (modo manual):**



1. Clonar el repositorio desde GitHub. \

2. Instalar dependencias con `npm install` (frontend y backend). \

3. Configurar variables de entorno (`.env`): \

    * Credenciales de BD (PostgreSQL). \

    * Llaves secretas para JWT. \

    * Configuración de correo (SMTP o API). \

    * Configuración de almacenamiento (S3/MinIO). \

4. Ejecutar migraciones de la base de datos. \

5. Construir imágenes Docker (`docker compose build`). \

6. Levantar el sistema con `docker compose up -d`. \


**Despliegue automatizado (CI/CD):**



* Uso de **GitHub Actions** o **GitLab CI**. \

* Pipeline: \

    1. Pruebas automáticas. \

    2. Construcción de contenedores Docker. \

    3. Publicación en registro privado. \

    4. Despliegue a entorno staging/producción vía **Ansible/Kubernetes**. \



---


## **11.2. Monitorización y logging**



* **Monitorización \
**
    * **Prometheus + Grafana**: métricas de rendimiento (CPU, memoria, latencia de API). \

    * **Alertmanager**: notificaciones ante fallos críticos (correo, Slack, Telegram). \

    * **UptimeRobot** o similar: chequeo de disponibilidad externa. \

* **Logging \
**
    * **Winston + ELK Stack (Elasticsearch, Logstash, Kibana)**: centralización de logs de backend. \

    * **Frontend**: captura de errores con **Sentry**. \

    * Niveles de logs: `info`, `warn`, `error`, `debug`. \

    * Retención: 90 días para producción. \



---


## **11.3. Procedimientos de actualización**



* **Actualizaciones menores (parches de seguridad, hotfixes): \
**
    * Deploy directo con *rolling updates* en contenedores Docker. \

    * Sin tiempo de inactividad (zero-downtime deploy). \

* **Actualizaciones mayores (nuevas versiones): \
**
    * Implementación en entorno de staging → validación QA → despliegue a producción. \

    * Migraciones de base de datos controladas con rollback plan. \

    * Notificación previa a los usuarios en caso de posibles interrupciones. \

* **Política de versionado: \
**
    * **SemVer (X.Y.Z)** → *X*: cambios incompatibles, *Y*: nuevas funcionalidades, *Z*: parches. \



---


## **11.4. Resolución de incidencias comunes**



* **Problema: el usuario no puede iniciar sesión \
**
    * Verificar estado del servicio de autenticación. \

    * Revisar logs de errores en el backend. \

    * Confirmar integridad de la BD y tokens JWT. \

* **Problema: API lenta o caída \
**
    * Consultar métricas en Grafana (CPU, memoria, tráfico). \

    * Escalar réplicas del backend vía Kubernetes/Docker Swarm. \

    * Revisar consultas SQL para identificar *bottlenecks*. \

* **Problema: error en envío de correos \
**
    * Validar configuración SMTP/API. \

    * Revisar límites de envío en el proveedor externo. \

    * Reintentar con cola de mensajes (Redis + BullMQ). \

* **Problema: archivos no se cargan/descargan \
**
    * Confirmar conexión al servicio S3/MinIO. \

    * Revisar permisos de acceso del bucket. \

    * Probar con credenciales actualizadas.