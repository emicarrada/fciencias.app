1. Introducción


### **1.1 Objetivo del documento**

Este documento establece una referencia única y compartida para definir, construir y evaluar el MVP de **fciencias.app**, una red social especializada para la comunidad de la Facultad de Ciencias de la UNAM. Sus objetivos son:



* **Alinear la visión del proyecto** entre todos los actores involucrados.
* **Delimitar el alcance funcional del MVP**, detallando qué se incluye y qué se excluye en esta primera versión.
* **Definir criterios de éxito y métricas iniciales** que permitan evaluar el desempeño del producto.
* **Especificar la arquitectura técnica inicial** basada en herramientas open source (frontend, backend, base de datos y hosting), así como lineamientos de seguridad y protección de datos.
* **Describir el flujo de usuario básico** desde el registro hasta la interacción en el feed.
* **Establecer reglas de la comunidad y lineamientos de moderación** aplicables desde el lanzamiento.
* **Estructurar las fases de desarrollo** (MVP, pruebas, expansión) y su relación con el plan de iteración.
* **Servir como base para el roadmap, backlog y QA**, incluyendo criterios de aceptación para pruebas funcionales.

**Audiencia y uso previsto**



* **Audiencia principal:** equipo fundador, producto, ingeniería (frontend/backend/DevOps), diseño UX, moderación/comunidad, representantes estudiantiles y asesores académicos.
* **Uso operativo:** guía para priorización de funcionalidades, elaboración de historias de usuario, definición de criterios de aceptación y soporte a pruebas beta.
* **Uso de gestión:** documento de referencia para decisiones de alcance, seguimiento de hitos y comunicación con stakeholders.

**Alcance temporal**



* Aplica a la fase **MVP** (versión inicial hasta el lanzamiento en la Facultad de Ciencias).
* Las extensiones post‑MVP y escalabilidad se describen en la **Sección 12**.

**Criterios de aprobación del documento**



* Objetivos del MVP claramente definidos y medibles.
* Supuestos, riesgos y dependencias clave identificados.
* No existen bloqueadores abiertos para el inicio de desarrollo.
* Validación por parte de **Product Owner**, **Tech Lead** y **Responsable de Moderación**.


### **1.2 Alcance del MVP**

El alcance del **MVP de fciencias.app** se centra en construir una versión funcional mínima que permita validar la propuesta de valor con la comunidad de la Facultad de Ciencias. Este alcance se define en función de lo que se incluirá, lo que se excluirá y las restricciones conocidas:

**Incluido en el MVP:**



* Autenticación con correo institucional **@ciencias.unam.mx**.
* Creación de perfiles básicos (nombre, carrera, intereses).
* Publicaciones categorizadas (avisos, eventos, discusión académica, general).
* Visualización de un **feed filtrable** por categorías.
* Interacciones mínimas: lectura de publicaciones y posibilidad de dar “me gusta”.
* Lineamientos de convivencia y primeras reglas de moderación.

**Excluido del MVP (para versiones posteriores):**



* Mensajería privada o chats grupales.
* Integración con servicios académicos (inscripciones, calificaciones, etc.).
* Funcionalidades avanzadas de personalización del perfil (foto, biografía extendida, redes externas).
* Gamificación, ranking de usuarios o insignias.
* Aplicaciones móviles nativas (se prioriza versión web responsiva).

**Restricciones conocidas:**



* Uso exclusivo de **herramientas open source** para desarrollo y despliegue.
* Validación inicial limitada únicamente a miembros con correo institucional.
* Recursos humanos y técnicos reducidos, priorizando simplicidad y escalabilidad futura.

**Resultado esperado:**



* Una plataforma sencilla, funcional y segura que permita validar el interés real de la comunidad y recopilar retroalimentación directa para iteraciones posteriores.


### **1.3 Metodología de trabajo**

La construcción del MVP seguirá un enfoque ágil y colaborativo, con ciclos cortos de iteración y validación continua. La metodología de trabajo se basará en los siguientes principios:

**Enfoque ágil (Scrum/Kanban híbrido):**



* Organización del desarrollo en **sprints de 2 a 3 semanas**.
* Revisión y priorización constante del backlog.
* Entregas incrementales que permitan probar y validar funcionalidades con usuarios reales.

**Colaboración multidisciplinaria:**



* Participación activa de **producto, desarrollo, diseño UX/UI, QA y comunidad**.
* Reuniones de sincronización semanales y revisiones de sprint.
* Retroalimentación directa de un grupo piloto de estudiantes y académicos.

**Validación temprana:**



* Liberación de una **beta cerrada** para un subconjunto de usuarios de la Facultad.
* Recolección de métricas cualitativas y cuantitativas de uso.
* Ajustes rápidos en función de la retroalimentación.

**Gestión de calidad:**



* Definición de **criterios de aceptación claros** para cada historia de usuario.
* Pruebas unitarias y funcionales básicas en cada entrega.
* Documentación mínima pero suficiente para soporte técnico y funcional.

**Comunicación y transparencia:**



* Uso de herramientas de gestión open source (por ejemplo, GitLab, Trello, o alternativas similares).
* Publicación de changelogs e informes de avance breves.
* Retroalimentación constante de la comunidad para alinear expectativas.

**Resultado esperado:**



* Un proceso de desarrollo eficiente, flexible y orientado a validar hipótesis, que permita mejorar la plataforma con rapidez y reducir riesgos de construcción innecesaria.




2. Visión general de la plataforma


### **2.1 Descripción de fciencias.app**

**fciencias.app** es una red social académica especializada, diseñada exclusivamente para la comunidad de la **Facultad de Ciencias de la UNAM**. Su propósito principal es ofrecer un espacio digital seguro, confiable y orientado a la vida universitaria, donde estudiantes, profesores y grupos puedan compartir información, recursos y experiencias.

**Características distintivas:**



* Acceso restringido a usuarios con correo institucional **@ciencias.unam.mx**, lo que garantiza pertenencia y confianza en la comunidad.
* Enfoque en la vida académica y estudiantil: anuncios, debates, actividades y eventos relevantes.
* Interfaz sencilla, limpia y sin distracciones, optimizada para interacción rápida.
* Base tecnológica construida con **herramientas open source**, priorizando transparencia y adaptabilidad.

**Propósitos fundamentales:**



* Centralizar la comunicación interna de la Facultad en un único canal digital.
* Reducir la dependencia de plataformas externas no diseñadas para el entorno académico.
* Fomentar la identidad y cohesión de la comunidad.
* Servir como base para futuras integraciones con proyectos académicos y estudiantiles.


### **2.2 Principios rectores del proyecto**

El diseño y la operación de **fciencias.app** estarán guiados por un conjunto de principios rectores que aseguren su alineación con la misión académica y comunitaria de la Facultad de Ciencias:

**1. Comunidad primero:**



* La plataforma existe para servir a estudiantes, profesores y grupos de la Facultad.
* Todas las decisiones de producto priorizan la utilidad y seguridad de la comunidad.

**2. Accesibilidad e inclusión:**



* Interfaz clara y sencilla, apta para todo tipo de usuarios.
* Cumplimiento de buenas prácticas de accesibilidad digital (WCAG).

**3. Transparencia y confianza:**



* Procesos de moderación claros y comunicados a la comunidad.
* Uso exclusivo de correos institucionales para garantizar pertenencia y autenticidad.

**4. Código abierto y sostenibilidad:**



* Basado en herramientas y frameworks open source.
* Diseño pensado para escalar y mantenerse con recursos limitados.

**5. Privacidad y seguridad:**



