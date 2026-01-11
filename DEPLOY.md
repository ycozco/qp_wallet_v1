# Guía de Deployment - Wallet App

## Información del Proyecto

- **Dominio**: billetera.qpsecuresolutions.cloud
- **Proxy**: Nginx Proxy Manager → http://72.62.15.23:3000
- **SSL**: Let's Encrypt (gestionado por NPM)
- **Stack**: /srv/apps/wallet/
- **Código**: /var/www/billetera/

## Estructura de Archivos

```
/srv/apps/wallet/
├── docker-compose.yml
├── .env
└── data/
    ├── postgres/     # Datos de PostgreSQL
    └── backups/      # Backups de BD

/var/www/billetera/
├── app/              # Páginas Next.js App Router
├── components/       # Componentes React
├── lib/              # Utilidades y acciones
├── prisma/           # Schema de base de datos
├── Dockerfile        # Imagen de producción
└── ...
```

## Variables de Entorno

Archivo: `/srv/apps/wallet/.env`

```bash
POSTGRES_DB=wallet
POSTGRES_USER=wallet
POSTGRES_PASSWORD=<generado-aleatoriamente>
DATABASE_URL=postgresql://wallet:<password>@wallet-db:5432/wallet
NEXTAUTH_SECRET=<generado-aleatoriamente>
NEXTAUTH_URL=https://billetera.qpsecuresolutions.cloud
```

## Comandos de Deployment

### 1. Levantar Stack (primera vez)

```bash
cd /srv/apps/wallet
docker compose --env-file .env up -d --build
```

### 2. Ver Logs

```bash
# Todos los servicios
docker compose -f /srv/apps/wallet/docker-compose.yml logs -f

# Solo web
docker logs -f wallet-web

# Solo BD
docker logs -f wallet-db
```

### 3. Rebuild después de cambios

```bash
cd /var/www/billetera
# Hacer cambios en el código

cd /srv/apps/wallet
docker compose down
docker compose --env-file .env up -d --build
```

### 4. Crear Usuario Inicial

```bash
docker exec -it wallet-web npx tsx scripts/create-user.ts admin admin123
```

O con usuario/contraseña personalizados:

```bash
docker exec -it wallet-web npx tsx scripts/create-user.ts usuario password
```

## Gestión de Base de Datos

### Backup Manual

```bash
# Backup
docker exec wallet-db pg_dump -U wallet wallet > /srv/apps/wallet/data/backups/backup-$(date +%Y%m%d-%H%M%S).sql

# O con compresión
docker exec wallet-db pg_dump -U wallet wallet | gzip > /srv/apps/wallet/data/backups/backup-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Restore desde Backup

```bash
# Detener web
docker stop wallet-web

# Restore
docker exec -i wallet-db psql -U wallet wallet < /srv/apps/wallet/data/backups/backup-YYYYMMDD-HHMMSS.sql

# O desde gz
gunzip < /srv/apps/wallet/data/backups/backup-YYYYMMDD-HHMMSS.sql.gz | docker exec -i wallet-db psql -U wallet wallet

# Reiniciar web
docker start wallet-web
```

### Migraciones de Prisma

Las migraciones se ejecutan automáticamente al iniciar el contenedor.

Para ejecutar manualmente:

```bash
docker exec wallet-web npx prisma migrate deploy
```

Para crear nueva migración (desarrollo):

```bash
cd /var/www/billetera
npx prisma migrate dev --name nombre_migracion
```

## Verificación del Servicio

### Health Check

```bash
curl http://127.0.0.1:3000/api/health
curl -I https://billetera.qpsecuresolutions.cloud/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-09T..."
}
```

### Verificar Contenedores

```bash
docker ps | grep wallet
```

Esperado:
```
wallet-web    Up X minutes    0.0.0.0:3000->3000/tcp
wallet-db     Up X minutes    5432/tcp (no expuesto)
```

## Troubleshooting

### Error: No se puede conectar a la BD

```bash
# Verificar que wallet-db esté corriendo
docker logs wallet-db

# Verificar healthcheck
docker inspect wallet-db | grep -A 10 Health
```

### Error: Next.js no inicia

```bash
# Ver logs detallados
docker logs wallet-web

# Verificar variables de entorno
docker exec wallet-web env | grep -E '(DATABASE_URL|NEXTAUTH)'
```

### Reiniciar Todo

```bash
cd /srv/apps/wallet
docker compose down
docker compose --env-file .env up -d --build
```

### Limpiar y Empezar de Nuevo (⚠️ ELIMINA DATOS)

```bash
cd /srv/apps/wallet
docker compose down -v
# Opcional: rm -rf data/postgres/*
docker compose --env-file .env up -d --build
```

## Backup Automático (Opcional)

Agregar a crontab:

```bash
# Editar crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * docker exec wallet-db pg_dump -U wallet wallet | gzip > /srv/apps/wallet/data/backups/auto-backup-$(date +\%Y\%m\%d-\%H\%M\%S).sql.gz

# Limpiar backups antiguos (más de 30 días)
0 3 * * * find /srv/apps/wallet/data/backups/ -name "auto-backup-*.sql.gz" -mtime +30 -delete
```

## Nota sobre NPM

El dominio `billetera.qpsecuresolutions.cloud` ya está configurado en Nginx Proxy Manager apuntando a:

- **Destination**: http://72.62.15.23:3000
- **SSL**: Let's Encrypt (Force SSL activo)

**NO modificar la configuración de NPM.** El único requisito es que el puerto 3000 del host esté escuchando, lo cual está configurado en el docker-compose.yml.

## Acceso a la Aplicación

- **URL Pública**: https://billetera.qpsecuresolutions.cloud
- **Usuario por Defecto**: admin
- **Contraseña por Defecto**: admin123

⚠️ **IMPORTANTE**: Cambiar la contraseña del usuario admin después del primer login.
