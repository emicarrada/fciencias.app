# 📋 CHECKLIST: Configuración Vercel Environment Variables

## 🎯 Proyecto: fciencias.app
- URL: https://vercel.com/emicarrada/fciencias-app
- Repository: github.com/emicarrada/fciencias.app

## 🔑 Variables a configurar:

### 1. DATABASE_URL
```
DATABASE_URL=postgresql://postgres:RkddRZutC6P7FhkL@db.hlwysacschgrebvxomjs.supabase.co:5432/postgres
```
- Environment: Production
- Target: Production

### 2. NEXT_PUBLIC_APP_URL  
```
NEXT_PUBLIC_APP_URL=https://fciencias.app
```
- Environment: Production
- Target: Production

### 3. NEXT_PUBLIC_ENV
```
NEXT_PUBLIC_ENV=production
```
- Environment: Production  
- Target: Production

## ✅ Después de configurar:
1. Vercel hará redeploy automático
2. Probar API: POST https://fciencias.app/api/v1/auth/register
3. Verificar funcionamiento completo

## 🧪 Test de registro:
```json
{
  "name": "Test Production",
  "email": "test@example.com", 
  "password": "TestPassword123!",
  "careerId": "1"
}
```