* Protección activa de datos personales de estudiantes y académicos.
* Implementación de estándares mínimos de seguridad desde el MVP.

**6. Iteración y mejora continua:**



* Validación constante de funcionalidades con usuarios reales.
* Apertura al cambio y mejora en cada fase de desarrollo.

**Resultado esperado:**



* Una plataforma alineada con valores comunitarios, académicos y tecnológicos, que genere confianza y fomente la participación activa de sus usuarios.


### **2.2 Principios rectores del proyecto**

El diseño y la operación de **fciencias.app** estarán guiados por un conjunto de principios rectores que aseguren su alineación con la misión académica y comunitaria de la Facultad de Ciencias:

**1. Comunidad primero:**



* La plataforma existe para servir a estudiantes, profesores y grupos de la Facultad.
* Todas las decisiones de producto priorizan la utilidad y seguridad de la comunidad.

**2. Accesibilidad e inclusión:**



* Interfaz clara y sencilla, apta para todo tipo de usuarios.
* Cumplimiento de buenas prácticas de accesibilidad digital (WCAG).

**3. Transparencia y confianza:**



* Procesos de moderación claros y comunicados a la comunidad.
* Uso exclusivo de correos institucionales para garantizar pertenencia y autenticidad.

**4. Código abierto y sostenibilidad:**



* Basado en herramientas y frameworks open source.
* Diseño pensado para escalar y mantenerse con recursos limitados.

**5. Privacidad y seguridad:**



* Protección activa de datos personales de estudiantes y académicos.
* Implementación de estándares mínimos de seguridad desde el MVP.

**6. Iteración y mejora continua:**



* Validación constante de funcionalidades con usuarios reales.
* Apertura al cambio y mejora en cada fase de desarrollo.

**Resultado esperado:**



* Una plataforma alineada con valores comunitarios, académicos y tecnológicos, que genere confianza y fomente la participación activa de sus usuarios.


### **2.3 Diferenciación frente a redes sociales generalistas**

A diferencia de plataformas generalistas como Facebook, Instagram o Twitter, **fciencias.app** se enfoca exclusivamente en la vida académica y estudiantil de la Facultad de Ciencias. Su diferenciación se manifiesta en los siguientes aspectos:

**1. Comunidad cerrada y validada:**



* Acceso limitado a usuarios con correo institucional **@ciencias.unam.mx**, lo que garantiza pertenencia y relevancia de los contenidos.
* Eliminación de ruido externo y publicidad irrelevante.

**2. Enfoque académico y estudiantil:**



* Contenidos orientados a clases, avisos académicos, proyectos y actividades estudiantiles.
* Herramientas diseñadas para facilitar la colaboración y comunicación dentro de la Facultad.

**3. Privacidad y seguridad reforzada:**



* No se persigue monetización basada en publicidad ni venta de datos.
* Políticas claras de protección de información personal.

**4. Simplicidad y pertinencia:**



* Interfaz mínima, sin algoritmos opacos de recomendación.
* Organización de publicaciones por categorías y filtros claros.

**5. Construcción comunitaria:**



* Reglas de convivencia diseñadas con y para la comunidad.
* Mecanismos de retroalimentación directa que influyen en el desarrollo.

**Resultado esperado:**



* Posicionar a **fciencias.app** como una alternativa especializada, confiable y funcional para la comunicación académica, en contraste con redes sociales de propósito general.



3. Problema actual que resuelve


### **3.1 Problemática de comunicación interna**

Actualmente, la comunidad de la Facultad de Ciencias enfrenta diversas limitaciones en sus canales de comunicación:



* **Canales dispersos:** La información circula en múltiples medios (Facebook, WhatsApp, correos personales, grupos no oficiales), lo que dificulta centralizar avisos y anuncios relevantes. \

* **Falta de oficialidad:** Gran parte de los mensajes proviene de grupos estudiantiles o terceros sin un canal claro de validación. Esto genera dudas sobre la veracidad de la información. \

* **Exclusión parcial:** Estudiantes de nuevo ingreso o personas sin acceso a ciertos grupos quedan fuera de información importante. \

* **Saturación y ruido:** La comunicación en grupos generalistas suele mezclar temas personales, memes o spam con avisos relevantes, lo que reduce la efectividad del canal. \

* **Carencia de filtros:** Es difícil diferenciar entre contenido académico, avisos institucionales y temas sociales, lo cual genera pérdida de tiempo y confusión. \


**Resultado esperado: \
** La creación de **fciencias.app** busca centralizar la comunicación interna en un solo espacio confiable, organizado por categorías, que reduzca la dispersión, mejore la pertinencia de la información y facilite el acceso equitativo para todos los miembros de la comunidad.


### **3.2 Limitaciones de las plataformas actuales de comunicación**

Las plataformas actualmente utilizadas por la comunidad de la Facultad de Ciencias (Facebook, WhatsApp, Telegram, entre otras) presentan múltiples limitaciones cuando se trata de atender las necesidades específicas del entorno académico:



* **Falta de control y privacidad:** La información personal de los usuarios queda expuesta a políticas de terceros y a usos no siempre transparentes de los datos. \

* **Ausencia de filtros adecuados:** Los canales mezclan memes, conversaciones personales y anuncios académicos, lo que provoca saturación y disminuye la relevancia del contenido. \

* **Dependencia de algoritmos externos:** La visibilidad de publicaciones depende de sistemas diseñados para maximizar la interacción y la publicidad, no para la pertinencia de la información. \

* **Acceso desigual:** No todos los estudiantes utilizan las mismas plataformas, lo que genera brechas en la distribución de información importante. \

* **Carencia de identidad institucional:** Ninguna de estas plataformas refleja la identidad, valores o necesidades particulares de la Facultad de Ciencias. \


**Resultado esperado: \
fciencias.app** pretende superar estas limitaciones creando un espacio seguro, filtrado y enfocado exclusivamente en las dinámicas académicas y comunitarias, con control local y acceso equitativo para todos los miembros con correo institucional.


### **3.3 Necesidad de un espacio digital especializado**

La Facultad de Ciencias carece de un espacio digital propio que integre y organice la comunicación interna de forma eficiente. Actualmente, los estudiantes y académicos dependen de plataformas generalistas que no fueron diseñadas para atender las dinámicas particulares de una comunidad académica.



* **Ausencia de un canal oficial centralizado:** No existe una herramienta que concentre avisos, debates, recursos y actividades en un solo lugar confiable. \

* **Desajuste entre necesidades y funcionalidades:** Las redes sociales comerciales priorizan la interacción masiva y el entretenimiento, mientras que la comunidad requiere un entorno enfocado en el intercambio académico y estudiantil. \

* **Pérdida de identidad institucional:** La comunicación dispersa en plataformas externas diluye la identidad digital de la Facultad y limita su visibilidad como comunidad cohesionada. \

* **Falta de continuidad histórica:** La información compartida en redes externas se fragmenta y pierde con el tiempo, lo que dificulta la construcción de memoria institucional y estudiantil. \


**Resultado esperado: \
** El desarrollo de **fciencias.app** permitirá contar con un espacio digital especializado que represente a la comunidad de la Facultad de Ciencias, fortalezca su identidad colectiva, organice la comunicación y siente las bases para futuras integraciones académicas y tecnológicas.



### 4. Público objetivo


### **4.1 Definición del usuario principal**

