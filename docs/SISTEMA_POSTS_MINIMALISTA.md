# Sistema de Posts Minimalista - FCiencias App

## ✅ IMPLEMENTACIÓN COMPLETADA

Se ha implementado un sistema de posts minimalista siguiendo las especificaciones exactas proporcionadas.

## 🎯 Checklist de Funcionalidad

### ✅ 1. MODELO DE POST (CRÍTICO)

**Base de datos - Tabla `posts`:**
- ✅ `id` (UUID)
- ✅ `content` (Text)
- ✅ `image_url` (nullable)
- ✅ `author_id` (FK a users)
- ✅ `created_at` (timestamp)
- ✅ `is_anonymous` (boolean)
- ✅ **SIN likes**
- ✅ **SIN comentarios**

**Ubicación:** `frontend/prisma/schema.prisma` (modelo `Post`)
**Migración:** `20251229095026_add_post_model`

### ✅ 2. CREAR POST (FLUJO COMPLETO)

**Frontend:**
- ✅ Textarea para contenido
- ✅ Campo para subir imagen (URL)
- ✅ Toggle "publicar anónimo"
- ✅ Botón publicar
- ✅ Mensajes de éxito/error

**Reglas implementadas:**
- ✅ Si no está verificado → modal de verificación
- ✅ Si no es anónimo y no hay username → pedir username
- ✅ Validación de longitud (máx 5000 caracteres)

**Componente:** `frontend/src/components/posts/CreatePostForm.tsx`
**API:** `frontend/src/app/api/v1/posts/create/route.ts`

### ✅ 3. FEED PRINCIPAL

**Muestra:**
- ✅ Texto del post
- ✅ Imagen (si hay)
- ✅ Autor o "Anónimo"
- ✅ Fecha relativa (ej: "hace 2 horas")

**Orden:** Cronológico (más recientes primero)

**Componentes:**
- `frontend/src/components/posts/PostFeed.tsx`
- `frontend/src/components/posts/PostCard.tsx`
- `frontend/src/app/feed/page.tsx`

**API:** `frontend/src/app/api/v1/posts/feed/route.ts`

### ✅ 4. VERIFICACIÓN DE CORREO (DIFERIDA)

**Implementado:**
- ✅ Flag `email_verified` en User model
- ✅ Lógica que bloquea publicar si es `false`
- ✅ Botón "reenviar verificación"
- ✅ Modal informativo cuando se intenta publicar sin verificar

**API:** `frontend/src/app/api/v1/auth/resend-verification/route.ts`

### ✅ 5. USERNAME (SOLO CUANDO TOCA)

**No en el registro, sino:**
- ✅ Campo `username` en User model (opcional)
- ✅ Validación de unicidad
- ✅ UI para pedirlo solo al publicar (si no es anónimo)
- ✅ Posibilidad de cambiarlo después (en perfil)

**API:** `frontend/src/app/api/v1/auth/set-username/route.ts`

### ✅ 6. PERFIL MÍNIMO

**Perfil básico incluye:**
- ✅ Username
- ✅ Lista de posts propios
- ✅ Botón editar username
- ✅ Botón cerrar sesión

**Página:** `frontend/src/app/perfil/page.tsx`

### ✅ 7. PROTECCIÓN DE FLUJOS

**Casos probados:**
- ✅ Usuario sin verificar intenta publicar → mensaje claro
- ✅ Usuario sin username publica anónimo → funciona
- ✅ Usuario con username publica normal → funciona
- ✅ Usuario recarga y no se rompe nada

---

## 🚀 CÓMO PROBAR

### 1. Iniciar el servidor

```bash
cd frontend
npm run dev
```

El servidor estará en: `http://localhost:3000` (o 3001 si 3000 está ocupado)

### 2. Flujo de prueba completo

#### Paso 1: Registrarse
1. Ir a `http://localhost:3000/auth/register`
2. Ingresar email y contraseña (mín 6 caracteres)
3. Clic en "Registrar"
4. Deberías ser redirigido automáticamente

#### Paso 2: Ver el feed (debería estar vacío)
1. Automáticamente serás redirigido a `/feed`
2. Deberías ver "No hay publicaciones aún"

#### Paso 3: Intentar publicar (sin verificación)
1. Escribir algo en el textarea
2. Clic en "Publicar"
3. **Deberías ver** un modal que dice "Debes verificar tu correo"
4. Clic en "Reenviar correo" (se enviará email de verificación)

#### Paso 4: Verificar email (manual en BD por ahora)
Para testing rápido, puedes marcar manualmente como verificado:

```sql
UPDATE users SET "isEmailVerified" = true WHERE email = 'tu@email.com';
```

O puedes usar el link del correo que se envió.

#### Paso 5: Publicar post anónimo
1. Escribir contenido
2. Marcar "Publicar de forma anónima"
3. Clic en "Publicar"
4. **Deberías ver** el post publicado con "Anónimo" como autor

