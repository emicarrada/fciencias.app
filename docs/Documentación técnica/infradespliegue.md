

### 7. Infraestructura y Despliegue


## **7.1. Entorno de desarrollo (configuración local)**

**Prerequisitions**



* Node.js LTS (≥ 20.x), pnpm o npm \

* Docker & Docker Compose \

* Git, Make (opcional), VS Code (recomendado) \


**Estructura de variables (.env)**



* `./frontend/.env.local \
`
* `./backend/.env.development \
`
* `./ops/.env` (para compose)

**Ejemplos**

**# backend/.env.development**

**NODE_ENV=development**

**PORT=4000**

**DATABASE_URL=postgresql://fciencias:fciencias@postgres:5432/fciencias_dev**

**JWT_SECRET=dev_please_change_me**

**REFRESH_TOKEN_TTL_DAYS=30**

**MAIL_FROM="no-reply@fciencias.mx"**

**MAIL_HOST=mailhog**

**MAIL_PORT=1025**

**STORAGE_ENDPOINT=http://minio:9000**

**STORAGE_BUCKET=fciencias-dev**

**STORAGE_ACCESS_KEY=devaccess**

**STORAGE_SECRET_KEY=devsecret**

**bash**

**Copiar**

**Editar**

**# frontend/.env.local**

**NEXT_PUBLIC_API_BASE=http://localhost:4000/api/v1**

**NEXT_PUBLIC_ENV=development**

**Docker Compose (dev)**

# ops/docker-compose.dev.yml

version: "3.9"

services:

  postgres:

    image: postgres:16

    environment:

      POSTGRES_USER: fciencias

      POSTGRES_PASSWORD: fciencias

      POSTGRES_DB: fciencias_dev

    ports: ["5432:5432"]

    volumes:

      - pgdata_dev:/var/lib/postgresql/data

  pgadmin:

    image: dpage/pgadmin4

    environment:

      PGADMIN_DEFAULT_EMAIL: admin@local

      PGADMIN_DEFAULT_PASSWORD: admin

    ports: ["5050:80"]

  mailhog:

    image: mailhog/mailhog

    ports: ["1025:1025", "8025:8025"]

  minio:

    image: minio/minio

    command: server /data --console-address ":9001"

    environment:

      MINIO_ROOT_USER: devaccess

      MINIO_ROOT_PASSWORD: devsecret

    ports: ["9000:9000","9001:9001"]

    volumes:

      - minio_dev:/data

  backend:

    build: ../backend

    env_file: ../backend/.env.development

    ports: ["4000:4000"]

    depends_on: [postgres, mailhog, minio]

    volumes: ["../backend:/app", "/app/node_modules"]

  frontend:

    build: ../frontend

    env_file: ../frontend/.env.local

    ports: ["3000:3000"]

    depends_on: [backend]

    volumes: ["../frontend:/app", "/app/node_modules"]

volumes:

  pgdata_dev: {}

  minio_dev: {}

**Bootstrap local**

# 1) Levantar servicios

docker compose -f ops/docker-compose.dev.yml up -d

# 2) Instalar deps y preparar DB

cd backend && pnpm i

pnpm prisma migrate dev --name init

pnpm prisma db seed

# 3) Backend en modo watch

pnpm start:dev

# 4) Frontend

cd ../frontend && pnpm i && pnpm dev

**Datos de prueba**



* Usuario admin: `admin@fciencias.mx` / `Admin123! \
`
* Usuario estándar: `user@fciencias.mx` / `User123! \
` (Generados por el script `prisma/seed.ts`) \


**Debug**



* VS Code: `launch.json` con attach a Node (puerto 9229). \