El usuario principal de **fciencias.app** es cualquier miembro activo de la **Facultad de Ciencias de la UNAM** que cuente con un correo institucional **@ciencias.unam.mx**, ya sea estudiante, académico o personal de apoyo. Sin embargo, el foco inicial del MVP se concentra en el **estudiante de licenciatura**, al ser el grupo más numeroso y con mayor necesidad de comunicación digital efectiva.

**Características del usuario principal (estudiante de licenciatura):**



* **Edad promedio:** entre 17 y 25 años. \

* **Perfil tecnológico:** alta familiaridad con dispositivos móviles y plataformas digitales, con preferencia por interfaces rápidas y sencillas. \

* **Necesidades principales: \
**
    * Recibir avisos académicos confiables y oportunos. \

    * Conocer eventos, talleres y actividades de interés en la Facultad. \

    * Participar en discusiones y grupos relacionados con sus cursos y áreas de estudio. \

    * Contar con un canal institucional que reduzca la dependencia de redes sociales externas. \

* **Motivaciones:** pertenecer a una comunidad digital que refleje su identidad como estudiante de la Facultad, mantener comunicación efectiva con compañeros y profesores, y acceder a información relevante sin distracciones. \


**Resultado esperado: \
** La definición clara del usuario principal permitirá orientar el diseño de **fciencias.app** hacia una experiencia enfocada en sus necesidades reales, asegurando pertinencia y alta adopción en la fase inicial del MVP.


### **4.2 Requisitos de acceso (correo @ciencias.unam.mx)**

Para garantizar que **fciencias.app** sea un espacio auténtico, confiable y exclusivo de la comunidad, se establece como requisito indispensable el acceso mediante correo institucional con dominio **@ciencias.unam.mx**.

**Justificación del requisito:**



* **Autenticidad:** asegura que cada cuenta corresponda a un miembro real de la Facultad de Ciencias. \

* **Seguridad:** reduce la posibilidad de suplantación de identidad o infiltración de usuarios ajenos. \

* **Pertinencia:** garantiza que el contenido publicado sea relevante únicamente para la comunidad académica. \

* **Cohesión:** fortalece el sentido de pertenencia al limitar la participación a miembros reconocidos de la institución. \


**Proceso de validación:**



* Durante el registro, el sistema verificará el dominio del correo institucional. \

* Será necesario confirmar la cuenta mediante enlace enviado al correo **@ciencias.unam.mx**. \

* Opcionalmente, en fases posteriores, se podrá integrar un sistema de validación contra directorios institucionales. \


**Resultado esperado: \
** Un entorno cerrado y seguro donde todos los usuarios compartan la misma identidad institucional, generando confianza y un sentido de comunidad que no ofrecen las redes sociales externas.


### **4.3 Casos de uso iniciales**

Los casos de uso iniciales definen los escenarios concretos en los que los miembros de la Facultad de Ciencias podrán interactuar dentro de **fciencias.app** durante la fase MVP. Estos casos buscan validar la utilidad práctica de la plataforma y cubrir las necesidades más inmediatas de comunicación y organización.

**Principales casos de uso identificados:**



1. **Registro y autenticación institucional \
**
    * Un estudiante accede a la plataforma, se registra con su correo **@ciencias.unam.mx**, valida su cuenta y genera un perfil básico. \

2. **Publicación de avisos académicos \
**
    * Un profesor comparte un aviso sobre la reprogramación de clases o entrega de tareas, visible para los estudiantes de su área de interés. \

3. **Difusión de eventos y actividades estudiantiles \
**
    * Un grupo estudiantil publica información sobre un taller, con la posibilidad de categorizarlo como “evento” para que sea fácilmente filtrable. \

4. **Consulta de feed filtrable \
**
    * Un estudiante revisa el feed general y aplica un filtro para visualizar únicamente publicaciones de la categoría “avisos académicos”. \

5. **Interacción mínima con publicaciones \
**
    * Los usuarios pueden dar “me gusta” a publicaciones relevantes, lo que permite medir el interés de la comunidad sin necesidad de comentarios complejos en la primera versión. \

6. **Moderación básica \
**
    * Cuando un contenido incumple las reglas de convivencia, un usuario lo reporta y el equipo de moderación lo revisa para tomar acción. \


**Resultado esperado: \
** Estos casos de uso iniciales permiten validar que la plataforma es funcional, relevante y confiable desde su lanzamiento, a la vez que proporcionan insumos para definir las siguientes iteraciones del producto.


### 5. Propuesta de valor

La propuesta de valor de **fciencias.app** se centra en ofrecer un espacio digital único que cubra las necesidades de comunicación, colaboración y pertenencia de la comunidad de la Facultad de Ciencias, generando beneficios diferenciados para sus distintos perfiles de usuario.


---


### **5.1 Beneficios para estudiantes**



* **Acceso centralizado a información académica y estudiantil:** avisos de profesores, actividades de grupos y eventos de interés en un solo lugar. \

* **Reducción del ruido digital:** evita la dispersión en múltiples grupos de WhatsApp, Facebook u otras plataformas externas. \

* **Mayor confianza y relevancia:** al interactuar solo con miembros verificados de la Facultad, se asegura la pertinencia de la información. \

* **Oportunidades de colaboración:** visibilidad de proyectos estudiantiles, talleres y convocatorias. \

* **Identidad y pertenencia:** un espacio diseñado exclusivamente para sus necesidades como estudiantes de Ciencias. \



---


### **5.2 Beneficios para profesores y académicos**



* **Canal confiable de comunicación:** posibilidad de enviar avisos que lleguen directamente a estudiantes verificados de la Facultad. \

* **Segmentación por categorías:** permite organizar la información (avisos académicos, eventos, proyectos) y facilitar la consulta. \

* **Ahorro de tiempo:** evita duplicar esfuerzos en múltiples plataformas y grupos informales. \

* **Fortalecimiento del vínculo docente-estudiante:** mejora la comunicación al estar en un espacio académico seguro. \

* **Visibilidad de actividades académicas:** conferencias, charlas o seminarios pueden difundirse con mayor alcance dentro de la comunidad. \



---


### **5.3 Beneficios para grupos estudiantiles y proyectos**



* **Difusión estructurada de eventos y convocatorias:** los grupos pueden compartir información categorizada y visible para toda la comunidad. \

* **Acceso a público objetivo:** asegura que sus mensajes lleguen exclusivamente a estudiantes y académicos de la Facultad. \

* **Fortalecimiento de redes de colaboración:** facilita la interacción entre grupos, proyectos y estudiantes con intereses comunes. \

* **Construcción de comunidad:** crea un espacio digital donde se promueve la participación, la colaboración y la innovación. \

* **Sostenibilidad en la comunicación:** al centralizar sus mensajes, se evita depender de redes externas que no garantizan permanencia ni seguridad. \



---

**Resultado esperado: \
**La propuesta de valor de **fciencias.app** consiste en consolidar un espacio académico-digital confiable, que fortalezca la identidad de la comunidad, mejore la comunicación y fomente la colaboración, generando beneficios claros y diferenciados para estudiantes, profesores y grupos estudiantiles.




### 6. Funcionalidades principales del MVP

El MVP de **fciencias.app** se enfocará en un conjunto reducido de funcionalidades críticas que permitan validar la propuesta de valor de manera rápida, sencilla y confiable. Estas funcionalidades iniciales están diseñadas para cubrir las necesidades básicas de comunicación y pertenencia de la comunidad de la Facultad de Ciencias.


---


### **6.1 Autenticación con correo institucional**

**Descripción: \
** El acceso a la plataforma se realizará exclusivamente mediante correos electrónicos con dominio **@ciencias.unam.mx**.

**Características clave:**



* Registro inicial con correo institucional. \

