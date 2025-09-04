#!/bin/bash

echo "🚀 Configurando base de datos para producción..."
echo ""
echo "Para que el registro funcione en producción necesitamos:"
echo "1. 🗄️ Base de datos PostgreSQL en la nube (Supabase/Neon)"
echo "2. 📧 Variables de entorno de email configuradas ✅"
echo "3. 🔧 CORS configurado correctamente"
echo ""

echo "📋 PASOS MANUALES NECESARIOS:"
echo ""
echo "1. Crear cuenta en Supabase:"
echo "   - Ve a: https://supabase.com/"
echo "   - Crea una cuenta gratuita"
echo "   - Crea un nuevo proyecto"
echo ""
echo "2. Obtener URL de conexión PostgreSQL:"
echo "   - En tu proyecto Supabase"
echo "   - Ve a Settings > Database"
echo "   - Copia la 'Connection String' (URI mode)"
echo ""
echo "3. Configurar en Vercel:"
echo "   vercel env add DATABASE_URL production"
echo "   # Pega la URL de Supabase"
echo ""
echo "4. Ejecutar migraciones:"
echo "   npx prisma migrate deploy"
echo ""
echo "5. Re-deployer:"
echo "   vercel --prod"
echo ""
echo "✨ Alternativa rápida: Usar Neon (más fácil)"
echo "   - Ve a: https://neon.tech/"
echo "   - Conecta con GitHub"
echo "   - Crea base de datos"
echo "   - Copia connection string"
echo ""

read -p "¿Quieres que configure Neon automáticamente? (y/n): " setup_neon

if [ "$setup_neon" = "y" ]; then
    echo "🔧 Instalando Neon CLI..."
    npm install -g @neondatabase/cli
    
    echo "📱 Para continuar:"
    echo "1. Ve a: https://neon.tech/"
    echo "2. Haz login con GitHub"
    echo "3. Ejecuta: neon auth"
    echo "4. Ejecuta este script de nuevo"
fi