#### Paso 6: Intentar publicar con nombre (sin username)
1. Escribir contenido
2. **NO marcar** anónimo
3. Clic en "Publicar"
4. **Deberías ver** un modal pidiendo username
5. Ingresar username (3-20 caracteres)
6. Guardar
7. El post se publicará automáticamente

#### Paso 7: Ver tu perfil
1. Clic en "Mi Perfil" (esquina superior derecha)
2. Deberías ver tu username, email, y posts
3. Puedes editar el username desde aquí

#### Paso 8: Recargar y verificar que todo funciona
1. Presiona F5 en cualquier página
2. No deberías perder la sesión
3. Todo debería seguir funcionando

---

## 📁 ESTRUCTURA DE ARCHIVOS NUEVOS/MODIFICADOS

### Backend/API
```
frontend/src/app/api/v1/
├── posts/
│   ├── create/route.ts          ← Crear posts
│   └── feed/route.ts             ← Obtener feed
└── auth/
    ├── resend-verification/route.ts ← Reenviar verificación
    └── set-username/route.ts        ← Configurar username
```

### Frontend - Componentes
```
frontend/src/components/posts/
├── CreatePostForm.tsx    ← Formulario para crear posts
├── PostCard.tsx          ← Tarjeta individual de post
└── PostFeed.tsx          ← Lista de posts (feed)
```

### Frontend - Páginas
```
frontend/src/app/
├── feed/page.tsx         ← Página principal del feed
├── perfil/page.tsx       ← Página de perfil de usuario
└── dashboard/page.tsx    ← Redirige a /feed
```

### Base de datos
```
frontend/prisma/
├── schema.prisma                              ← Modelo Post agregado
└── migrations/20251229095026_add_post_model/  ← Migración
```

### Types
```
frontend/src/types/
└── post.ts               ← Tipos TypeScript para posts
```

---

## 🧪 TESTS IMPLEMENTADOS

**Archivo:** `frontend/src/__tests__/flujos-principales.test.ts`

**Tests incluidos:**
1. ✅ Usuario se registra y entra
2. ✅ Usuario ve feed
3. ✅ Usuario sin verificar intenta publicar → error 403
4. ✅ Usuario recibe mensaje claro sobre verificación
5. ✅ Feed se puede recargar múltiples veces sin errores

**Ejecutar tests:**
```bash
npm test
```

---

## 🚫 COSAS QUE NO SE IMPLEMENTARON (COMO SOLICITADO)

- ❌ Tienda
- ❌ Reseñas
- ❌ Likes/Reacciones
- ❌ Seguidores
- ❌ Comentarios
- ❌ Diseño fino/pulido
- ❌ Sistema de invitaciones
- ❌ Stickers
- ❌ Sistema de anuncios

---

## 📊 CHECKLIST FINAL

¿Puedes decir SÍ a todo esto?

- ✅ Me registro
- ✅ Entro
- ✅ Veo un feed
- ✅ Creo un post
- ✅ Lo veo publicado
- ✅ Entiendo por qué no puedo publicar si no estoy verificado
- ✅ El flujo no me frustra

**Estado:** ✅ **SEMANA 1 COMPLETADA**

---

## 🔧 CONFIGURACIÓN TÉCNICA

### Variables de entorno requeridas (.env.local)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secret-key-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Comandos útiles

```bash
# Generar cliente Prisma
npx prisma generate

# Ver base de datos
npx prisma studio

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Reset completo de BD (⚠️ CUIDADO)
npx prisma migrate reset
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Property 'post' does not exist on Prisma Client"
**Solución:**
```bash
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client
npx prisma generate
```

### Problema: No puedo publicar posts
**Verificar:**
1. ¿Está el usuario verificado? (`isEmailVerified = true`)
2. ¿Tienes username configurado? (si publicas no-anónimo)
3. ¿Hay errores en consola del navegador?

### Problema: El feed no carga
**Verificar:**
1. ¿El servidor está corriendo? (`npm run dev`)
2. ¿La migración se aplicó? (`npx prisma migrate deploy`)
3. ¿Hay posts en la BD? (`npx prisma studio`)

---

## 📝 NOTAS TÉCNICAS

1. **Autenticación:** Se usa JWT con cookies httpOnly
2. **Validación de contraseñas:** Simplificada a 6 caracteres mínimo
3. **Verificación de email:** Envío real via Gmail SMTP
4. **Posts anónimos:** No exponen información del autor
5. **Username:** Único, 3-20 caracteres, alfanumérico con guiones

---

## 🎓 PRÓXIMOS PASOS (NO PARA ESTA SEMANA)

- [ ] Implementar carga de imágenes real (no solo URLs)
- [ ] Agregar likes (cuando corresponda)
- [ ] Agregar comentarios (cuando corresponda)
- [ ] Implementar paginación en el feed
- [ ] Agregar búsqueda/filtros
- [ ] Mejorar el diseño visual
- [ ] Implementar notificaciones
- [ ] Sistema de moderación

---

**Última actualización:** 29 de diciembre de 2025
**Versión:** 1.0 - MVP Semana 1
