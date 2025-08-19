

### 6. Base de Datos


## **6.1. Modelo Entidad–Relación (MER)**


## **Modelo Entidad–Relación (MER)**

(Ver mejor en Google Drive)


## **6.2. Modelo lógico de tablas (PostgreSQL sugerido)**

Tipos base: `uuid` (PK/FK), `text`/`varchar`, `timestamptz`, `int4`, `boolean`, `jsonb`, `inet`.


```


### users

```



* `id uuid PK DEFAULT gen_random_uuid() \
`
* `email text NOT NULL UNIQUE \
`
* `password_hash text NOT NULL \
`
* `display_name text NOT NULL \
`
* `is_active boolean NOT NULL DEFAULT true \
`
* `created_at timestamptz NOT NULL DEFAULT now() \
`
* `updated_at timestamptz NOT NULL DEFAULT now() \
`
* **Índices:** `idx_users_email_lower (lower(email))` para búsquedas case-insensitive. \

* **Checks:** `length(password_hash) > 20 \
`


```


### roles

```



* `id smallint PK` (1=admin, 2=moderator, 3=staff, 4=teacher, 5=student, 6=guest) \

* `name text UNIQUE NOT NULL \
`
* `description text \
`


```


### user_roles

```



* `user_id uuid FK -> users(id) ON DELETE CASCADE \
`
* `role_id smallint FK -> roles(id) ON DELETE RESTRICT \
`
* `granted_at timestamptz DEFAULT now() \
`
* `PRIMARY KEY (user_id, role_id) \
`


```


### announcements

```



* `id uuid PK \
`
* `author_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `title text NOT NULL \
`
* `body text NOT NULL \
`
* `status announcement_status NOT NULL DEFAULT 'draft'` *(ENUM) \
*
* `publish_at timestamptz \
`
* `created_at timestamptz DEFAULT now() \
`
* `updated_at timestamptz DEFAULT now() \
`
* `is_deleted boolean DEFAULT false \
`
* **Índices:** `idx_ann_status_publish_at(status, publish_at DESC)`, `idx_ann_author(author_id)`, `idx_ann_fulltext` (GIN sobre `to_tsvector('spanish', title || ' ' || body)`). \



```


### comments

```



* `id uuid PK \
`
* `announcement_id uuid FK -> announcements(id) ON DELETE CASCADE \
`
* `author_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `body text NOT NULL \
`
* `created_at timestamptz DEFAULT now() \
`
* `is_hidden boolean DEFAULT false \
`
* **Índices:** `idx_comments_announcement(created_at DESC, announcement_id) \
`


```


### reactions

```



* `id uuid PK \
`
* `announcement_id uuid FK -> announcements(id) ON DELETE CASCADE \
`
* `user_id uuid FK -> users(id) ON DELETE CASCADE \
`
* `kind reaction_kind NOT NULL` *(ENUM) \
*
* `created_at timestamptz DEFAULT now() \
`
* `UNIQUE (announcement_id, user_id, kind) \
`


```


### events

```



* `id uuid PK \
`
* `organizer_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `title text NOT NULL \
`
* `description text \
`
* `starts_at timestamptz NOT NULL \
`
* `ends_at timestamptz NOT NULL \
`
* `location text \
`
* `capacity int4 \
`
* `requires_registration boolean DEFAULT false \
`
* `created_at timestamptz DEFAULT now() \
`
* `updated_at timestamptz DEFAULT now() \
`
* `is_canceled boolean DEFAULT false \
`
* **Checks:** `ends_at > starts_at`, `capacity IS NULL OR capacity >= 0 \
`
* **Índices:** `idx_events_time (starts_at, ends_at)`, `idx_events_org (organizer_id) \
`


```


### event_registrations

```



* `id uuid PK \
`
* `event_id uuid FK -> events(id) ON DELETE CASCADE \
`
* `user_id uuid FK -> users(id) ON DELETE CASCADE \
`
* `registered_at timestamptz DEFAULT now() \
`
* `status registration_status NOT NULL DEFAULT 'registered'` *(ENUM) \
*
* `UNIQUE (event_id, user_id) \
`
* **Índices:** `idx_event_reg_status (event_id, status) \
`


```