* Envío de enlace de confirmación para validar pertenencia. \

* Restricción de creación de cuenta a un único perfil por correo. \

* Sistema básico de recuperación de contraseña. \


**Beneficio esperado: \
** Garantizar la autenticidad de la comunidad, evitando accesos de externos y creando un entorno cerrado, seguro y confiable.


---


### **6.2 Publicaciones categorizadas (temas académicos, avisos, actividades)**

**Descripción: \
** Los usuarios podrán generar publicaciones simples, clasificadas en categorías predefinidas que reflejan la vida académica y estudiantil de la Facultad.

**Categorías iniciales:**



* **Académico:** información sobre clases, proyectos o materiales de estudio. \

* **Avisos:** notificaciones urgentes o de interés general (avisos administrativos, cambios de clase). \

* **Actividades:** difusión de eventos, talleres, conferencias y actividades estudiantiles. \

* **General:** temas no estrictamente académicos, pero relevantes para la comunidad. \


**Características clave:**



* Texto simple (con opción a links). \

* Etiquetado obligatorio con categoría. \

* Orden cronológico en la visualización. \


**Beneficio esperado: \
** Organizar el contenido de manera clara y pertinente, evitando la sobrecarga de información y facilitando la búsqueda de temas específicos.


---


### **6.3 Feed filtrable y personalizable**

**Descripción: \
** El feed es el núcleo de interacción de la plataforma. Se mostrará en orden cronológico, con posibilidad de filtrar publicaciones según categoría.

**Características clave:**



* Vista inicial: feed general con todas las publicaciones recientes. \

* Filtros rápidos: mostrar solo publicaciones de una categoría (ej. solo “Académico” o solo “Actividades”). \

* Personalización básica: selección manual de categorías favoritas para priorizar en el feed (opcional en versión MVP). \

* Posibilidad de dar “me gusta” para señalar interés en una publicación. \


**Beneficio esperado: \
** Ofrecer una experiencia de navegación clara, enfocada y relevante, que se adapte a las necesidades inmediatas del usuario sin algoritmos complejos.


---


### **6.4 Perfiles mínimos (nombre, carrera, intereses)**

**Descripción: \
** Cada usuario contará con un perfil sencillo que muestre su información básica, lo suficiente para dar contexto en las interacciones sin sobrecargar la experiencia inicial.

**Campos iniciales:**



* **Nombre completo** (vinculado al correo institucional). \

* **Carrera** (selección de lista). \

* **Intereses principales** (máximo 3 etiquetas). \


**Características clave:**



* Perfil accesible desde las publicaciones del feed. \

* No se incluirán fotos de perfil ni biografías extendidas en el MVP. \

* Posibilidad de editar intereses de forma sencilla. \


**Beneficio esperado: \
**Facilitar la identificación y contextualización entre miembros de la comunidad, promoviendo interacción académica y estudiantil sin distracciones ni sobrecarga de datos.


---

**Resultado esperado de las funcionalidades del MVP: \
**Un entorno digital simple, seguro y funcional que cubra las necesidades mínimas de comunicación, permitiendo validar la aceptación y el uso real de la plataforma por parte de la comunidad de la Facultad.




### 7. Arquitectura técnica inicial

Objetivo: definir una arquitectura **100% basada en herramientas open source** que sea simple para el MVP, segura desde el día uno y preparada para escalar sin reescrituras profundas.


### **7.1 Frontend (frameworks y librerías open source)**

**Stack propuesto (web responsiva, PWA-ready):**



* **Framework:** React + **Vite** + **TypeScript** (arranque rápido, DX excelente, tipado fuerte). \

* **UI & estilos:** **Tailwind CSS** + **shadcn/ui** (componentes accesibles, consistencia visual). \

* **Ruteo:** **React Router** (SPA con rutas protegidas). \

* **Estado remoto & datos:** **TanStack Query** (caché, reintentos, invalidación de queries). \

* **Formularios y validación:** **React Hook Form** + **Zod** (validación isomórfica, mensajes claros). \

* **Internacionalización (opcional post-MVP):** i18next. \

* **PWA (opcional liviano):** Workbox para offline básico (sólo shell y rutas públicas informativas). \

* **Accesibilidad:** prácticas WCAG AA; uso de atributos ARIA; enfoque de teclado “tab-first”. \


**Estructura de vistas del MVP:**



* **/login** (registro + verificación por email @ciencias.unam.mx) \

* **/feed** (lista cronológica, filtros por categoría) \

* **/post/new** (publicación mínima con categoría) \

* **/profile** (edición: nombre, carrera, intereses) \

* **/moderation** (sólo rol moderador; revisión de reportes) \

* **/about /rules** (estáticas) \


**Patrones de UX clave:**



* Barra de filtros persistente en el feed (checkboxes de categorías). \

* Indicadores de carga y estados vacíos claros. \

* Mensajería de errores con causas y acciones sugeridas. \

* Preferencias del usuario (categorías favoritas) guardadas localmente y en backend. \


**Entrega y calidad:**



* **Linter/formatter:** ESLint + Prettier. \

* **Pruebas:** Vitest + React Testing Library (componentes críticos: login, creación de post, filtros). \

* **Analítica mínima:** evento “view_feed”, “create_post”, “like_post” (métricas internas, sin trackers de terceros). \



---


### **7.2 Backend (lenguaje, framework y API REST/GraphQL)**

**Lenguaje y framework:**



* **Node.js (LTS) + TypeScript**. \

* **Framework:** **Fastify** (alto rendimiento, bajo overhead) o **NestJS** (si se prefiere mayor estructura). \
 Para el MVP se propone **Fastify** + plugins (JWT, CORS, rate limit) por simplicidad. \


**Estilo de API:**



* **REST v1** inicialmente (simplicidad y adopción rápida). \

* **GraphQL** evaluado post-MVP si aparecen casos de over/under-fetching en cliente. \


**Contratos y validación:**



* **OpenAPI 3** autogenerado (documentación viva). \

* Validación de payloads con **Zod**/Fastify-Schema (paridad con frontend). \


**Autenticación & sesiones:**



* **Flujo de verificación por correo institucional**: \

    1. registro con email **@ciencias.unam.mx**, \

    2. envío de enlace/token, \

    3. activación. \

* **JWT** (access ~15 min) + **refresh tokens** (~7–30 días) con revocación por servidor. \

* Rotación de refresh tokens; lista de revocados en **Redis**. \


**Autorización (RBAC mínimo):**



* Roles: `user`, `moderator`, `admin`. \

* Guards por ruta y por acción (crear, reportar, moderar). \


**Endpoints (borrador /v1):**



* `POST /auth/register` – inicia registro (verifica dominio). \

* `POST /auth/verify` – activa cuenta con token. \

* `POST /auth/login` – credenciales + 2FA opcional futuro. \

* `POST /auth/refresh` – rota tokens. \

* `POST /auth/logout` – revoca refresh. \

* `GET /me` – perfil actual. \

* `PUT /me` – actualizar carrera/intereses. \

* `GET /categories` – lista estática: académico, avisos, actividades, general. \

* `GET /posts?category=...&page=...` – feed paginado, orden cronológico (desc). \

* `POST /posts` – crear publicación (texto + categoría). \

* `POST /posts/:id/like` / `DELETE /posts/:id/like \
`
* `POST /reports` – reportar publicación (motivo). \

* `GET /moderation/reports` (moderator/admin) \

* `POST /moderation/posts/:id/hide` (moderator/admin) \


**Capa de datos y acceso:**



