# fciencias.app

fciencias.app es una red social académica y colaborativa creada por y para estudiantes de la Facultad de Ciencias de la UNAM. Es una plataforma que organiza la vida universitaria en un solo lugar: apuntes, comunicación entre compañeros, reseñas de profesores, eventos estudiantiles, foros por materia y más.

## 🚀 Desarrollo Rápido

### Configuración Inicial (Solo primera vez)

```bash
# Clonar y configurar el proyecto
make setup
```

### Desarrollo Diario

```bash
# Iniciar servicios de desarrollo
make dev

# En otra terminal - Iniciar backend
make dev-backend

# En otra terminal - Iniciar frontend  
make dev-frontend
```

### URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Documentación API**: http://localhost:4000/docs
- **Base de Datos (PGAdmin)**: http://localhost:5050
- **Email Testing (MailHog)**: http://localhost:8025
- **File Storage (MinIO)**: http://localhost:9001

## 📁 Estructura del Proyecto

```
fciencias.app/
├── backend/                 # API Backend (NestJS + Prisma + PostgreSQL)
├── frontend/               # Frontend Web (Next.js + TailwindCSS)
├── ops/                    # Configuración de desarrollo (Docker)
├── docs/                   # Documentación técnica
└── Makefile               # Comandos de desarrollo
```

## 🛠 Stack Tecnológico

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger/OpenAPI
- **Desarrollo**: Docker Compose

### Frontend  
- **Framework**: Next.js 14 (App Router)
- **Estilos**: TailwindCSS + HeadlessUI
- **Estado**: Zustand + React Query
- **Formularios**: React Hook Form + Zod
- **Tipado**: TypeScript

### DevOps
- **Contenedores**: Docker + Docker Compose
- **Base de Datos**: PostgreSQL 16
- **Email Testing**: MailHog
- **File Storage**: MinIO
- **Cache**: Redis

## 🧪 Comandos Útiles

```bash
# Ver todos los comandos disponibles
make help

# Instalar dependencias
make install

# Ejecutar migraciones de BD
make db-migrate

# Resetear base de datos
make db-reset

# Abrir Prisma Studio
make db-studio

# Ejecutar tests
make test-backend
make test-frontend

# Ver logs de servicios
make logs

# Parar todos los servicios
make stop

# Limpiar contenedores y volúmenes
make clean
```

## 📚 Documentación

- [Estructura del MVP](./docs/EstructuraInicialMVP/estructurainicialmvp.md)
- [Arquitectura del Sistema](./docs/Documentación%20técnica/arquitecturasistema.md)  
- [Especificación Backend](./docs/Documentación%20técnica/especificacionbackend.md)
- [Especificación Frontend](./docs/Documentación%20técnica/especificacionfrontend.md)
- [Cronograma MVP](./docs/cronograma-mvp.md)

## 🔧 Troubleshooting

### Problema: Puerto ocupado
```bash
# Verificar qué está usando el puerto
sudo lsof -i :3000  # o :4000
# Matar el proceso si es necesario
sudo kill -9 <PID>
```

### Problema: Base de datos no conecta
```bash
# Verificar que los servicios estén corriendo
make logs
# Reiniciar servicios
make stop && make dev
```

### Problema: Dependencias desactualizadas
```bash
# Limpiar e instalar de nuevo
make clean
make install
```
