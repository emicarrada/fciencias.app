# Plan de Testing Comprehensivo - FCiencias.app

## Objetivo
Alcanzar cobertura de al menos 80% en el código crítico del proyecto, implementando tests unitarios, de integración y E2E.

## Estructura de Tests

```
frontend/
├── __tests__/
│   ├── unit/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── components/
│   ├── integration/
│   │   ├── api/
│   │   └── flows/
│   └── e2e/
│       ├── auth.spec.ts
│       ├── posts.spec.ts
│       └── password-recovery.spec.ts
├── jest.config.js
├── jest.setup.js
└── playwright.config.ts
```

## Fase 1: Configuración del Entorno de Testing

### 1.1 Jest para Unit & Integration Tests
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

### 1.2 Playwright para E2E Tests
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 1.3 Mocks y Utilidades
- MSW (Mock Service Worker) para interceptar requests HTTP
- Prisma mock para tests de DB
- JWT mock para auth

## Fase 2: Unit Tests (Prioridad Alta)

### 2.1 Validators (`src/lib/validators/`)
**Objetivo**: Validar lógica de validación de datos

Tests:
- [ ] `validateEmail()`: emails válidos/inválidos
- [ ] `validatePassword()`: longitud mínima, caracteres especiales
- [ ] `validateUsername()`: formato, longitud, caracteres permitidos
- [ ] `validatePostContent()`: longitud máxima, contenido vacío

**Cobertura esperada**: 100%

### 2.2 Auth Service (`src/services/auth.service.ts`)
**Objetivo**: Lógica de autenticación y tokens

Tests:
- [ ] `login()`: credenciales válidas/inválidas
- [ ] `register()`: registro exitoso, email duplicado
- [ ] `verifyEmail()`: token válido/inválido/expirado
- [ ] `refreshToken()`: token válido/inválido
- [ ] `logout()`: limpieza de cookies y tokens
- [ ] `requestPasswordReset()`: email válido/no registrado
- [ ] `resetPassword()`: token válido/expirado, contraseña válida

**Cobertura esperada**: 90%

### 2.3 Post Service (`src/services/post.service.ts`)
**Objetivo**: Lógica de creación y gestión de posts

Tests:
- [ ] `createPost()`: post válido, usuario verificado/no verificado
- [ ] `getFeed()`: paginación, orden cronológico
- [ ] `getUserPosts()`: filtrado por autor
- [ ] Anonymous posts: masking de autor

**Cobertura esperada**: 85%

### 2.4 Hooks (`src/hooks/`)
**Objetivo**: Custom hooks de React

Tests:
- [ ] `useAuth()`: estados de autenticación, login/logout
- [ ] `useCreatePost()`: estados de creación, validaciones
- [ ] `useFeed()`: carga de posts, paginación, refresh

**Cobertura esperada**: 80%

### 2.5 Utils (`src/utils/`)
**Objetivo**: Funciones utilitarias

Tests:
- [ ] `formatDate()`: diferentes formatos de fecha
- [ ] `truncateText()`: textos largos, cortos
- [ ] `generateAvatarColor()`: consistencia de color para usuario
- [ ] `sanitizeInput()`: XSS prevention

**Cobertura esperada**: 95%

## Fase 3: Integration Tests (Prioridad Alta)

### 3.1 Auth Flow Complete
**Objetivo**: Flujo completo de autenticación end-to-end

Escenarios:
- [ ] **Happy Path**: Register → Verify Email → Login → Access Protected Route
- [ ] **Unhappy Path**: Register → Try Post Without Verification → 403
- [ ] **Password Recovery**: Forgot Password → Receive Email → Reset → Login
- [ ] **Username Setup**: Register → Verify → Try Non-Anonymous Post → Set Username → Post

**Herramientas**: Jest + MSW + Prisma Mock

### 3.2 Posts Flow
**Objetivo**: Flujo de creación y visualización de posts