* ORM: **Prisma** o **Drizzle** (TypeScript first). Se propone **Prisma** por su DX y migraciones. \

* Paginación por cursor (id/fecha) para feeds eficientes. \


**Telemetría y logs:**



* Logs estructurados (JSON) con pino. \

* Métricas Prometheus (tiempos, throughput, errores 4xx/5xx). \

* Trazas OpenTelemetry (opcional). \



---


### **7.3 Base de datos (estructura y justificación)**

**Motor propuesto:** **PostgreSQL** (robusto, transaccional, JSONB, FTS, extensiones útiles).

**Justificación frente a alternativas:**



* Datos relacionales claros (usuarios, posts, likes, categorías). \

* Búsquedas y filtros eficientes (índices B-Tree/GIN). \

* **Full Text Search** (ftw) para futuros buscadores de posts. \

* Integridad referencial y migraciones seguras. \


**Esquema inicial (tablas y campos clave):**



1. **users \
**
* `id` (uuid) \

* `email` (text, único, dominio validado) \

* `email_verified_at` (timestamp) \

* `password_hash` (text) — si se usa password; si sólo magic link, se omite \

* `role` (enum: user|moderator|admin) \

* `created_at`, `updated_at \
`
1. **profiles** (1:1 con users) \

* `user_id` (fk) \

* `full_name` (text) \

* `career` (enum/lista controlada) \

* `interests` (text[] o tabla puente `profile_interests`) \

* `created_at`, `updated_at \
`
1. **categories \
**
* `id` (smallint) \

* `slug` (text: academico|avisos|actividades|general) \

* `name` (text) \

1. **posts \
**
* `id` (uuid) \

* `author_id` (fk users) \

* `category_id` (fk categories) \

* `title` (text, opcional en MVP) \

* `content` (text, sanitizado) \

* `created_at`, `updated_at \
` **Índices:** `(category_id, created_at desc)`, `(created_at desc) \
`
1. **post_likes \
**
* `post_id` (fk) \

* `user_id` (fk) \

* `created_at \
` **PK compuesta:** `(post_id, user_id) \
`
1. **reports** (moderación) \

* `id` (uuid) \

* `post_id` (fk) \

* `reporter_id` (fk users) \

* `reason` (enum: spam|offtopic|abuso|otro) \

* `notes` (text) \

* `status` (enum: open|reviewed|action_taken) \

* `created_at`, `updated_at \
`
1. **auth_tokens** (si se usa magic-link/verificación) \

* `id` (uuid) \

* `user_id` (fk) \

* `type` (enum: email_verification|password_reset) \

* `token_hash` (text) \

* `expires_at` (timestamp) \

* `consumed_at` (timestamp|null) \

1. **refresh_tokens \
**
* `id` (uuid) \

* `user_id` (fk) \

* `token_hash` (text) \

* `issued_at`, `expires_at`, `revoked_at \
`

**Buenas prácticas de DB:**



* **UUID v7/ULID** para orden temporal y rendimiento en índices. \

* **Migraciones** versionadas (Prisma Migrate). \

* **Políticas RLS** (Row Level Security) opcionales para exponer lecturas seguras si se habilita acceso directo (no necesario en MVP). \

* **Backups:** base completa diaria + WAL (retención 7–14 días) y pruebas de restauración. \



---


### **7.4 Hosting y despliegue (infraestructura open source / nube)**

**Contenedores y orquestación:**



* **Docker** + **Docker Compose** en MVP (sencillo y portable). \

* Roadmap a **Kubernetes** (k3s o K8s administrado) si la carga o equipos lo requieren. \


**Topología mínima (MVP, 1–2 VMs Linux):**



* **vm-app** (2 vCPU, 4–8 GB RAM): \

    * Reverse proxy **Traefik** o **NGINX** (TLS, redirecciones, HSTS). \

    * **Frontend** (build estático servido por proxy). \

    * **Backend** Node/Fastify (contenedor). \

    * **Redis** (rate limit, cache, sesiones). \

    * **Prometheus + Grafana** (observabilidad básica) — opcional si recursos. \

    * **Loki** o Filebeat + OpenSearch (logs centralizados) — opcional. \

* **vm-db** (2 vCPU, 4–8 GB RAM, disco SSD): \

    * **PostgreSQL** + **pgBackRest** (backups/WAL). \

    * **MinIO** (opcional futuro, si se habilitan archivos/medios). \


**Red y seguridad perimetral:**



* Sólo puertos 80/443 al público; 22 restringido (SSH con claves y fail2ban). \

* **Let’s Encrypt** para TLS 1.3 automático. \

* **Firewall** (UFW/iptables) + **ModSecurity** (WAF) con CRS (opcional). \

* **CORS** y **rate limiting** en proxy y en backend. \


**CI/CD (open source):**



* **GitLab CE** o **Gitea + Actions** para pipelines: \

    * lint + pruebas + build \

    * escaneo básico SAST/Dependabot-equivalente (trivy/grype) \

    * despliegue con **Compose** (staging → producción) con “blue-green” o “rolling” simple. \


**Entornos:**



* **Dev:** Docker local + seeds de datos. \

* **Staging:** dominio subdominio `staging.fciencias.app`, base de datos separada, feature flags. \

* **Prod:** backups automáticos, monitoreo y alertas. \



---


### **7.5 Seguridad y protección de datos**

**Autenticación y credenciales:**



* Verificación de email **@ciencias.unam.mx** obligatoria. \

* **Hash de contraseñas con Argon2id** (si se usa contraseña). \

* **JWT** firmados con claves rotadas; expiraciones cortas; refresh rotativos. \

* **2FA** (TOTP) planificado post-MVP para moderadores/admin. \


**Transporte y cifrado:**



* **TLS 1.3** en todo el tráfico; **HSTS** activo. \

* **Cifrado en reposo**: \

    * Discos/volúmenes con LUKS/equivalente. \

    * Campos sensibles (p. ej., `email`) con cifrado a nivel app/DB (pgcrypto) si se requiere mayor protección. \


**Higiene de entrada/salida:**



* **Validación estricta** de inputs (Zod/JSON schema). \

* **Sanitización** de contenido (HTML prohibido en MVP; texto plano o Markdown seguro con sanitización). \

* **Protecciones web:** CSRF (no aplica en APIs JWT si se maneja en header), XSS (CSP restrictiva), clickjacking (X-Frame-Options deny). \


**Autorización y exposición mínima:**



* **RBAC** por rol y endpoint. \

* Principio de **menor privilegio** en DB (cuentas separadas para migraciones/lecturas/escrituras). \

* Secretos en **variables de entorno** gestionados por **Vault** (si disponible) o almacenados de forma cifrada; rotación periódica. \


**Trazabilidad y auditoría:**



* Logs con contexto (usuario, endpoint, IP anonimizada). \

* **Auditoría** de acciones sensibles (moderación, cambios de rol). \

* Retención de logs ~30–90 días (cumplimiento y depuración). \


**Backups y continuidad:**



* Backups diarios + WAL; pruebas de restauración mensuales. \

* Estrategia **3-2-1** (3 copias, 2 medios, 1 off-site). \

* Plan de recuperación ante desastres (RPO ≤ 24h, RTO ≤ 4–8h para MVP). \


**Privacidad y cumplimiento:**



* Datos mínimos necesarios (“privacy by design”). \

* Políticas de retención: eliminación de tokens consumidos, purga de reportes cerrados tras X meses. \

* Consentimiento informado y Términos/Política de Privacidad claros (lenguaje sencillo). \

* Alineación con normativa local sobre protección de datos personales. \