### communities

```



* `id uuid PK \
`
* `owner_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `name text NOT NULL \
`
* `description text \
`
* `visibility community_visibility NOT NULL DEFAULT 'public'` *(ENUM) \
*
* `status community_status NOT NULL DEFAULT 'pending'` *(ENUM) \
*
* `created_at timestamptz DEFAULT now() \
`
* `updated_at timestamptz DEFAULT now() \
`
* **Índices:** `UNIQUE (lower(name))`, `idx_comm_owner (owner_id) \
`


```


### community_members

```



* `id uuid PK \
`
* `community_id uuid FK -> communities(id) ON DELETE CASCADE \
`
* `user_id uuid FK -> users(id) ON DELETE CASCADE \
`
* `role community_member_role NOT NULL DEFAULT 'member'` *(ENUM) \
*
* `joined_at timestamptz DEFAULT now() \
`
* `UNIQUE (community_id, user_id) \
`


```


### reports

```



* `id uuid PK \
`
* `reporter_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `moderator_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `announcement_id uuid FK -> announcements(id) ON DELETE CASCADE \
`
* `comment_id uuid FK -> comments(id) ON DELETE CASCADE \
`
* `event_id uuid FK -> events(id) ON DELETE CASCADE \
`
* `reason text NOT NULL \
`
* `status report_status NOT NULL DEFAULT 'open'` *(ENUM) \
*
* `created_at timestamptz DEFAULT now() \
`
* `updated_at timestamptz DEFAULT now() \
`
* **Checks:** al menos **uno** de `{announcement_id, comment_id, event_id}` NOT NULL. \

* **Índices:** `idx_reports_status(status)`, `idx_reports_created(created_at DESC) \
`


```


### notifications

```



* `id uuid PK \
`
* `user_id uuid FK -> users(id) ON DELETE CASCADE \
`
* `type text NOT NULL \
`
* `payload jsonb NOT NULL \
`
* `read boolean DEFAULT false \
`
* `created_at timestamptz DEFAULT now() \
`
* **Índices:** `idx_notif_user_read (user_id, read, created_at DESC)`, `GIN (payload) \
`


```


### refresh_tokens

```



* `id uuid PK \
`
* `user_id uuid FK -> users(id) ON DELETE CASCADE \
`
* `token_hash text NOT NULL \
`
* `expires_at timestamptz NOT NULL \
`
* `user_agent text \
`
* `ip inet \
`
* `revoked boolean DEFAULT false \
`
* `created_at timestamptz DEFAULT now() \
`
* `UNIQUE (user_id, token_hash) \
`
* **Índices:** `idx_tokens_expires (expires_at) \
`


```


### audit_logs

```



* `id uuid PK \
`
* `user_id uuid FK -> users(id) ON DELETE SET NULL \
`
* `action text NOT NULL` *(e.g., "LOGIN", "ANNOUNCEMENT_UPDATE") \
*
* `entity text NOT NULL \
`
* `entity_id uuid \
`
* `metadata jsonb \
`
* `created_at timestamptz DEFAULT now() \
`
* **Índices:** `idx_audit_entity (entity, entity_id)`, `idx_audit_created (created_at DESC) \
`

**Enumeraciones sugeridas**


## **6.3. Políticas de integridad y consistencia**

**Referencial**



* **FKs con acciones claras: \
**
    * `ON DELETE CASCADE` cuando el hijo no tiene sentido sin el padre (p. ej., `comments`, `reactions`, `event_registrations`). \

    * `ON DELETE SET NULL` cuando conviene preservar el registro por auditoría (autor borrado pero anuncio permanece). \

    * `ON DELETE RESTRICT` en catálogos (`roles`). \


**Unicidad y validaciones**



* Correos únicos (`users.email`). \

* Un solo registro por usuario/evento (`event_registrations`). \

* Reacción única por usuario–anuncio–tipo (`reactions`). \

* Nombres de comunidad únicos en minúsculas (`UNIQUE (lower(name))`). \

* `CHECK` para tiempos de eventos (`ends_at > starts_at`) y capacidades no negativas. \


**Integridad de negocio**



