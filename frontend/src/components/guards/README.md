# RequireVerification Guard

## 📖 Descripción

`<RequireVerification>` es un componente guard que implementa el sistema de verificación progresiva de fciencias.app. Intercepta acciones del usuario y valida permisos según su estado de verificación, mostrando modales cuando sea necesario.

## 🎯 Filosofía

> "Primero curiosidad, luego confianza, después compromiso"

El sistema permite a los usuarios explorar libremente el contenido, pero requiere verificación progresiva para interactuar según el nivel de exposición.

## 🔒 Niveles de Verificación

### Nivel 0: Visualización (Sin restricciones)
- Ver feed
- Ver perfiles
- Ver publicaciones
- Ver tienda
- Ver reseñas

### Nivel 1: Email Verificado
- Publicar anónimamente

### Nivel 2: Email Verificado + Username
- Publicar con nombre
- Comentar
- Reaccionar
- Enviar mensajes
- Crear reseñas
- Publicar en tienda

## 🚀 Uso Básico

```tsx
import { RequireVerification } from '@/components/guards';
import { InteractionType } from '@/types/permissions';

function CommentButton() {
  const handleComment = () => {
    // Lógica de comentar
    console.log('Comentando...');
  };

  return (
    <RequireVerification
      interactionType={InteractionType.COMMENT}
      onAllow={handleComment}
    >
      <Button>💬 Comentar</Button>
    </RequireVerification>
  );
}
```

## 📝 Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `interactionType` | `InteractionType` | ✅ | Tipo de interacción a validar |
| `onAllow` | `() => void` | ✅ | Callback ejecutado cuando la acción está permitida |
| `isAnonymous` | `boolean` | ❌ | Si la publicación es anónima (default: `false`) |
| `children` | `ReactNode` | ✅ | Elemento hijo a renderizar |
| `className` | `string` | ❌ | Clase CSS adicional |

## 🔄 Flujo de Operación

```
1. Usuario hace click en el elemento envuelto
2. Guard intercepta el evento
3. Valida permisos con useUserPermissions
4. Si está permitido → ejecuta onAllow()
5. Si falta email → muestra modal de verificación
6. Si falta username → muestra modal de selección
7. Tras completar verificación → ejecuta onAllow()
```

## 📚 Ejemplos

### 1. Comentar (requiere email + username)

```tsx
<RequireVerification
  interactionType={InteractionType.COMMENT}
  onAllow={() => handleComment()}
>
  <Button>Comentar</Button>
</RequireVerification>
```

### 2. Publicar Anónimamente (solo email)

```tsx
<RequireVerification
  interactionType={InteractionType.PUBLISH_POST}
  isAnonymous={true}
  onAllow={() => handlePublishAnonymous()}
>
  <Button>Publicar Anónimo</Button>
</RequireVerification>
```

### 3. Reaccionar (requiere email + username)

```tsx
<RequireVerification
  interactionType={InteractionType.REACT}
  onAllow={() => handleReact('❤️')}
>
  <button className="reaction-button">❤️</button>
</RequireVerification>
```

### 4. Enviar Mensaje (requiere email + username)

```tsx
<RequireVerification
  interactionType={InteractionType.SEND_MESSAGE}
  onAllow={() => handleSendMessage()}
>
  <Button>Enviar Mensaje</Button>
</RequireVerification>
```

## 🧪 Página de Prueba

Visita `/test-verification` para ver ejemplos interactivos del guard en acción.

## 🏗️ Arquitectura

### Principios SOLID Aplicados

- **Single Responsibility**: Solo valida permisos y muestra modales
- **Open/Closed**: Extensible para nuevos tipos de interacción sin modificar el código
- **Dependency Inversion**: Depende del hook `useUserPermissions` (abstracción)
- **Interface Segregation**: Props específicas y enfocadas

### Dependencias

```
RequireVerification
  ├── useUserPermissions (hook)
  │   ├── useAuthStore (Zustand)
  │   └── types/permissions (tipos)
  └── InteractionType (enum)
```

## 🔮 Próximas Fases

### FASE 3: Modal de Verificación de Email
- Componente `EmailVerificationModal`
- API endpoints para enviar/verificar email
- Integración con RequireVerification

### FASE 4: Modal de Selección de Username
- Componente `UsernameSelectionModal`
- API endpoints para validar/establecer username
- Validación en tiempo real de disponibilidad

### FASE 5: Sistema de Publicaciones
- Integrar guard en formularios de publicación
- Validación antes de submit
- Manejo de publicaciones anónimas

## 📊 Estado Actual

✅ COMPLETADO:
- Componente guard base
- Validación de permisos
- Interceptación de eventos
- Modales placeholder

⏳ PENDIENTE:
- Modales funcionales (FASE 3 y 4)
- Integración con API de verificación
- Estilos finales de modales
- Copy UX optimizado

## 🐛 Debugging

Para ver logs de validación de permisos:

```tsx
// En useUserPermissions.ts, línea 99
console.log('Validando permiso:', interactionType, permissionResult);
```

## 📄 Archivos Relacionados

- `/frontend/src/components/guards/RequireVerification.tsx` - Componente guard
- `/frontend/src/hooks/business/useUserPermissions.ts` - Hook de permisos
- `/frontend/src/types/permissions.ts` - Tipos y enums
- `/frontend/src/app/test-verification/page.tsx` - Página de prueba

## 🤝 Contribuir

Al agregar nuevos tipos de interacción:

1. Agregar el nuevo tipo a `InteractionType` enum
2. Configurar requisitos en `INTERACTION_REQUIREMENTS`
3. Agregar mensaje en `VERIFICATION_MESSAGES`
4. Crear ejemplo en `RequireVerificationExample`
5. Actualizar esta documentación

## 📞 Soporte

Para problemas o preguntas sobre el sistema de permisos, consultar:
- Documentación técnica: `/docs/Documentación técnica/`
- Especificación de backend: `/docs/Documentación técnica/especificacionbackend.md`
- Plan de tareas MVP: `/docs/PLAN_TAREAS_MVP.md`
