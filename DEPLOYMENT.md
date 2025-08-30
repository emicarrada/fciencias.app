# FCiencias.app - Guía de Despliegue en Producción

## 🚀 Pasos para el Despliegue

### 1. Configuración del Dominio
1. **Configurar DNS:**
   - `fciencias.app` → IP del servidor (A record)
   - `www.fciencias.app` → fciencias.app (CNAME)
   - `api.fciencias.app` → IP del servidor (A record)

### 2. Configuración del Servidor

#### Requisitos:
- Ubuntu 22.04 LTS o superior
- Docker y Docker Compose
- 2 GB RAM mínimo
- 20 GB espacio en disco

#### Instalación inicial:
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Certbot para SSL
sudo apt install certbot -y
```

### 3. Configuración SSL con Let's Encrypt

```bash
# Obtener certificados SSL
sudo certbot certonly --standalone -d fciencias.app -d www.fciencias.app -d api.fciencias.app

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f /path/to/docker-compose.prod.yml restart nginx
```

### 4. Configuración de Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.production.example .env

# Editar con valores reales
nano .env
```

**Generar secrets seguros:**
```bash
# Para JWT_SECRET
openssl rand -base64 64

# Para JWT_REFRESH_SECRET  
openssl rand -base64 64

# Para POSTGRES_PASSWORD
openssl rand -base64 32
```

### 5. Despliegue

```bash
# Clonar repositorio en el servidor
git clone https://github.com/tu-usuario/fciencias.app.git
cd fciencias.app

# Configurar variables de entorno
cp .env.production.example .env
# Editar .env con valores reales

# Construir e iniciar servicios
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar que todo esté funcionando
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

### 6. Comandos de Mantenimiento

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Actualizar aplicación
git pull
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Backup de base de datos
docker exec fciencias_postgres_prod pg_dump -U postgres fciencias_app > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar base de datos
docker exec -i fciencias_postgres_prod psql -U postgres fciencias_app < backup_file.sql
```

### 7. Monitoreo

```bash
# Verificar salud de servicios
curl https://fciencias.app
curl https://api.fciencias.app/health

# Monitorear recursos
docker stats

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

## 🔒 Configuración de Seguridad

### Firewall (UFW)
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp  # PostgreSQL solo interno
sudo ufw deny 4001/tcp  # Backend solo interno
```

### Configuraciones adicionales de seguridad:
- Nginx configurado con headers de seguridad
- Rate limiting para APIs
- SSL/TLS moderno (TLS 1.2+)
- Contenedores ejecutándose como usuarios no-root
- Variables de entorno para secrets

## 📊 URLs de Producción

- **Frontend:** https://fciencias.app
- **API:** https://api.fciencias.app/api/v1
- **Health Check:** https://api.fciencias.app/health

## 🆘 Solución de Problemas

### Si el frontend no carga:
```bash
docker-compose -f docker-compose.prod.yml logs frontend
```

### Si la API no responde:
```bash
docker-compose -f docker-compose.prod.yml logs backend
```

### Si hay problemas de base de datos:
```bash
docker-compose -f docker-compose.prod.yml logs postgres
```

### Reinicio completo:
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📈 Optimizaciones de Rendimiento

- **Nginx:** Compresión gzip habilitada
- **Next.js:** Compilación optimizada para producción
- **Docker:** Imágenes multi-stage para tamaño reducido
- **PostgreSQL:** Configuración optimizada para la carga esperada

## 🔄 CI/CD (Opcional)

Para automatizar despliegues, considerar:
- GitHub Actions
- GitLab CI/CD
- Jenkins

¡Tu aplicación FCiencias.app está lista para producción! 🎉
