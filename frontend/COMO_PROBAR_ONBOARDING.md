# 🧪 Instrucciones para Probar el Onboarding

## 🚀 ¡El sistema de onboarding está listo para probar!

### 📍 Cómo Acceder al Test

1. **Desde la página principal**: Navega a `http://localhost:3000` y busca el botón "🧪 Probar Onboarding" en la esquina inferior derecha
2. **Directamente**: Ve a `http://localhost:3000/test-onboarding`

### 🔍 Qué Probar

#### **Paso 1: Validación de Email** ✉️
- **Prueba emails válidos**: `estudiante@ciencias.unam.mx`, `profesor@ciencias.unam.mx`
- **Prueba emails inválidos**: `test@gmail.com`, `usuario@unam.mx`
- **Verifica**: Que solo acepta emails con dominio @ciencias.unam.mx

#### **Paso 2: Información del Perfil** 👤
- **Prueba nombres**: "Juan Pérez", "María García López"
- **Prueba usernames**: "juanp", "maria123", "test_user"
- **Verifica**: Validación de nombre completo y disponibilidad de username

#### **Paso 3: Selección de Carrera** 🎓
- **Carreras disponibles**:
  - 📐 Matemáticas
  - ⚛️ Física
  - 📊 Actuaría
  - 💻 Ciencias de la Computación
  - 🧬 Biología
  - 🌍 Ciencias de la Tierra
  - 🧪 Química
  - 📈 Matemáticas Aplicadas
  - 🧠 Neurobiología

#### **Paso 4: Color de Avatar** 🎨
- **12 colores disponibles**: Azul, Índigo, Púrpura, Rosa, Rojo, Naranja, Amarillo, Verde, Teal, Cian, Gris, Pizarra
- **Verifica**: Vista previa en tiempo real con las iniciales del usuario

### 🎯 Datos de Ejemplo para Prueba Rápida

```
Email: estudiante@ciencias.unam.mx
Nombre: Juan Pérez García
Username: juanpg
Carrera: Ciencias de la Computación
Color: Azul Océano
```

### ✅ Qué Verificar

1. **Navegación**: Los botones "Siguiente" y "Anterior" funcionan correctamente
2. **Validación**: Cada paso valida los datos antes de permitir continuar
3. **Progreso**: La barra de progreso se actualiza visualmente
4. **Animaciones**: Transiciones suaves entre pasos
5. **Responsive**: Funciona en diferentes tamaños de pantalla
6. **Datos finales**: Al completar, verifica que todos los datos se capturen correctamente

### 🐛 Posibles Problemas y Soluciones

#### Si no carga la página:
```bash
# Reiniciar el servidor
cd /home/carrada/Escritorio/fciencias.app/frontend
npm run dev
```

#### Si hay errores de compilación:
```bash
# Limpiar cache de Next.js
rm -rf .next
npm run dev
```

#### Si faltan dependencias:
```bash
npm install
```

### 📊 Resultado Esperado

Al completar el onboarding, deberías ver:

1. **Página de éxito** con mensaje de confirmación
2. **Datos capturados** mostrados en formato legible
3. **Vista previa del perfil** con avatar colorizado
4. **Output JSON** con la estructura:
   ```json
   {
     "email": "estudiante@ciencias.unam.mx",
     "fullName": "Juan Pérez García",
     "username": "juanpg",
     "career": "computacion",
     "avatarColor": "blue"
   }
   ```

### 🔄 Reiniciar la Prueba

- Haz clic en "Probar de Nuevo" para reiniciar el flujo
- O recarga la página `/test-onboarding`

### 📝 Notas Adicionales

- El onboarding incluye simulación de verificación de disponibilidad de username
- Todos los datos se validan en tiempo real
- El sistema es completamente funcional y listo para integrar con tu API
- Los iconos de carreras son temporales (emojis) - puedes reemplazarlos fácilmente

---

**¡Disfruta probando el nuevo sistema de onboarding! 🎉**