* Mailhog UI:[ http://localhost:8025 \
](http://localhost:8025)
* MinIO Console:[ http://localhost:9001 \
](http://localhost:9001)


---


## **7.2. Entorno de pruebas y producción**

**Topología**



* **Staging (preproducción):** réplicas realistas con datos sintéticos; dominio `staging.fciencias.mx`. \

* **Producción:** dominio `app.fciencias.mx` y `api.fciencias.mx`. \


**Servicios gestionados (recomendado)**



* **PostgreSQL gestionado** (Neon/Supabase/RDS). \

    * Pooling: **PgBouncer** (session/transaction). \

    * Backups + PITR (ver §6.4). \

* **Almacenamiento S3-compatible** (AWS S3/MinIO gestionado). \

* **Correo transaccional** (SendGrid/Mailgun). \

* **CDN** para estáticos del frontend e imágenes (CloudFront/Fastly/Cloudflare). \


**Configuración clave**



* **Front:** Next.js con modo **SSR/ISR** y caché en CDN. \

* **Back:** contenedor stateless (12-factor), salud (`/healthz`, `/readyz`), logs JSON a STDOUT. \

* **Secrets:** gestor de secretos (AWS Secrets Manager/SSM o Doppler). \

* **Red:** HTTPS forzado, HTTP/2, HSTS, WAF (si aplica). \

* **Observabilidad: \
**
    * **Logs**: formato JSON (nivel, mensaje, requestId, userId, latencyMs). \

    * **Métricas**: Prometheus (latencias P50/P95/P99, tasa de error, throughput). \

    * **Trazas**: OpenTelemetry → collector → backend (Tempo/Jaeger). \

    * **Alertas**: SLOs (p. ej., error rate > 1% en 5 min, P95 > 500 ms). \


**Estrategia de datos**



* Migraciones **Prisma** en despliegue (`prisma migrate deploy`). \

* Semillas **solo** en dev/staging. \

* Read-replica opcional para cargas de lectura (listados públicos). \



---


## **7.3. Integración continua y despliegue (CI/CD)**

**Estrategia de ramas**



* **Trunk-based**: `main` estable; ramas cortas `feat/*`, `fix/*`. \

* **PRs obligatorios**, revisiones + checks verdes. \

* **Conventional Commits** → **SemVer** + CHANGELOG automático. \


**Checks mínimos**



1. Lint & Formato: `eslint`, `prettier --check \
`
2. Type-check: `tsc --noEmit \
`
3. Pruebas unitarias: `jest --coverage \
`
4. Pruebas e2e (staging): `cypress run` o Playwright \

5. Build: `pnpm build` en front y back \

6. Seguridad: `npm audit --production`, **Trivy** a imágenes \

7. Migraciones: `prisma migrate diff` (dry-run) \


**Despliegues**



* **Preview** en PR (Vercel para frontend; entorno efímero para backend). \

* **Staging** en merge a `main` (automático). \

* **Producción** con **aprobación manual** (manual gate) y **blue/green** o **canary**. \


**Ejemplo GitHub Actions (resumido)**

name: ci-cd

on:

  pull_request:

  push:

    branches: [main]

jobs:

  ci:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

        with: { version: 9 }

      - uses: actions/setup-node@v4

        with: { node-version: 20, cache: 'pnpm' }

      - name: Install deps

        run: pnpm i --frozen-lockfile

      - name: Lint & Typecheck

        run: |

          pnpm -C frontend lint && pnpm -C frontend typecheck

          pnpm -C backend lint && pnpm -C backend typecheck

      - name: Unit tests

        run: |

          pnpm -C backend test:ci

          pnpm -C frontend test:ci

      - name: Build

        run: |

          pnpm -C backend build

          pnpm -C frontend build

  build_and_push_images:

    needs: ci

    if: github.ref == 'refs/heads/main'

    runs-on: ubuntu-latest

    permissions: { contents: read, packages: write }

    steps:

      - uses: actions/checkout@v4

      - name: Log in to GHCR

        uses: docker/login-action@v3

        with:

          registry: ghcr.io

          username: ${{ github.actor }}

          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & push backend

        uses: docker/build-push-action@v6

        with:

          context: ./backend

          tags: ghcr.io/org/fciencias-backend:latest

          push: true

      - name: Build & push frontend

        uses: docker/build-push-action@v6

        with:

          context: ./frontend

          tags: ghcr.io/org/fciencias-frontend:latest

          push: true

  deploy_staging:

    needs: build_and_push_images

    runs-on: ubuntu-latest

    steps:

      - name: Migrate DB

        run: prisma migrate deploy

        env:

          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}

      - name: Deploy backend (staging)

        run: ./ops/deploy_backend.sh staging

      - name: Deploy frontend (staging)

        run: ./ops/deploy_frontend.sh staging

  deploy_prod:

    needs: deploy_staging

    runs-on: ubuntu-latest

    environment:

      name: production

      url: https://app.fciencias.mx

    steps:

      - name: Manual approval

        uses: trstringer/manual-approval@v1

        with:

          secret: ${{ secrets.GITHUB_TOKEN }}

          approvers: "fciencias-admin"

      - name: DB backup pre-deploy

        run: ./ops/db_backup.sh

      - name: Migrate DB (prod)

        run: prisma migrate deploy

        env:

          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}

      - name: Canary 10%

        run: ./ops/canary_rollout.sh 10

      - name: Promote 100%

        run: ./ops/canary_promote.sh

