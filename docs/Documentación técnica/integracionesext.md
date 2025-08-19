
### 8. Integraciones Externas


## **8.1. Servicios de terceros (APIs, librerías, módulos externos)**

El sistema depende de servicios externos cuidadosamente seleccionados para **evitar reinventar la rueda**, **reducir costos de mantenimiento** y **garantizar calidad**. Se clasifican en:


### **a) Autenticación y Seguridad**



* **JWT (jsonwebtoken)**: manejo de tokens de acceso y refresco. \

* **bcrypt / argon2**: hashing de contraseñas. \

* **Helmet (Express middleware)**: cabeceras de seguridad. \



### **b) Base de Datos y ORM**



* **PostgreSQL 16** como motor transaccional. \

* **Prisma ORM**: generación de esquemas, migraciones y tipado estático. \

* **pgBouncer**: pooling de conexiones (producción). \



### **c) Frontend**



* **Next.js 14 (App Router, SSR/ISR)**. \

* **TailwindCSS** + **Shadcn/UI** para componentes accesibles. \

* **React Query (TanStack Query)** para cacheo y fetching eficiente. \

* **Zod** para validación de datos compartida front/back. \



### **d) Almacenamiento y Archivos**



* **MinIO (dev/staging) / AWS S3 (prod)**. \

* **Presigned URLs** para subida/descarga de archivos. \

* **Sharp**: manipulación de imágenes (optimización, resize). \



### **e) Correo**



* **Mailhog** en dev/staging. \

* **SendGrid / Mailgun** en producción (SMTP + API). \

* Plantillas en **MJML/Handlebars**. \



### **f) Observabilidad**



* **Winston / Pino** para logging estructurado. \

* **Prometheus + Grafana** (métricas). \

* **OpenTelemetry SDK** (tracing distribuido). \



### **g) Otros módulos clave**



* **Axios** (HTTP client con interceptores de errores). \

* **BullMQ** (Node + Redis, para tareas en background, roadmap). \

* **jsonwebtoken, cookie-parser, express-rate-limit** para autenticación y control de acceso. \


**Riesgo asociado:** dependencia de proveedores externos → mitigación mediante **abstracción en adaptadores** (patrón *ports and adapters*).


---


## **8.2. Mecanismos de comunicación (webhooks, sockets, etc.)**


### **a) Webhooks**



* Se utilizan para **eventos de integración con terceros**. \

* Ejemplos de eventos emitidos: \

    * `user.registered` → notificación a mailing service. \

    * `announcement.published` → integración con sistemas externos (p.ej. redes sociales). \

* Seguridad: \

    * **Firma HMAC-SHA256** de payloads. \

    * **Replay protection** con timestamps + nonce. \

* Configuración por administrador en UI (endpoint destino, retries). \


**Ejemplo payload webhook:**


```
{
  "id": "evt_7d921",
  "type": "announcement.published",
  "created_at": "2025-08-16T22:00:00Z",
  "data": {
    "id": "ann_123",
    "title": "Nueva convocatoria",
    "url": "https://app.fciencias.mx/announcements/ann_123"
  },
  "signature": "sha256=93ae93f9c..."
}
```



### **b) WebSockets**



* Se contempla para funcionalidades **en tiempo real**: \

    * Notificaciones push a estudiantes. \

    * Estado de colas de eventos o tareas en background. \

* Tecnologías: **Socket.IO** o **NestJS Gateway** sobre WS. \

* Escalabilidad: \

    * Redis Pub/Sub como *message broker* en despliegues multi-réplica. \



### **c) Colas/Mensajería**



* **BullMQ + Redis** (futuro roadmap): \

    * Manejo de trabajos diferidos (envíos masivos de correo, generación de reportes). \

    * Retries automáticos, DLQ (dead-letter queue). \

* Alternativa enterprise: **RabbitMQ** o **Kafka** (si el tráfico crece). \



---


## **8.3. Dependencias críticas**


### **Base de datos (PostgreSQL)**



* Core del sistema: cualquier indisponibilidad → sistema no funcional. \

* Mitigación: \

    * Alta disponibilidad (multi-AZ o cluster). \

    * Backups + Point-in-Time Recovery (§6.4). \

    * Read-replicas para separar carga. \



### **Almacenamiento (S3/MinIO)**



* Crítico para manejo de archivos y material compartido. \

* Mitigación: \

    * Replicación regional. \

    * Versionado de objetos. \

    * Límites de cuota y políticas de ciclo de vida (auto-expiración). \



### **Correo transaccional (SendGrid/Mailgun)**



* Necesario para registro, recuperación de contraseñas y notificaciones. \

* Mitigación: \

    * SMTP fallback. \

    * Logs de correos no entregados. \

    * Retries automáticos (con colas). \



### **Autenticación y seguridad**



* Dependencia de hashing seguro (bcrypt/argon2). \

* Mitigación: actualizar librerías, rotar secrets periódicamente. \



### **CDN/Entrega de Frontend**



* Dependencia crítica para servir la UI en producción. \

* Mitigación: fallback al servidor origen (sin CDN). \



### **Mecanismos de monitoreo y logs**



* Indispensables para mantener SLA/SLO. \

* Si se pierden métricas/trazas → afecta capacidad de reacción.

** \
Integraciones Externas**



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")



## ** Diagrama de alto nivel (arquitectura simple con integraciones externas)**


## 

<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")



## **Diagrama de detalle técnico (incluye colas, WebSockets, observabilidad, etc.)**