* **Comentarios sólo en anuncios visibles o propios (si moderados). \
**
* **Capacidad de evento:** trigger que impide `registered` si `count(registrations where status='registered') >= capacity` (permite `waitlist`). \

* **Reports:** trigger que obliga exactamente **un** target (`announcement_id XOR comment_id XOR event_id`). \


**Consistencia transaccional**



* **Transacciones atómicas** en operaciones compuestas (crear anuncio + notificar + auditar). \

* Nivel de aislamiento **READ COMMITTED** por defecto; subir a **REPEATABLE READ** en procesos críticos (cupo de eventos). \

* **Optimistic locking**: columna `updated_at`/`version` en tablas de alta concurrencia (anuncios/eventos) para evitar pisar cambios (comparar en `WHERE updated_at = $prev`). \


**Índices y performance**



* Índices GIN para **búsqueda full-text** en anuncios. \

* Índices compuestos para filtros habituales (`status + fecha`, `user + read`). \

* Mantenimiento con `VACUUM (AUTO)` y `ANALYZE` habilitados; revisar `fillfactor` en tablas de alta escritura. \


**Auditoría y trazabilidad**



* `audit_logs` para operaciones sensibles (cambios de rol, ocultar contenido, resolver reportes). \

* Almacenar IP/User-Agent en `refresh_tokens` (fraude/detección de anomalías). \


**Privacidad**



* Minimización de datos personales; `password_hash` con **Argon2id**; no almacenar tokens en claro (guardar **hash**). \

* Retención: políticas en 6.4. \



---


## **6.4. Estrategia de respaldo y recuperación**

**Objetivos**



* **RPO (Recovery Point Objective):** ≤ 15 minutos. \

* **RTO (Recovery Time Objective):** ≤ 1 hora para restaurar servicio básico del MVP. \


**Mecánica (PostgreSQL)**



1. **Backups completos** (`pg_basebackup` o snapshot de volumen) **diarios** fuera de horario pico. \

2. **PITR (Point-in-Time Recovery)** habilitando **WAL archiving**: \

    * Archive cada 5–10 minutos a un almacenamiento de objetos (S3-compatible) con versionado. \

3. **Backups incrementales** (deltas vía snapshots de almacenamiento si el proveedor lo permite). \

4. **Cifrado \
**
    * En tránsito (TLS) y **en reposo** (KMS del proveedor). \

    * Claves rotadas cada 90 días. \

5. **Retención \
**
    * Diarios: 14 días. \

    * Semanales (full): 8 semanas. \

    * Mensuales (full): 6 meses. \

    * Cumplir con políticas institucionales de datos personales (borrado a solicitud). \

6. **Pruebas de restauración \
**
    * **Ensayo mensual**: restaurar en un entorno aislado hasta un timestamp aleatorio (PITR) y correr smoke tests. \

    * Verificar integridad (checksums, conteos de filas esperados). \

7. **Runbooks** (operativos) \

    * **Incidente de pérdida parcial:** ejecutar PITR a última marca estable; redirigir tráfico con variable de conexión. \

    * **Corrupción lógica (p. ej., borrado masivo):** identificar timestamp previo, restaurar a nuevo cluster y **re-reproducir** cambios legítimos si aplica. \

    * **Rotura de schema/migración fallida:** estrategia **blue/green** de BD o migraciones **reversibles** (down scripts). \

8. **Alta disponibilidad (opcional roadmap) \
**
    * Réplica en caliente (streaming) `primary -> replica` con `synchronous_commit = remote_write` para lecturas y failover manual. \

    * Monitorización de lag de réplica y alertas. \


**Backups de archivos adjuntos**



* Si hay imágenes/documentos en almacenamiento S3-compatible: \

    * **Versioning + Lifecycle** (transición a almacenamiento frío después de 30 días). \

    * Replicación cruzada opcional (a otra región). \

    * Inventario semanal y verificación de integridad (ETag). \


**Políticas de borrado**



* **Soft delete** (`is_deleted`) para `announcements` y `comments` (reversible por moderación). \

* **Hard delete** de PII bajo solicitud del titular, preservando auditoría **anonimizada** (reemplazar `user_id` por `NULL` y conservar `audit_logs` sin PII).