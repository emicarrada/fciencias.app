# Correcciones del Sistema de Posts

## Cambios Realizados

### 1. ✅ Script SQL para Eliminar Publicaciones
**Archivo:** `delete-all-posts.sql`

Script SQL para eliminar todas las publicaciones cuando tengas acceso a la base de datos:
```sql
DELETE FROM "posts";
```

**Para ejecutarlo:**
```bash
# Opción 1: Desde psql
psql -U tu_usuario -d fciencias_db -f delete-all-posts.sql

# Opción 2: Desde Prisma Studio
# Abre Prisma Studio y ejecuta el script en la consola SQL
```

### 2. ✅ Nuevo Endpoint para Posts del Usuario
**Archivo:** `frontend/src/app/api/v1/posts/my-posts/route.ts`

Se creó un nuevo endpoint `GET /api/v1/posts/my-posts` que:
- ✅ Requiere autenticación (verifica token)
- ✅ Filtra posts SOLO del usuario autenticado usando `authorId: payload.userId`
- ✅ Ordena por fecha descendente (más recientes primero)
- ✅ Soporta paginación con `limit` y `offset`

### 3. ✅ Corrección del Bug en Perfil
**Archivo:** `frontend/src/app/perfil/page.tsx`

**ANTES (INCORRECTO):**
```tsx
const response = await axios.get('/api/v1/posts/feed'); // Obtenía TODOS los posts
// Filtrar solo los posts del usuario (necesitaríamos el ID del usuario)
// Por ahora mostramos todos ❌ BUG AQUÍ
```

**DESPUÉS (CORRECTO):**
```tsx
const response = await axios.get('/api/v1/posts/my-posts'); // Solo posts del usuario autenticado ✅
```

## Resumen del Bug Corregido

### Problema Original
En la página de perfil, la sección "Mis publicaciones" mostraba publicaciones de TODOS los usuarios porque:
1. Usaba el endpoint `/api/v1/posts/feed` que devuelve todos los posts
2. No filtraba por usuario
3. Había un comentario que decía "Por ahora mostramos todos" ❌

### Solución Implementada
1. Creado endpoint dedicado `/api/v1/posts/my-posts` que filtra por `authorId`
2. Actualizada la página de perfil para usar el nuevo endpoint
3. Ahora cada usuario ve SOLO sus propias publicaciones ✅

## Estado del Home (Dashboard)

**Archivo:** `frontend/src/app/dashboard/home/page.tsx`

El home ya está configurado correctamente:
- ✅ Solo muestra el componente `PostFeed` (listado de posts)
- ✅ NO tiene el formulario `CreatePostForm`
- ✅ El formulario de crear posts solo está en `/feed`

## Próximos Pasos

1. **Cuando tengas acceso a la BD:**
   ```bash
   cd /home/carrada/Escritorio/Projects/fciencias.app
   psql -U tu_usuario -d fciencias_db -f delete-all-posts.sql
   ```

2. **Verificar los cambios:**
   - Inicia sesión con diferentes usuarios
   - Ve a `/perfil` y verifica que cada usuario ve solo SUS publicaciones
   - El home no debe tener formulario de crear posts

3. **Si necesitas crear posts nuevos:**
   - Ve a la página `/feed` que tiene el formulario de creación
