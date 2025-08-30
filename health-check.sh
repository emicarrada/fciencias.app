#!/bin/bash

# Verificación rápida del estado de los servicios en producción
# Uso: ./health-check.sh

echo "🏥 Verificando estado de FCiencias.app"
echo "=================================="

# Verificar frontend
echo -n "Frontend (fciencias.app): "
if curl -f -s --max-time 10 https://fciencias.app > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Verificar API
echo -n "API (api.fciencias.app): "
if curl -f -s --max-time 10 https://api.fciencias.app/health > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Verificar SSL
echo -n "SSL fciencias.app: "
if echo | openssl s_client -connect fciencias.app:443 -servername fciencias.app 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

echo -n "SSL api.fciencias.app: "
if echo | openssl s_client -connect api.fciencias.app:443 -servername api.fciencias.app 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
    echo "✅ OK"
else
    echo "❌ ERROR"
fi

# Si está en el servidor, verificar contenedores Docker
if command -v docker >/dev/null 2>&1; then
    echo ""
    echo "📦 Estado de contenedores Docker:"
    docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "No se encontró docker-compose.prod.yml"
fi

echo ""
echo "🔗 URLs de verificación:"
echo "  Frontend: https://fciencias.app"
echo "  API: https://api.fciencias.app/api/v1"
echo "  Health: https://api.fciencias.app/health"