**Seguridad operativa:**



* **Dependencias** con escaneo de vulnerabilidades (trivy/grype), actualizaciones semanales. \

* **Rate limiting** y **IP throttling** (login/posts/reportes). \

* **Protección ante abuso:** bloqueo de creación de cuentas masivas, captcha accesible si hay abuso (hCaptcha OSS-friendly o alternativa self-host). \



---


### **Resumen de decisiones técnicas (MVP)**



* **Frontend:** React + Vite + TS, Tailwind + shadcn/ui, TanStack Query, RHF + Zod. \

* **Backend:** Node + Fastify (REST v1), JWT + refresh, RBAC mínimo. \

* **BD:** PostgreSQL + Prisma; Redis para cache/ratelimit; backups serios. \

* **Infra:** Docker/Compose, Traefik/NGINX, Let’s Encrypt, logs/metrics básicos. \

* **Seguridad:** TLS 1.3, Argon2id, CSP, sanitización, WAF opcional, backups + DR. \



### 8. Flujo de usuario básico

El flujo de usuario básico define la **experiencia mínima viable (MVP)** para que los estudiantes, profesores y miembros de la Facultad puedan **entrar, crear un perfil, interactuar y consumir contenido** de manera clara, segura y con barreras mínimas de fricción.


---


### **8.1. Registro con correo institucional**

**Objetivo:** garantizar que sólo miembros verificados de la Facultad de Ciencias tengan acceso.

**Pasos detallados:**



1. **Pantalla de registro/login: \
**
    * Input único para correo institucional (`@ciencias.unam.mx`). \

    * Botón “Continuar”. \

2. **Validación de dominio: \
**
    * Si el dominio ≠ `@ciencias.unam.mx`, error claro (“Este espacio es exclusivo para la comunidad de la Facultad de Ciencias”). \

3. **Generación de token único de verificación: \
**
    * Token aleatorio, firmado y con caducidad corta (10–15 min). \

    * Guardado en tabla `auth_tokens` (tipo: `email_verification`). \

4. **Correo automático con enlace de verificación: \
**
    * Asunto: “Verifica tu correo institucional para acceder a la comunidad de Ciencias UNAM”. \

    * Contenido: enlace con token (ej: `https://app.fciencias.mx/verify?token=xyz`). \

5. **Confirmación en frontend: \
**
    * Al hacer clic en el enlace → backend valida token. \

    * Usuario marcado como `email_verified_at = now()`. \

    * Redirección a pantalla de **creación de perfil**. \


**Seguridad:**



* Tokens de un solo uso. \

* Hash del token almacenado en DB (no en texto plano). \

* Enlace caduca en 10–15 min. \



---


### **8.2. Creación de perfil mínimo**

**Objetivo:** recolectar sólo los datos esenciales para personalizar la experiencia, sin abrumar al usuario.

**Campos requeridos (mínimos):**



* **Nombre completo** (texto). \

* **Carrera** (lista desplegable: Matemáticas, Física, Biología, etc.). \

* **Intereses académicos** (multi-selección: física teórica, programación, ecología, etc.). \


**Flujo UX:**



1. Tras verificar correo → pantalla de bienvenida con formulario simple. \

2. Validaciones inmediatas (frontend + backend): \

    * Nombre ≥ 2 caracteres. \

    * Carrera obligatoria. \

    * Intereses opcionales (máx. 5). \

3. Guardado en DB en tabla `profiles`. \

4. Redirección automática al **feed** una vez completado. \


**Nota:** el perfil se mantiene **mínimo por diseño**; fotos y biografías extendidas se dejan fuera del MVP para mantener privacidad y simplicidad.


---


### **8.3. Navegación en el feed**

**Objetivo:** dar acceso rápido al contenido publicado por la comunidad, categorizado y filtrable.

**Estructura del feed:**



* Vista cronológica (orden descendente por fecha). \

* Cada ítem muestra: \

    * Nombre del autor (no email, solo perfil). \

    * Carrera (pequeño badge). \

    * Categoría (ej: Aviso, Académico, Actividad). \

    * Texto de la publicación. \

    * Acciones básicas (me gusta, comentar/reportar). \


**Funciones clave:**



* **Filtros persistentes: \
**
    * Barra superior con categorías seleccionables (ej: [✓ Académico] [ ] Avisos [✓ Actividades]). \

    * Preferencias guardadas en localStorage y en DB. \

* **Paginación: \
**
    * Scroll infinito con paginación por cursor (más eficiente que offset). \

* **Indicadores de estado: \
**
    * “No hay publicaciones en esta categoría” (estado vacío). \

    * Loader visible en scroll. \


**Privacidad:**



* Sólo usuarios verificados pueden ver el feed. \

* No se indexa en buscadores (robots.txt + headers). \



---


### **8.4. Publicación y categorización de contenido**

**Objetivo:** permitir a los usuarios aportar contenido de manera simple y estructurada.

**Flujo:**



1. **Botón “Nueva publicación”** accesible en feed. \

2. Modal o página con formulario: \

    * **Categoría** (dropdown obligatorio). \

    * **Texto** (textarea, máx. 500–1000 caracteres en MVP). \

    * (Opcional futuro: adjuntar archivo/imagen → no en MVP inicial). \

3. Validaciones: \

    * Texto no vacío, sin HTML, sanitizado en backend. \

    * Categoría válida. \

4. **Guardado en DB (tabla posts): \
**
    * `author_id`, `category_id`, `content`, timestamps. \

5. **Actualización del feed en tiempo real** (optimistic update o re-fetch). \


**Moderación temprana:**



* Botón “Reportar” visible en cada post. \

* Reporte enviado a tabla `reports` → accesible por moderadores. \



---


### **8.5. Interacción básica (me gusta, comentarios opcionales)**

**Objetivo:** fomentar interacción mínima entre usuarios sin convertir la plataforma en una red social tradicional.

**Funciones disponibles:**

**1. Me gusta (like):**



* Botón (icono de corazón o pulgar). \

* Toggle: si el usuario ya dio like, puede quitarlo. \

* Guardado en tabla `post_likes`. \

* Contador visible en cada post. \

* Feedback instantáneo (optimistic UI). \


**2. Comentarios (opcional en MVP):**



* Comentarios cortos (máx. 250 caracteres). \

* Estructura jerárquica simple (sin sub-respuestas). \

* Cada comentario con autor, timestamp, y botón de reportar. \

* Tabla `comments`: \

    * `id`, `post_id`, `author_id`, `content`, `created_at`. \

* Si se pospone para post-MVP: solo se implementa “likes” y reportes. \


**3. Reporte de publicaciones:**



* Acción secundaria en menú de cada post. \

* Usuario elige motivo (spam, offtopic, lenguaje inapropiado). \

* Enviado a `reports`, visible para moderadores. \



---


### **Resumen del flujo completo (MVP)**



1. Usuario entra → registra correo institucional → recibe enlace de verificación. \

2. Verifica → crea perfil mínimo (nombre, carrera, intereses). \

3. Accede al feed → ve publicaciones categorizadas → aplica filtros. \

4. Publica contenido → selecciona categoría → aparece en el feed. \

5. Interactúa con publicaciones → da “me gusta” → opcional: comenta → puede reportar. \


El flujo se diseña con la filosofía de:



* **Simplicidad primero. \
**
* **Privacidad garantizada. \
**
* **Interacción limitada pero suficiente para generar comunidad.**



### 9. Fases de desarrollo

