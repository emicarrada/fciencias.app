# Sistema de Diseño - FCiencias.app

## Paleta de Colores

### Colores Primarios
- **Primary-700**: `#041737` - Color principal para navegación, headers y botones primarios
- **Secondary-50**: `#FFFFFF` - Fondos principales y contraste

### Colores de Acento
- **Green-500**: `#22c55e` - Verde brillante para éxito, confirmaciones positivas
- **Red-500**: `#ef4444` - Rojo para errores, alertas, acciones destructivas

### Colores de Texto
- **Text-Primary**: `#111111` - Texto principal sobre fondos claros
- **Text-Secondary**: `#222222` - Texto secundario
- **Text-Muted**: `#6b7280` - Texto atenuado para información secundaria
- **Text-Inverse**: `#FFFFFF` - Texto sobre fondos oscuros

## Componentes

### Botones

#### Botón Primario
```tsx
<Button variant="primary">
  Acción Principal
</Button>
```
- Fondo: `bg-primary-700`
- Texto: `text-white`
- Hover: `hover:bg-primary-800`
- Altura mínima: `44px`

#### Botón Secundario
```tsx
<Button variant="secondary">
  Acción Secundaria
</Button>
```
- Borde: `border-2 border-primary-700`
- Texto: `text-primary-700`
- Fondo: `bg-secondary-50`

#### Botón Outline
```tsx
<Button variant="outline">
  Acción Alternativa
</Button>
```
- Borde: `border-2 border-primary-700`
- Texto: `text-primary-700`
- Hover: `hover:bg-primary-700 hover:text-white`

### Cards

#### Card Básica
```tsx
<Card variant="default" padding="md">
  Contenido de la card
</Card>
```
- Fondo: `bg-white`
- Bordes redondeados: `rounded-xl`
- Sombra suave: `shadow-sm hover:shadow-md`

#### Post Card
```tsx
<PostCard author={{ name: "Usuario", time: "hace 2h" }}>
  Contenido de la publicación
</PostCard>
```
- Diseño específico para publicaciones
- Header con avatar y metadatos
- Espaciado optimizado para contenido

### Reacciones

#### ReactionButton
```tsx
<ReactionButton
  type="like"
  count={15}
  isActive={false}
  onClick={handleReaction}
  size="md"
/>
```
- Altura mínima: `40px` (md), `44px` (lg)
- Bordes redondeados: `rounded-xl`
- Iconos + texto para accesibilidad
- Estados activo/inactivo claramente diferenciados

## Navegación

### Header Principal
- Fondo: `bg-primary-700`
- Texto: `text-white`
- Logo invertido para contraste
- Enlaces con iconos + texto
- Altura mínima de elementos interactivos: `44px`

### Menú de Navegación
- Íconos descriptivos con texto
- Estados hover claramente visibles
- Espaciado amplio entre elementos

## Tipografía

### Fuentes
- **Headings**: CODE font (font-heading)
- **Body**: Poppins font (font-body)

### Jerarquía
- **H1**: `text-3xl sm:text-4xl lg:text-6xl font-heading font-bold`
- **H2**: `text-3xl sm:text-4xl font-heading font-bold`
- **H3**: `text-xl font-heading font-semibold`
- **Body**: `text-sm sm:text-base font-body`
- **Caption**: `text-xs font-body text-text-muted`

## Espaciado

### Contenedores
- Máximo ancho: `max-w-7xl mx-auto`
- Padding lateral: `px-4 sm:px-6 lg:px-8`
- Spacing vertical: `py-6 sm:py-8` (secciones), `py-12 sm:py-16 lg:py-24` (heros)

### Elementos
- Gap entre elementos: `gap-4`, `gap-6`, `gap-8`
- Margin bottom: `mb-4`, `mb-6`, `mb-8`
- Padding interno: `p-4`, `p-6`, `p-8`

## Accesibilidad

### Estándares Implementados
- **Contraste**: Todos los textos cumplen WCAG AA
- **Interactividad**: Altura mínima 44px para elementos táctiles
- **Focus**: Anillos de enfoque visibles en todos los elementos interactivos
- **Labels**: Botones con aria-label descriptivos
- **Semántica**: Uso correcto de elementos HTML

### Ejemplos de Implementación
```tsx
// Botón accesible
<button
  className="min-h-[44px] focus:ring-2 focus:ring-primary-500"
  aria-label="Me gusta: 15 reacciones"
  title="Me gusta (15)"
>
  👍 15
</button>

// Card con contraste adecuado
<div className="bg-white text-text-primary border border-gray-100">
  Contenido legible
</div>
```

## Responsive Design

### Breakpoints
- **sm**: `640px`
- **md**: `768px`
- **lg**: `1024px`
- **xl**: `1280px`

### Patrones Móviles
- Navegación colapsible en móvil
- Grid adaptativo: `grid-cols-1 md:grid-cols-3`
- Texto escalable: `text-sm sm:text-base lg:text-lg`
- Espaciado adaptativo: `p-4 sm:p-6 lg:p-8`

## Estados y Feedback

### Estados de Componentes
- **Default**: Estado base
- **Hover**: Cambios sutiles de color y sombra
- **Active**: Estados claramente diferenciados
- **Disabled**: Opacidad reducida (50%)
- **Focus**: Anillos de enfoque visibles

### Feedback Visual
- **Éxito**: Verde (`accent-green-500`)
- **Error**: Rojo (`accent-red-500`)
- **Warning**: Naranja
- **Info**: Azul primario

### Animaciones
- **Duración**: `duration-200` para interacciones rápidas
- **Easing**: `transition-all` para transiciones suaves
- **Hover effects**: `hover:scale-105` para elementos interactivos
- **Loading**: Spinners y estados de carga consistentes

## Ejemplos de Uso

### Página de Feed
```tsx
<div className="min-h-screen bg-secondary-50">
  <Header />
  <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
    {posts.map(post => (
      <PostCard key={post.id} author={post.author}>
        <h3 className="font-heading font-semibold text-text-primary">
          {post.title}
        </h3>
        <p className="font-body text-text-muted">
          {post.content}
        </p>
        <ReactionGroup reactions={post.reactions} />
      </PostCard>
    ))}
  </main>
</div>
```

### Formulario
```tsx
<Card variant="outlined" padding="lg">
  <h2 className="font-heading font-bold text-text-primary mb-6">
    Nuevo Anuncio
  </h2>
  <form className="space-y-4">
    <input 
      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 min-h-[44px]"
      placeholder="Título del anuncio"
    />
    <textarea 
      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500"
      placeholder="Contenido del anuncio"
      rows={4}
    />
    <div className="flex gap-4">
      <Button type="submit" variant="primary">
        📤 Publicar
      </Button>
      <Button type="button" variant="outline">
        ❌ Cancelar
      </Button>
    </div>
  </form>
</Card>
```

## Mantenimiento

### Actualizaciones de Colores
Los colores están centralizados en `tailwind.config.cjs`. Para cambiar la paleta:
1. Actualizar las variables en la configuración
2. Verificar contraste con herramientas de accesibilidad
3. Probar en modo claro y oscuro

### Nuevos Componentes
1. Seguir los patrones establecidos
2. Implementar estados de accesibilidad
3. Documentar variantes y props
4. Incluir ejemplos de uso

---

**Última actualización**: Septiembre 2025  
**Versión del sistema**: v1.0  
**Framework**: Next.js 15.5.2 + Tailwind CSS  
**Estado**: Implementado y en producción
