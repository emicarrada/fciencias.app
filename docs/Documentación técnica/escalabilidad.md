

### 12. Escalabilidad y Futuras Extensiones

El sistema *Fciencias* está diseñado con un enfoque de crecimiento progresivo, tanto en funcionalidades como en capacidad técnica. Esta sección establece el plan de evolución, el roadmap de implementación y las estrategias de optimización que permitirán garantizar su sostenibilidad en el tiempo.


---


## **12.1. Plan para nuevas funcionalidades**

Se identifican mejoras y ampliaciones que fortalecen el valor del sistema:



* **Funcionalidades académicas adicionales \
**
    * Integración con el sistema oficial de inscripciones de la UNAM. \

    * Gestión de calificaciones, horarios y asesorías. \

    * Calendario académico unificado. \

* **Funcionalidades sociales \
**
    * Foros de discusión entre estudiantes. \

    * Creación de grupos de estudio. \

    * Notificaciones en tiempo real (WebSockets / Push Notifications). \

* **Extensiones de usabilidad \
**
    * App móvil nativa (React Native o Flutter). \

    * Búsqueda avanzada con filtros múltiples. \

    * Accesibilidad WCAG 2.1 para personas con discapacidad. \

* **Analítica y reportes \
**
    * Estadísticas de participación en grupos/eventos. \

    * Dashboards personalizados para docentes y administradores. \



---


## **12.2. Roadmap técnico**

**Corto plazo (0–6 meses):**



* Finalización del MVP y puesta en producción controlada. \

* Ajustes de rendimiento en base a retroalimentación inicial. \

* Implementación de monitoreo avanzado (Grafana, Sentry). \

* Pruebas de carga para validar escalabilidad. \


**Mediano plazo (6–12 meses):**



* Integración con servicios institucionales (correo UNAM, inscripciones). \

* Despliegue de aplicación móvil. \

* Nuevos módulos de interacción social (foros, mensajería básica). \

* Autenticación federada (OAuth con cuentas institucionales). \


**Largo plazo (12–24 meses):**



* Migración hacia arquitectura de microservicios. \

* Integración con servicios de IA (recomendación de grupos, análisis de patrones de estudio). \

* Escalado horizontal automático en Kubernetes. \

* Internacionalización del sistema (traducciones e intercambio académico). \



---


## **12.3. Estrategias de optimización**



* **Optimización de rendimiento \
**
    * Uso de *caching* (Redis) para reducir latencia en consultas frecuentes. \

    * Compresión y minificación de recursos estáticos (frontend). \

    * Implementación de CDN para distribución de contenido. \

* **Optimización de la base de datos \
**
    * Índices en tablas críticas (usuarios, grupos, inscripciones). \

    * Particionamiento de tablas de gran volumen. \

    * Políticas de archivado para datos históricos. \

* **Escalabilidad técnica \
**
    * Balanceadores de carga (NGINX/HAProxy). \

    * Autoescalado de contenedores en Kubernetes. \

    * Estrategia híbrida de escalado: horizontal (réplicas) y vertical (recursos). \

* **Mantenibilidad y calidad \
**
    * Refactorización progresiva hacia microservicios. \

    * Revisión de dependencias para evitar vulnerabilidades. \

    * Automatización de pruebas de regresión en CI/CD. \
