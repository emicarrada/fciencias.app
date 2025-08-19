3. Arquitectura del Sistema

La arquitectura del sistema **Fciencias** sigue el paradigma **cliente–servidor** con separación clara entre presentación, lógica de negocio y persistencia de datos. Se prioriza un **diseño modular y escalable**, que permite evolucionar el MVP hacia escenarios más complejos (apps móviles, microservicios, integraciones externas).


---


## **3.1. Diagrama de arquitectura (cliente–servidor–BD)**

A alto nivel, la interacción es la siguiente:



* **Clientes (Web/Móvil)** se comunican con el **Frontend SPA**.
* El **Frontend** consume servicios expuestos por el **Backend API REST**.
* El **Backend** administra la lógica de negocio, conecta con la **Base de Datos relacional** y servicios externos (correo, almacenamiento de archivos, notificaciones). \




**Diagrama de arquitectura (cliente–servidor–BD)**


## **3.2. Componentes principales**


### **Frontend**



* Tecnologías: React/Next.js, TailwindCSS, librerías de UI accesibles. \

* Características: \

    * SPA con enrutamiento dinámico. \

    * Comunicación con backend vía fetch/Axios (JSON). \

    * Manejo de estado global (Redux/Zustand). \

    * Internacionalización preparada (aunque MVP solo es es-MX). \

    * Accesibilidad WCAG 2.1 AA. \



### **Backend**



* Tecnologías: Node.js (Express/NestJS) o equivalente. \

* Componentes lógicos: \

    * Módulo de autenticación: registro, login, JWT, refresh tokens, roles (RBAC). \

    * Módulo de usuarios: perfil, roles, permisos. \

    * Módulo de contenido: anuncios, comentarios, reacciones. \

    * Módulo de eventos: gestión de calendarios, recordatorios. \

    * Módulo de comunidades: directorio de grupos, flujo de aprobación. \

    * Módulo de notificaciones: envío de correos, notificaciones in-app. \

    * Módulo de moderación: reportes, revisión de contenido, métricas básicas. \



### Base de datos (BD relacional, PostgreSQL recomendado)



* Tablas principales: \

    * users (usuarios, roles, credenciales). \

    * announcements (anuncios, metadatos, estados). \

    * comments (comentarios asociados a anuncios/eventos). \

    * events (eventos, inscripciones, horarios). \

    * communities (grupos registrados, responsables). \

    * reports (reportes de moderación). \

    * notifications (histórico de notificaciones enviadas). \



### APIs



* RESTful API como contrato entre frontend y backend. \

* Endpoints organizados por recursos (/auth, /users, /announcements, /events, /communities). \

* Autenticación: encabezado Authorization: Bearer &lt;token> para rutas protegidas. \

* Documentación viva: Swagger/OpenAPI disponible para desarrolladores.


## **3.3. Flujo de datos (Data Flow Diagrams)**

**Ejemplo: flujo "Usuario publica un anuncio"**

**Otro ejemplo: flujo "Usuario se registra"**


## 


## **3.4. Patrones de diseño utilizados**



* Arquitectura en capas (Layered Architecture): \

    * Presentación (Frontend SPA). \

    * API/Lógica de negocio (Backend). \

    * Persistencia (Base de datos). \

* MVC (Model-View-Controller) adaptado al backend: \

    * Modelos: entidades (usuario, anuncio, evento, comunidad). \

    * Controladores: exponen endpoints REST. \

    * Servicios: lógica de negocio independiente. \

* Patrón Repository: encapsula la lógica de acceso a datos para cada entidad. \

* DTOs (Data Transfer Objects): para garantizar consistencia en requests/responses. \

* JWT (Token-based authentication): autenticación stateless, escalable. \

* Patrón Observer (event-driven) en notificaciones: acciones (nuevo anuncio, evento creado) generan notificaciones hacia usuarios. \

* Feature flags: para habilitar/deshabilitar funcionalidades sin afectar** despliegues. \
**
* **CI/CD + Infrastructure as Code (IaC): despliegues reproducibles y automatizados. \
**