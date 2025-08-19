

### 5. Especificación del Backend

El **Backend** de **Fciencias** implementa la lógica de negocio, la gestión de datos y la seguridad del sistema. Expone una **API RESTful** consumida por el frontend y en el futuro por aplicaciones móviles o integraciones externas.


---


## **5.1. Lenguaje y framework utilizados**



* **Lenguaje: \
**
    * **TypeScript** (estático, seguro, mantenible). \

* **Framework principal: \
**
    * **NestJS** (sobre Node.js, arquitectura modular, inyección de dependencias, soporte integrado para REST y seguridad). \

    * Alternativa ligera: **Express.js** si se requiere simplicidad. \

* **ORM (Object Relational Mapper): \
**
    * **Prisma** (tipado fuerte, migraciones automáticas, integración con PostgreSQL). \

* **Base de datos: \
**
    * **PostgreSQL** (relacional, robusta, soporte avanzado de índices y JSON). \

* **Infraestructura y despliegue: \
**
    * **Docker** para contenedorización. \

    * **CI/CD (GitHub Actions / GitLab CI). \
**


## **5.2. Endpoints y API REST**

Los endpoints están organizados por recursos. Todos siguen el patrón:

/api/v1/&lt;recurso>


### **5.2.2. Anuncios**




### **5.2.3. Eventos**


### **5.2.4. Comunidades**



<p id="gdcalert1" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image1.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert2">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image1.png "image_tooltip")



### **5.2.5. Moderación y reportes**



<p id="gdcalert2" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image2.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert3">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image2.png "image_tooltip")



### **5.2.6. Notificaciones**



<p id="gdcalert3" ><span style="color: red; font-weight: bold">>>>>>  gd2md-html alert: inline image link here (to images/image3.png). Store image on your image server and adjust path/filename/extension if necessary. </span><br>(<a href="#">Back to top</a>)(<a href="#gdcalert4">Next alert</a>)<br><span style="color: red; font-weight: bold">>>>>> </span></p>


![alt_text](images/image3.png "image_tooltip")



## **5.3. Lógica de negocio y servicios principales**

El backend está estructurado en **módulos de dominio**, cada uno encapsula su lógica:



* **Auth Service: \
**
    * Registro/login de usuarios. \

    * Emisión y validación de JWT. \

    * Encriptación de contraseñas (bcrypt/argon2). \

* **User Service: \
**
    * Gestión de perfiles, roles y permisos (RBAC). \

    * Administración de usuarios por rol. \

* **Announcement Service: \
**
    * Creación/edición/publicación de anuncios. \

    * Moderación de comentarios y reacciones. \

    * Notificación de nuevos anuncios a usuarios suscritos. \

* **Event Service: \
**
    * Creación y gestión de eventos. \

    * Registro y administración de participantes. \

    * Recordatorios (correo/notificaciones push). \

* **Community Service: \
**
    * Alta y directorio de comunidades. \

    * Validación y aprobación de solicitudes. \

* **Report Service: \
**
    * Gestión de reportes de contenido. \

    * Flujos de revisión y resolución por moderadores. \

* **Notification Service: \
**
    * Generación de notificaciones in-app. \

    * Envío de correos transaccionales (p. ej., bienvenida, recordatorios). \



---


## **5.4. Seguridad y autenticación**

La seguridad es pilar clave. Se aplican **múltiples capas**:


### **5.4.1. Autenticación**



* **JWT (JSON Web Tokens): \
**
    * Acceso stateless. \

    * Tokens firmados con clave privada. \

    * **Access token** (vida corta) + **refresh token** (vida más larga). \

* **OAuth 2.0 (futuro): \
**
    * Para integración con SSO institucional o Google/Microsoft. \

    * MVP soporta autenticación local con migración futura a SSO. \



### **5.4.2. Autorización (RBAC)**



* **Roles definidos: \
**
    * **Invitado (guest):** acceso a contenido público. \

    * **Usuario registrado (student/teacher/adminstaff):** acceso completo a anuncios, eventos, comunidades. \

    * **Moderador:** gestión de reportes y revisión de contenido. \

    * **Administrador:** control total del sistema. \

* Control de permisos en cada endpoint vía **guards** de NestJS. \



### **5.4.3. Protección de datos y seguridad web**



* **Hash de contraseñas:** Argon2 o bcrypt con salting. \

* **CSRF Protection:** tokens anti-CSRF en formularios críticos. \

* **CORS:** políticas estrictas solo para dominios autorizados. \

* **Rate limiting:** limitar intentos de login y llamadas repetitivas. \

* **Helmet.js:** para establecer cabeceras de seguridad (CSP, XSS). \

* **Auditoría:** logs de acciones críticas (login, cambios de roles, moderación). \

* **Backups cifrados:** para la base de datos y archivos sensibles.