**Zero-downtime tips**



* Health checks y **graceful shutdown** (SIGTERM → cerrar server tras completar requests). \

* Migraciones **compatibles hacia atrás** (primero añadir columnas, después escribir/leer dual, por último limpiar). \

* **Sticky sessions** no necesarias (JWT); aprovisionar pool DB acorde a réplicas. \



---


## **7.4. Escalabilidad y manejo de carga**

**Objetivos iniciales (MVP)**



* ~5,000 MAU, P95 &lt; 500 ms en vistas clave, error rate &lt; 1%. \


**Estrategias**



1. **Stateless + Horizontal scaling \
**
    * Backend sin estado; escalar réplicas detrás de un balanceador (Nginx/ALB). \

    * **Readiness/Liveness**: `/readyz` (conexión DB, S3) y `/healthz`. \

    * **Autoscaling** por CPU/latencia/cola de peticiones. \

2. **Base de datos \
**
    * Índices críticos (ver §6.2). \

    * **Pool** de conexiones ajustado (p. ej., 8–12 por pod) + **PgBouncer**. \

    * Réplica de lectura para listados públicos. \

    * Transacciones cortas; paginación basada en cursores. \

3. **Caching \
**
    * **CDN** para estáticos e imágenes. \

    * **HTTP caching** (`ETag`, `Cache-Control`) en endpoints públicos (anuncios/eventos). \

    * **Redis** (opcional) para caché de consultas calientes y rate limiting. \

4. **Colas y trabajos en background** (roadmap) \

    * BullMQ/Redis para envíos de correo masivos, notificaciones, generación de CSV/ICS. \

    * Retries exponenciales y **dead-letter queue**. \

5. **Optimización de red \
**
    * Compresión gzip/brotli, HTTP/2, keep-alive. \

    * Minimizar payloads (selección de campos, **DTOs**). \

    * Subida de archivos **directa** a S3 con **presigned URLs**. \

6. **Resiliencia \
**
    * **Rate limiting** por IP/usuario (p. ej., 100 req/15min). \

    * **Circuit breakers** para dependencias externas (correo/S3). \

    * **Timeouts** y **budgets** de tiempo (p. ej., 2–5 s). \

    * **Retry** con jitter solo en operaciones idempotentes. \

7. **Seguridad en escala \
**
    * WAF/CDN (bots, DDoS básico). \

    * Rotación de secretos; escaneo de imágenes (Trivy) y deps (Dependabot). \

8. **Pruebas de carga**

# k6 (ejemplo básico)

k6 run - &lt;<'EOF'

import http from 'k6/http';

import { sleep } from 'k6';

export let options = {

  vus: 50,

  duration: '2m',

  thresholds: {

    http_req_failed: ['rate&lt;0.01'],

    http_req_duration: ['p(95)&lt;500'],

  },

};

export default function () {

  http.get('https://staging.api.fciencias.mx/api/v1/announcements?limit=20');

  sleep(1);

}

EOF



1. **Observabilidad orientada a SLO \
**
    * Tablero con **latencia P50/P95/P99**, **tasa de error**, **RPS**, **saturación** (CPU/memoria). \

    * Alertas por **error budget** consumido (modelo SRE). \

2. **Manejo de picos \
**
* Incrementar réplicas + **burst** de caché en Redis. \

* Activar **cola** para tareas costosas. \

* Ampliar **pool** de DB temporalmente y/o usar réplica de lectura. \



---


### **Runbooks (resumen)**



* **Degradación de latencia:** revisar métricas → cache hit ratio → réplicas backend → índices DB. \

* **Errores 5xx crecientes:** inspección logs por requestId → circuit breaker → rollback canario. \

* **Pool DB agotado:** bajar concurrency por pod, subir pgbouncer, auditar N+1. \

* **CDN fallando:** bypass temporal (origen directo) + cache in-app.