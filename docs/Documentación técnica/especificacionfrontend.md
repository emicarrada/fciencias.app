
### 4. Especificación del Frontend

El **Frontend** de **Fciencias** se concibe como una **SPA (Single Page Application)** moderna, accesible y escalable, diseñada para ofrecer una experiencia fluida en dispositivos móviles y de escritorio. Se prioriza la modularidad, la consistencia en el estilo y la integración directa con la **API REST** del backend.


---


## **4.1. Tecnologías empleadas**



* **Framework principal: \
**
    * **React** con **Next.js** (renderizado híbrido: SSR + SSG para SEO y rendimiento). \

* **Lenguaje: \
**
    * **TypeScript** para tipado fuerte, mantenimiento y escalabilidad. \

* **Estilos: \
**
    * **Tailwind CSS** para estilos utilitarios y consistencia visual. \

    * **Shadcn/UI** (o Radix UI) para componentes accesibles. \

* **Gestión de estado: \
**
    * **Zustand** o **Redux Toolkit** según complejidad. \

    * **React Query** para sincronización con API REST y caché de datos. \

* **Internacionalización (i18n): \
**
    * Base con **next-i18next** (aunque MVP solo soporta **es-MX**). \

* **Accesibilidad: \
**
    * Librerías con soporte WCAG (ej. Headless UI, Radix). \

* **Testing: \
**
    * **Jest** + **React Testing Library** (unitarias). \

    * **Cypress** (end-to-end en flujos críticos). \

* **Construcción y despliegue: \
**
    * **Vercel** o **Docker** para despliegues consistentes. \



---


## **4.2. Estructura del proyecto**

Se adopta una estructura **feature-based** (por módulos), con separación entre componentes UI, lógica de negocio y configuración:

/frontend

 ├── public/                  # Archivos estáticos (logos, íconos, manifest)

 ├── src/

 │   ├── app/                 # Páginas y enrutamiento Next.js

 │   │   ├── anuncios/

 │   │   ├── eventos/

 │   │   ├── comunidades/

 │   │   └── admin/

 │   ├── components/          # Componentes reutilizables de UI

 │   │   ├── forms/

 │   │   ├── layout/

 │   │   ├── navigation/

 │   │   └── feedback/

 │   ├── features/            # Lógica por dominio

 │   │   ├── auth/

 │   │   ├── users/

 │   │   ├── announcements/

 │   │   ├── events/

 │   │   └── communities/

 │   ├── hooks/               # Custom hooks

 │   ├── lib/                 # Configuración (axios, utils, constantes)

 │   ├── store/               # Estado global (Zustand/Redux)

 │   ├── styles/              # Tailwind config, variables globales

 │   ├── tests/               # Pruebas unitarias e2e

 │   └── types/               # Definiciones de TypeScript (DTOs, interfaces)

 ├── package.json

 ├── tsconfig.json

 └── tailwind.config.js

**Convenciones de nombres:**



* **Componentes:** PascalCase (`UserCard.tsx`, `EventForm.tsx`). \

* **Hooks:** `useNombre.ts` (`useAuth.ts`, `useFetch.ts`). \

* **Archivos de estilo:** `.css` o `.module.css` si no es Tailwind. \

* **Tests:** `&lt;nombre>.test.tsx` en la carpeta `tests/`. \



---


## **4.3. Componentes principales de la UI**

Los **componentes de interfaz** se dividen en **layout global**, **navegación**, **formularios**, **tarjetas** y **feedback**:


### **Layout y navegación**



* **Navbar:** navegación principal, logo, enlaces a secciones. \

* **Sidebar (opcional en admin):** accesos rápidos a paneles. \

* **Footer:** créditos, enlaces institucionales, políticas. \



### **Autenticación**



* **LoginForm:** formulario de inicio de sesión. \

* **RegisterForm:** registro de usuarios. \

* **PasswordReset:** flujo de recuperación de contraseña. \



### **Anuncios**



* **AnnouncementCard:** tarjeta con título, descripción, autor, fecha. \

* **AnnouncementList:** listado paginado de anuncios. \

* **AnnouncementForm:** creación/edición de anuncio. \

* **CommentBox:** caja de comentarios con moderación. \



### **Eventos**



* **EventCard:** información resumida de evento (nombre, fecha, lugar). \

* **EventDetail:** vista ampliada con registro/confirmación. \

* **CalendarView:** integración con calendario (opcional). \



### **Comunidades**



* **CommunityCard:** tarjeta de comunidad (nombre, responsable, contacto). \

* **CommunityDirectory:** listado de todas las comunidades. \

* **CommunityForm:** alta de una nueva comunidad. \



### **Administración y moderación**



* **UserTable:** tabla con usuarios y roles. \

* **ReportList:** listado de reportes con acciones (bloquear/permitir). \

* **Dashboard:** métricas básicas (usuarios activos, anuncios publicados). \



### **Feedback y utilitarios**



* **Alert/Toast:** notificaciones de éxito/error. \

* **Modal/Dialog:** confirmaciones y formularios emergentes. \

* **Loader/Spinner:** indicadores de carga. \

* **EmptyState:** mensajes cuando no hay datos. \



---


## **4.4. Estándares de diseño y usabilidad**



* **Accesibilidad (A11y): \
**
    * Cumplimiento **WCAG 2.1 AA** (contraste, teclado, lectores de pantalla). \

    * Uso de atributos ARIA en componentes interactivos. \

* **Diseño responsivo: \
**
    * **Mobile-first. \
**
    * Breakpoints definidos en Tailwind (`sm`, `md`, `lg`, `xl`). \

* **Consistencia visual: \
**
    * Uso de un **Design System** ligero con tokens de color, tipografía y espaciado. \

    * **Paleta de colores institucional** (ej. azul UNAM, acentos secundarios). \

* **Usabilidad: \
**
    * Formularios con validaciones en tiempo real (Yup/Zod). \

    * Estados de carga/vacío/error claramente diferenciados. \

    * Retroalimentación inmediata en acciones (confirmaciones, alertas). \

    * Evitar scroll excesivo → usar **paginación o carga incremental**. \

* **Internacionalización preparada: \
**
    * Textos centralizados en archivos de localización. \

    * Separación contenido/código para soportar otros idiomas en el futuro. \

* **Buenas prácticas de rendimiento: \
**
    * **Lazy loading** de módulos pesados. \

    * **Imágenes optimizadas** (Next/Image). \

    * **Prefetching** de rutas frecuentes (Next.js).