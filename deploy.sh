#!/bin/bash

# Script de despliegue automatizado para FCiencias.app
# Uso: ./deploy.sh [production|staging]

set -e  # Salir si hay errores

ENV=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Iniciando despliegue en ambiente: $ENV"

# Verificar que estamos en el directorio correcto
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Error: $COMPOSE_FILE no encontrado"
    echo "Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar que existe el archivo .env
if [ ! -f ".env" ]; then
    echo "❌ Error: Archivo .env no encontrado"
    echo "Copia .env.production.example a .env y configura las variables"
    exit 1
fi

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    exit 1
fi

echo "✅ Verificaciones iniciales completadas"

# Hacer backup de la base de datos si existe
if docker ps -q -f name=fciencias_postgres_prod > /dev/null; then
    echo "📦 Creando backup de la base de datos..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker exec fciencias_postgres_prod pg_dump -U postgres fciencias_app > "$BACKUP_FILE" || echo "⚠️  No se pudo crear backup"
    echo "📦 Backup guardado como: $BACKUP_FILE"
fi

# Detener servicios actuales
echo "🛑 Deteniendo servicios actuales..."
docker-compose -f "$COMPOSE_FILE" down || true

# Limpiar contenedores e imágenes antiguas
echo "🧹 Limpiando contenedores e imágenes antiguas..."
docker system prune -f

# Construir nuevas imágenes
echo "🔨 Construyendo nuevas imágenes..."
docker-compose -f "$COMPOSE_FILE" build --no-cache

# Iniciar servicios
echo "🚀 Iniciando servicios..."
docker-compose -f "$COMPOSE_FILE" up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar que los servicios están corriendo
echo "🔍 Verificando estado de los servicios..."
docker-compose -f "$COMPOSE_FILE" ps

# Health checks
echo "🏥 Ejecutando health checks..."

# Verificar backend
echo "Verificando backend..."
for i in {1..30}; do
    if curl -f http://localhost:4001/health > /dev/null 2>&1; then
        echo "✅ Backend respondiendo correctamente"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend no responde después de 30 intentos"
        docker-compose -f "$COMPOSE_FILE" logs backend
        exit 1
    fi
    sleep 2
done

# Verificar frontend
echo "Verificando frontend..."
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend respondiendo correctamente"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Frontend no responde después de 30 intentos"
        docker-compose -f "$COMPOSE_FILE" logs frontend
        exit 1
    fi
    sleep 2
done

# Mostrar logs finales
echo "📄 Últimos logs de los servicios:"
docker-compose -f "$COMPOSE_FILE" logs --tail=20

echo ""
echo "🎉 ¡Despliegue completado exitosamente!"
echo ""
echo "📊 URLs disponibles:"
echo "   Frontend: https://fciencias.app"
echo "   API: https://api.fciencias.app/api/v1"
echo "   Health: https://api.fciencias.app/health"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   Reiniciar: docker-compose -f $COMPOSE_FILE restart"
echo "   Detener: docker-compose -f $COMPOSE_FILE down"
echo ""
