# 🚀 Guía de Despliegue - fciencias.app

## ✅ Azure funciona PERFECTAMENTE con Linux

**Respuesta rápida**: SÍ, Azure es compatible al 100% con Linux y es la mejor opción para tu proyecto.

### 🐧 Azure + Linux = Combinación ideal

- ✅ **Azure CLI nativo** para Linux
- ✅ **VS Code + extensiones Azure** (que ya tienes)
- ✅ **Docker support completo**
- ✅ **SSH directo a VMs**
- ✅ **Deploy desde Git**

## 🎯 Azure: Tu mejor opción (RECOMENDADO)

### Servicios Azure para tu proyecto:
- **Azure App Service** - Backend NestJS (GRATIS 12 meses)
- **Azure Database for PostgreSQL** - Base de datos (GRATIS tier)
- **Azure Static Web Apps** - Frontend Next.js (GRATIS)
- **Azure Storage Account** - Archivos (GRATIS tier)

### 💰 Créditos disponibles:
- **$100 USD** con Azure for Students
- **Sin tarjeta de crédito requerida**
- **12 meses de servicios gratuitos**

## 🛠️ Instalación Azure CLI en Linux

### Ubuntu/Debian:
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://username:password@server.postgres.database.azure.com:5432/fciencias
JWT_SECRET=your_super_secure_jwt_secret_here
REFRESH_TOKEN_TTL_DAYS=30
```

#### 3. Scripts de deploy
```json
// En backend/package.json agregar:
"scripts": {
  "deploy:azure": "npm run build && node dist/main.js"
}
```

## Opción 2: Railway (Gratis limitado)

### Configuración:
1. Conectar repositorio de GitHub
2. Desplegar backend con PostgreSQL addon
3. Frontend en Vercel

### Estimación de costos Railway:
- Backend + DB: ~$3-4 USD/mes
- Plan gratuito: $5 USD/mes
- ✅ Suficiente para MVP

## Opción 3: DigitalOcean ($200 créditos)

### Si logras resolver el método de pago:
- **App Platform**: $12/mes backend + $7/mes DB
- **Droplets**: $6/mes + $15/mes DB gestionada
- Con $200 tienes ~6-10 meses cubiertos

## Próximos pasos recomendados:

1. **Empezar con Azure** (sin tarjeta requerida)
2. **Backup en Railway** para desarrollo
3. **DigitalOcean** cuando resuelvas el pago

¿Con cuál quieres que empecemos?
