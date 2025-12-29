# EmailVerificationModal

Componente modal reutilizable para el flujo de verificación de email.

## Props

| Prop         | Tipo      | Requerido | Descripción                                                        |
|--------------|-----------|-----------|--------------------------------------------------------------------|
| email        | string    | ✅        | Correo electrónico a verificar                                     |
| open         | boolean   | ✅        | Si el modal está abierto                                           |
| onClose      | () => void| ✅        | Callback para cerrar el modal                                      |
| onVerified   | () => void| ❌        | Callback cuando el usuario se verifica correctamente               |
| resendLabel  | string    | ❌        | Texto para el botón de reenviar correo (default: 'Reenviar correo')|
| verifiedLabel| string    | ❌        | Texto para el botón de verificación (default: 'Ya verifiqué')      |
| description  | string    | ❌        | Texto descriptivo (default incluido)                               |

## Ejemplo de uso

```tsx
<EmailVerificationModal
  email="usuario@ciencias.unam.mx"
  open={modalAbierto}
  onClose={() => setModalAbierto(false)}
  onVerified={() => alert('¡Correo verificado!')}
/>
```

## Flujo

1. El usuario ve el modal con su email y explicación.
2. Puede reenviar el correo de verificación (llama a la API y muestra feedback).
3. Puede indicar que ya verificó (hace polling a la API y muestra feedback).
4. Si se verifica, se ejecuta `onVerified` y se cierra el modal.
5. Puede cerrar el modal manualmente.

## Prueba interactiva

Visita `/test-email-verification` para probar el componente de forma aislada.