Escenarios:
- [ ] **Create Anonymous Post**: Login → Create Post (anonymous) → Verify in Feed
- [ ] **Create Public Post**: Login → Set Username → Create Post (public) → Verify in Profile
- [ ] **Verification Block**: Unverified User → Try Create Post → 403
- [ ] **Username Block**: Verified User (no username) → Try Non-Anonymous Post → 403

**Herramientas**: Jest + MSW

### 3.3 API Routes Integration
**Objetivo**: Tests de endpoints API con base de datos de testing

Tests:
- [ ] `/api/v1/auth/register`: casos de éxito y error
- [ ] `/api/v1/auth/login`: validación de credenciales
- [ ] `/api/v1/auth/verify`: token válido/inválido
- [ ] `/api/v1/auth/forgot-password`: generación de token
- [ ] `/api/v1/auth/reset-password`: actualización de contraseña
- [ ] `/api/v1/posts/create`: validaciones y creación
- [ ] `/api/v1/posts/feed`: paginación y filtrado

**Herramientas**: Jest + Prisma Test Database (PostgreSQL in-memory o Docker)

## Fase 4: E2E Tests (Prioridad Media)

### 4.1 Critical User Journeys
**Objetivo**: Simular interacciones reales de usuarios

Tests Playwright:

#### Test 1: Onboarding Completo
```typescript
test('Complete user onboarding', async ({ page }) => {
  // 1. Registro
  await page.goto('/auth/register');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 2. Verificar email (mock)
  // 3. Login
  // 4. Primer post
  // 5. Verificar en feed
});
```

#### Test 2: Password Recovery Flow
```typescript
test('User recovers forgotten password', async ({ page }) => {
  // 1. Click "¿Olvidaste tu contraseña?"
  // 2. Ingresar email
  // 3. Recibir token (mock email)
  // 4. Reset password
  // 5. Login con nueva contraseña
});
```

#### Test 3: Anonymous vs Public Posting
```typescript
test('User creates both anonymous and public posts', async ({ page }) => {
  // 1. Login
  // 2. Create anonymous post
  // 3. Verify "Anónimo" in feed
  // 4. Create public post → Triggered username modal
  // 5. Set username
  // 6. Create public post
  // 7. Verify username displayed
});
```

**Cobertura esperada**: Flujos críticos cubiertos al 100%

## Fase 5: Performance & Load Tests (Prioridad Baja)

### 5.1 API Performance
- Response time bajo carga
- Manejo de concurrencia en creación de posts
- Rate limiting efectivo

### 5.2 Database Performance
- Query optimization
- Índices correctos
- N+1 queries prevention

## Métricas de Éxito

| Categoría | Meta de Cobertura | Prioridad |
|-----------|-------------------|-----------|
| Validators | 100% | Alta |
| Services | 85% | Alta |
| API Routes | 80% | Alta |
| Hooks | 75% | Media |
| Components | 60% | Media |
| Utils | 90% | Alta |
| E2E Critical Paths | 100% | Alta |

## Comandos NPM Scripts

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:integration": "jest --testPathPattern=integration",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:all": "npm run test:coverage && npm run test:e2e"
}
```

## Orden de Implementación

1. **Setup inicial** (Jest, Playwright, mocks)
2. **Validators tests** (más fácil, alto ROI)
3. **Auth Service tests** (crítico)
4. **API Routes integration tests** (alto valor)
5. **Post Service tests**
6. **E2E tests críticos** (auth, posts)
7. **Hooks & Components tests**
8. **Performance tests**

## Beneficios Esperados

✅ **Confianza en deploys**: Catch bugs antes de producción
✅ **Refactoring seguro**: Tests como safety net
✅ **Documentación viva**: Tests muestran cómo usar el código
✅ **Velocidad de desarrollo**: Menos debugging manual
✅ **Code quality**: Fuerza diseño testeable (SOLID)

## Próximos Pasos

1. Ejecutar `npm install` de dependencias de testing
2. Crear `jest.config.js` y `jest.setup.js`
3. Crear primer test: `validators.test.ts`
4. Configurar CI/CD para ejecutar tests en cada PR