Para que **fciencias.app** sea un espacio seguro, constructivo y alineado con los valores académicos de la Facultad de Ciencias, es necesario establecer desde el MVP un marco claro de **normas de convivencia y mecanismos de moderación**. Estas reglas son la base para mantener un ambiente sano y evitar la reproducción de dinámicas negativas de otras redes sociales.


---


### **9.1. Principios de convivencia**

**Objetivo:** establecer lineamientos generales de interacción respetuosa.

**Principios rectores:**



* **Respeto mutuo:** todos los usuarios deben dirigirse a los demás con cordialidad, sin ataques personales ni lenguaje ofensivo. \

* **Enfoque académico y comunitario:** las interacciones deben priorizar la colaboración, la resolución de dudas, la difusión de actividades y la construcción de comunidad. \

* **Inclusión y diversidad:** se prohíbe cualquier forma de discriminación por género, orientación sexual, etnia, ideología o condición social. \

* **Colaboración:** se promueve la ayuda entre pares (ej. resolver dudas, compartir recursos). \

* **Uso responsable:** el espacio no debe usarse para spam, autopromoción excesiva o actividades ajenas a la Facultad. \



---


### **9.2. Contenido permitido y no permitido**

**Contenido permitido (ejemplos):**



* Avisos académicos (clases, cambios de horario, seminarios, convocatorias). \

* Difusión de actividades culturales, deportivas o estudiantiles organizadas en la Facultad. \

* Recursos educativos (apuntes, materiales, enlaces a artículos, tutoriales). \

* Preguntas y respuestas académicas. \

* Publicaciones de grupos estudiantiles registrados. \


**Contenido no permitido:**



* Lenguaje ofensivo, insultos, discriminación o discursos de odio. \

* Spam, publicidad comercial externa o enlaces maliciosos. \

* Difusión de información falsa o engañosa. \

* Material ilegal, protegido por copyright sin permiso, o que infrinja reglamentos de la UNAM. \

* Publicaciones ajenas al ámbito académico y comunitario de la Facultad (ej. temas políticos externos, cadenas virales). \



---


### **9.3. Proceso de reporte y revisión**

**Mecanismo básico en el MVP:**



1. **Reporte por usuario: \
**
    * Cada publicación/comentario tendrá un botón “Reportar”. \

    * Se desplegará un menú con motivos (spam, lenguaje ofensivo, discriminación, contenido irrelevante, etc.). \

2. **Almacenamiento del reporte: \
**
    * Se guarda en tabla `reports` con: \

        * `report_id`, `post_id`/`comment_id`, `reporter_id`, motivo, timestamp. \

    * Estado inicial: “Pendiente”. \

3. **Revisión por moderadores: \
**
    * Panel simple donde moderadores pueden ver reportes. \

    * Opciones: “Aceptar (eliminar contenido)”, “Rechazar (injustificado)”, “Escalar a admin”. \

4. **Notificación al autor: \
**
    * Si se elimina contenido, se le notificará el motivo. \

    * En caso de reincidencia → suspensión temporal del perfil. \


**Criterios de decisión (en MVP):**



* 1–2 reportes justificados → eliminación del contenido. \

* Reincidencia (3+ reportes válidos en un mes) → suspensión automática (7 días). \



---


### **9.4. Rol de los moderadores y administradores**

**Moderadores (usuarios designados, ej. miembros de grupos estudiantiles o equipo de desarrollo):**



* Revisar reportes en el panel. \

* Eliminar contenido que viole reglas. \

* Suspender usuarios reincidentes (temporalmente). \

* Actuar bajo principios de neutralidad y transparencia. \


**Administradores (equipo central del proyecto):**



* Definir reglas y actualizarlas conforme evolucione la comunidad. \

* Resolver casos de apelación (ej. si un usuario considera injusta la sanción). \

* Restaurar contenido o cuentas en caso necesario. \

* Garantizar que las medidas de moderación respeten los principios de libertad académica de la UNAM. \


**Escalabilidad del sistema de moderación:**



* MVP: sistema manual con panel básico para revisiones. \

* Futuro: \

    * Moderación distribuida (usuarios con reputación alta pueden ayudar). \

    * Algoritmos simples para detectar spam o abuso. \

    * Integración con modelos de IA para detectar lenguaje inapropiado (fase avanzada). \



---

Con estas reglas mínimas, el MVP garantiza que el espacio sea **seguro, académico y de confianza**, sin requerir todavía un sistema complejo de gobernanza.




### 10. Métricas de éxito inicial

El éxito del MVP de **fciencias.app** no debe medirse por el volumen absoluto de usuarios, sino por **la validación temprana de la propuesta de valor**: comprobar que la comunidad encuentra útil la plataforma, la usa recurrentemente y la percibe como un espacio confiable.


---


### **10.1. Escenarios tras validación (escalar, ajustar, pausar)**

**Escenario 1: Escalar**



* Indicadores: \

    * ≥ 500 usuarios registrados en el primer semestre. \

    * ≥ 40% de usuarios activos semanales (WAU/MAU). \

    * Retroalimentación positiva (≥ 70% en encuestas internas de satisfacción). \

* Acción: expandir funcionalidades (ej. adjuntar archivos, eventos, búsqueda avanzada) y planear escalabilidad técnica. \


**Escenario 2: Ajustar**



* Indicadores: \

    * Registro inicial alto pero baja retención (&lt; 20% de usuarios activos después de un mes). \

    * Usuarios reportan confusión en interfaz o falta de utilidad. \

* Acción: revisar UX/UI, ajustar categorías, mejorar onboarding, simplificar publicaciones o reforzar el sistema de notificaciones. \


**Escenario 3: Pausar/repensar**



* Indicadores: \

    * Muy baja adopción (&lt; 100 usuarios en 6 meses). \

    * Alto rechazo de la comunidad (> 40% consideran que no es necesario). \

* Acción: detener inversión en nuevas features y reevaluar la pertinencia de la idea, posibles pivotes o integración con plataformas ya existentes. \



---


### **10.2. Recomendaciones para la versión 2.0**

Basado en métricas y feedback, la versión **2.0** debería enfocarse en:



* **Nuevas funcionalidades solicitadas por usuarios: \
**
    * Sistema de eventos con calendarios compartidos. \

    * Mensajería directa con controles de privacidad. \

    * Adjuntar materiales (PDF, imágenes de actividades). \

