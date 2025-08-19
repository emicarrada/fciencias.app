

### 10. Pruebas y Calidad

La calidad del sistema *Fciencias* se asegura a través de una estrategia integral de pruebas que cubre todos los niveles de validación: desde las funciones individuales hasta la interacción de los módulos completos en un entorno similar a producción. El objetivo es garantizar un software confiable, robusto y mantenible.


---


## **10.1. Estrategia de pruebas**



* **Pruebas unitarias \
**
    * Validan funciones, controladores y servicios aislados. \

    * Cobertura de lógica de negocio crítica (ej: validación de credenciales, creación de grupos, inscripciones). \

    * Ejecutadas automáticamente en cada *commit* mediante CI. \

* **Pruebas de integración \
**
    * Verifican la interacción entre frontend, backend y base de datos. \

    * Casos de uso clave: \

        * Autenticación completa (login + refresh token). \

        * Flujo de inscripción en cursos/grupos. \

        * Comunicación con servicios externos (correo, almacenamiento). \

* **Pruebas end-to-end (E2E) \
**
    * Simulan la experiencia real del usuario. \

    * Automatización de escenarios críticos: \

        * Registro de usuario nuevo. \

        * Acceso a un recurso protegido. \

        * Creación y visualización de eventos. \

    * Ejecución en entornos controlados (staging). \

* **Pruebas manuales / exploratorias \
**
    * Complementan la automatización. \

    * Útiles para validar experiencia de usuario y diseño visual. \



---


## **10.2. Cobertura de pruebas**



* Cobertura mínima exigida: \

    * **80% en backend** (servicios, controladores y modelos). \

    * **70% en frontend** (componentes principales de UI). \

* Áreas críticas con **100% de cobertura**: \

    * Autenticación y autorización. \

    * Manejo de contraseñas y datos sensibles. \

    * Operaciones de escritura en la base de datos. \



---


## **10.3. Herramientas utilizadas**



* **Backend \
**
    * **Jest** (framework principal de pruebas unitarias e integración). \

    * **Supertest** (para pruebas de endpoints REST). \

* **Frontend \
**
    * **Jest + React Testing Library** (pruebas unitarias y de componentes). \

    * **Cypress** (end-to-end tests). \

* **Automatización y CI/CD \
**
    * **GitHub Actions**: ejecución de pruebas en cada push y pull request. \

    * **Coverage reports**: generación automática de reportes de cobertura. \

* **Calidad de código estática \
**
    * **ESLint + Prettier** (estilo y buenas prácticas). \

    * **SonarQube** (detección de vulnerabilidades y *code smells*). \



---


## **10.4. Resultados esperados**



* **Confiabilidad**: reducir al mínimo la cantidad de errores en producción. \

* **Mantenibilidad**: facilitar la evolución del sistema sin introducir regresiones. \

* **Escalabilidad segura**: validar que el sistema soporta nuevas funcionalidades sin comprometer estabilidad. \

* **Experiencia del usuario consistente**: los escenarios más importantes funcionan de forma estable en todos los navegadores y dispositivos soportados. \

* **Cumplimiento de estándares**: métricas de calidad alineadas con prácticas recomendadas (ej. OWASP, ISO/IEC 25010).