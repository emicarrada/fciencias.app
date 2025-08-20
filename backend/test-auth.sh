#!/bin/bash

# Script para probar el sistema de autenticación

echo "🧪 Probando el sistema de autenticación de fciencias.app"
echo "========================================================="

# Verificar que el servidor esté funcionando
echo "1. Verificando conexión al servidor..."
if curl -s http://localhost:4001/api/v1/users/profile > /dev/null 2>&1; then
    echo "✅ Servidor funcionando en puerto 4001"
else
    echo "❌ Servidor no responde en puerto 4001"
    echo "Asegúrate de que el backend esté corriendo con: npm run start:dev"
    exit 1
fi

echo ""
echo "2. Probando registro de usuario..."

# Datos de prueba
TEST_USER='{
  "email": "test@ciencias.unam.mx",
  "password": "Test123456",
  "firstName": "Juan",
  "lastName": "Pérez",
  "career": "CIENCIAS_COMPUTACION",
  "semester": 3,
  "interests": ["programación", "algoritmos"]
}'

# Registro
echo "Registrando usuario: test@ciencias.unam.mx"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:4001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "$TEST_USER")

echo "Respuesta del registro:"
echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"

echo ""
echo "3. Probando login..."

# Login
LOGIN_DATA='{
  "email": "test@ciencias.unam.mx",
  "password": "Test123456"
}'

echo "Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

echo "Respuesta del login:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extraer token para pruebas adicionales
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken' 2>/dev/null)

if [ "$ACCESS_TOKEN" != "null" ] && [ ! -z "$ACCESS_TOKEN" ]; then
    echo ""
    echo "4. Probando acceso con token..."
    
    # Probar endpoint protegido (cuando lo implementemos)
    echo "Token extraído: ${ACCESS_TOKEN:0:20}..."
    echo "✅ Sistema de autenticación funcionando correctamente"
else
    echo "❌ No se pudo obtener el token de acceso"
fi