* **Mejora de interacción: \
**
    * Etiquetas temáticas (#tags). \

    * Recomendaciones personalizadas de publicaciones según intereses. \

* **Optimización de moderación: \
**
    * Herramientas para moderadores más eficientes (filtrado automático de spam). \

    * Moderación distribuida basada en reputación. \

* **Experiencia móvil optimizada: \
**
    * PWA (Progressive Web App) mejorada con notificaciones push. \

    * App ligera (Android/iOS) si hay demanda alta. \



---


### **10.3. Preparación para crecimiento y formalización**

**Escalabilidad técnica:**



* Migrar de un servidor único a infraestructura modular (contenedores Docker + Kubernetes si es necesario). \

* Balanceo de carga y caché en API para soportar miles de peticiones concurrentes. \

* Monitoreo de métricas técnicas (tiempos de respuesta, uptime). \


**Escalabilidad organizacional:**



* Formalizar roles de moderadores y administradores. \

* Integrar grupos estudiantiles como socios en la moderación y difusión. \

* Documentar políticas de uso y gobernanza. \


**Escalabilidad de comunidad:**



* Explorar integración con otras facultades de la UNAM (ej. Ciencias Políticas, Ingeniería) → crear instancias separadas o interconectadas. \

* Incluir features que sirvan a todos los niveles: estudiantes, profesores y grupos. \

* Establecer convenios con la Facultad para soporte institucional (reconocimiento oficial de la plataforma). \



---

Con estas métricas y planes, el proyecto podrá **medir el impacto real del MVP, tomar decisiones basadas en datos y sentar bases para crecer de manera sostenible**.



### 11. Posibilidades de escalabilidad

El diseño de **fciencias.app** debe contemplar, desde el MVP, la posibilidad de crecer en **alcance, funcionalidad, plataformas y sostenibilidad**, evitando bloqueos técnicos o organizacionales. La escalabilidad se entiende como la capacidad de la plataforma de adaptarse a un mayor número de usuarios, ampliar su propuesta de valor y mantenerse en el tiempo.


---


### **11.1. Expansión hacia otras facultades de la UNAM**



* **Modelo de replicación por instancias: \
**
    * Cada facultad podría tener su propia instancia de la plataforma (ej. *fingenieria.app*, *fpoliticas.app*), con identidad visual propia pero sobre la misma base tecnológica. \

    * Acceso restringido a correos institucionales de cada facultad. \

* **Modelo federado: \
**
    * Mantener nodos separados (por facultad) pero con posibilidad de interconexión controlada. \

    * Ejemplo: estudiantes de Ciencias pueden visualizar eventos de otras facultades si se habilitan permisos. \

* **Modelo centralizado: \
**
    * Una sola plataforma multi-facultad con validación de correo en diferentes dominios (ej. *@ciencias.unam.mx*, *@ingenieria.unam.mx*). \

    * Ventaja: menor mantenimiento técnico. \

    * Riesgo: pérdida de identidad comunitaria de cada facultad. \



---


### **11.2. Nuevas funcionalidades futuras (eventos, grupos, integración académica)**



* **Eventos y calendarios compartidos: \
**
    * Creación y difusión de actividades (seminarios, talleres, congresos). \

    * Sincronización con calendarios externos (Google Calendar, iCal). \

* **Grupos y proyectos estudiantiles: \
**
    * Espacios internos para equipos, sociedades estudiantiles, asociaciones. \

    * Funciones de colaboración: documentos compartidos, anuncios privados. \

* **Integración académica: \
**
    * Acceso a recursos digitales (repositorios de apuntes, materiales de clases). \

    * Integración futura con sistemas de la UNAM (SISEI, Moodle, correo institucional). \

    * APIs para conectar con proyectos académicos independientes (ej. bases de datos de seminarios). \

* **Moderación y reputación avanzada: \
**
    * Herramientas automáticas de detección de spam o contenido inapropiado. \

    * Sistema de reputación positiva para usuarios activos y confiables. \



---


### **11.3. Adaptación a dispositivos móviles y apps nativas**



* **Optimización PWA (Progressive Web App): \
**
    * Interfaz responsiva y ligera, accesible desde cualquier navegador. \

    * Notificaciones push para avisos urgentes (ej. cierre de aulas, eventos inmediatos). \

* **Aplicaciones móviles nativas (fase 2.0+): \
**
    * Desarrollo de apps para **Android** y **iOS** con experiencia optimizada. \

    * Acceso offline a publicaciones recientes. \

    * Integración con características del dispositivo (cámara para subir fotos de pizarrón, geolocalización para eventos). \

* **Estrategia BYOD (Bring Your Own Device): \
**
    * Garantizar compatibilidad con una amplia variedad de dispositivos, desde equipos de gama baja hasta los más actuales. \



---


### **11.4. Estrategia de sostenibilidad a largo plazo**



* **Modelo de gobernanza comunitaria: \
**
    * Consejo de estudiantes, profesores y representantes que decidan evoluciones clave. \

    * Moderación distribuida y basada en reglas claras. \

* **Modelo de financiamiento sostenible: \
**
    * Opción 1: financiamiento institucional (apoyo de la Facultad/UNAM). \

    * Opción 2: contribuciones voluntarias de usuarios o asociaciones estudiantiles. \

    * Opción 3: proyectos vinculados con fondos de innovación universitaria. \

    * (Se evita explícitamente monetización por publicidad o venta de datos). \

* **Evolución tecnológica: \
**
    * Mantener la base en software open source para reducir costos de licenciamiento. \

    * Documentación y estandarización para facilitar la continuidad del proyecto si cambian los responsables. \

* **Visión a futuro: \
**
    * Convertirse en un ecosistema académico digital de la UNAM. \

    * Extenderse a posgrados, egresados y colaboradores externos de investigación. \



---

Con esto, **fciencias.app** asegura que su MVP no sea un producto aislado, sino una **semilla escalable y sostenible**, capaz de crecer en funcionalidades, alcance institucional y soporte comunitario sin perder su esencia académica.





### 12. Conclusión

La construcción del MVP de **fciencias.app** representa un primer paso estratégico hacia la creación de un espacio digital especializado para la comunidad de la Facultad de Ciencias de la UNAM.

El análisis realizado muestra que existe una necesidad clara de **centralizar la comunicación, reducir la dispersión en plataformas externas y fortalecer la identidad académica**, todo bajo un marco seguro, confiable y adaptado a las dinámicas propias de la Facultad.

La propuesta planteada es **realista, técnica y operativamente viable**, con un enfoque modular que permite validar hipótesis iniciales, incorporar retroalimentación temprana y preparar el camino hacia una escalabilidad futura dentro y fuera de la Facultad.


---


### **12.1. Resumen del MVP propuesto**

El **MVP de fciencias.app** se define por los siguientes elementos clave:



* **Autenticación exclusiva** con correos *@ciencias.unam.mx*. \

* **Perfiles mínimos** con nombre, carrera e intereses básicos. \

* **Publicaciones categorizadas**, enfocadas en temas académicos, avisos y actividades estudiantiles. \

* **Feed filtrable y personalizable**, garantizando relevancia y reducción del ruido digital. \

* **Interacciones básicas** (me gusta, comentarios opcionales) para fomentar participación sin sobrecargar el sistema. \

* **Arquitectura open source** con tecnologías modernas y escalables (frontend en React/Next.js, backend en Node.js, base de datos PostgreSQL, despliegue en infraestructura en la nube con contenedores). \

* **Moderación comunitaria** bajo reglas claras y procesos de reporte simples. \


Este conjunto balancea simplicidad con valor agregado, asegurando que el primer prototipo sea útil y validable en un periodo corto de tiempo.


---


### **12.2. Próximos pasos inmediatos**



1. **Validación con usuarios iniciales: \
**
    * Aplicar encuestas y entrevistas a estudiantes y profesores. \

    * Identificar prioridades y posibles ajustes al MVP. \

2. **Desarrollo del prototipo funcional: \
**
    * Implementación de autenticación y feed básico. \

    * Diseño responsivo inicial como PWA. \

3. **Prueba piloto controlada: \
**
    * Lanzamiento con un grupo reducido de estudiantes y grupos estudiantiles. \

    * Monitoreo de métricas de uso y satisfacción. \

4. **Iteración y mejoras rápidas: \
**
    * Ajustar experiencia de usuario (UX/UI). \

    * Refinar moderación y categorización. \

5. **Escalamiento progresivo: \
**
    * Abrir acceso al resto de la Facultad tras validar estabilidad. \

    * Definir la estrategia de crecimiento hacia nuevas funcionalidades y facultades. \



---

Con esta conclusión, se establece que el proyecto no solo es una idea viable, sino una **iniciativa estratégica de transformación digital académica**, diseñada para crecer de manera orgánica y sostenible desde un MVP bien definido.
