#!/bin/bash

echo "🚀 CONFIGURACIÓN DE PRODUCCIÓN - fciencias.app"
echo "==============================================="

echo ""
echo "1️⃣ CONFIGURA VARIABLES DE ENTORNO EN VERCEL:"
echo ""
echo "DATABASE_URL → Connection string de Supabase"
echo "JWT_SECRET → production_jwt_secret_$(openssl rand -hex 32)"
echo "EMAIL_USER → fciencias.app@gmail.com" 
echo "EMAIL_PASS → fjrd mcls xhaw wlry"
echo "FRONTEND_URL → https://fciencias-88rv1e02y-cristopher-carradas-projects.vercel.app"

echo ""
echo "2️⃣ EJECUTA MIGRACIÓN A SUPABASE:"
echo ""
echo "# Con tu DATABASE_URL de Supabase configurada:"
echo "cd backend"
echo "npx prisma migrate deploy"
echo "npx prisma generate"

echo ""
echo "3️⃣ REDESPLIEGA CON NUEVAS VARIABLES:"
echo ""
echo "vercel --prod"

echo ""
echo "✅ DESPUÉS EL REGISTRO FUNCIONARÁ PARA USUARIOS REALES"
