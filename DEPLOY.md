# Guía de Deployment - Wallet App

## Información del Proyecto

- **Dominio**: billetera.qpsecuresolutions.cloud
- **Proxy**: Nginx Proxy Manager → http://72.62.15.23:3000
- **SSL**: Let's Encrypt (gestionado por NPM)
- **Stack**: /srv/apps/wallet/
- **Código**: /var/www/billetera/

## Arquitectura de Deployment

### Principio: Todo se sirve desde contenedores Docker

**NO SE DEBE:**
- ❌ Ejecutar `npm run dev` en el servidor
- ❌ Ejecutar `npm run build` en el servidor
- ❌ Ejecutar `node server.js` directamente
- ❌ Usar PM2 o cualquier gestor de procesos
- ❌ Exponer Node.js directamente al público

**SE DEBE:**
- ✅ Todo corre dentro de contenedores Docker
- ✅ Build se hace dentro del contenedor
- ✅ PostgreSQL en contenedor separado
- ✅ Nginx Proxy Manager maneja SSL y proxy
- ✅ Usar scripts automatizados de deployment

### Flujo de Deployment

```
Código en /var/www/billetera
         ↓
Docker Build (multi-stage)
         ↓
Imagen: wallet-wallet-web:latest
         ↓
Contenedor: wallet-web (puerto 3000)
         ↓
Nginx Proxy Manager (SSL)
         ↓
Internet: billetera.qpsecuresolutions.cloud
```

### Scripts de Deployment

| Script | Propósito | Rebuild | Downtime |
|--------|-----------|---------|----------|
| `deploy.sh` | Deployment completo | ✅ Sí | ~2-3 min |
| `update.sh` | Actualización rápida | ❌ No | ~5 seg |
| `start.sh` | Iniciar servicios | ❌ No | N/A |
| `stop.sh` | Detener servicios | ❌ No | N/A |

## Estructura de Archivos

### Directorio de Deployment

**Ubicación:** `/srv/apps/wallet/` (Stack Docker)

```
/srv/apps/wallet/
├── docker-compose.yml    # Orquestación de contenedores
├── .env                  # Variables de entorno (credenciales)
└── data/
    ├── postgres/         # Volumen persistente de PostgreSQL
    │   ├── base/         # Datos de bases de datos
    │   ├── global/       # Catálogos globales
    │   ├── pg_wal/       # Write-Ahead Logs
    │   └── ...           # Archivos internos de PostgreSQL
    └── backups/          # Backups de BD (generados manualmente)
        ├── backup-20260109-120000.sql
        └── backup-20260110-020000.sql.gz
```

### Directorio del Código Fuente

**Ubicación:** `/var/www/billetera/` (Código de la aplicación)

```
/var/www/billetera/
├── app/              # Páginas Next.js App Router
├── components/       # Componentes React
├── lib/              # Utilidades y acciones
│   ├── actions/      # Server Actions de Prisma
│   └── prisma.ts     # Cliente de Prisma
├── prisma/           # Schema de base de datos
│   ├── schema.prisma # Modelo de datos
│   └── migrations/   # Migraciones de BD
├── scripts/          # Scripts de utilidad (create-user)
├── Dockerfile        # Imagen de producción multi-stage
├── .dockerignore     # Archivos excluidos del build
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración TypeScript
└── next.config.ts    # Configuración Next.js
```

### Contenedores en Ejecución

```
CONTAINER ID   IMAGE              NAMES        PORTS                    STATUS
xxxxxxxxxxxx   wallet-web:latest  wallet-web   0.0.0.0:3000->3000/tcp   Up X hours (healthy)
xxxxxxxxxxxx   postgres:16-alpine wallet-db    5432/tcp (internal)      Up X hours (healthy)
```

## Configuración de Red Docker

### Red Interna: wallet-network

**Tipo:** Bridge (driver por defecto)
**Subnet:** Asignado automáticamente por Docker (ej: 172.18.0.0/16)

**Conectividad:**

```
┌────────────────────────────────────────────────────┐
│  Internet                                          │
└────────────────┬───────────────────────────────────┘
                 │
                 │ HTTPS (443)
                 ▼
┌────────────────────────────────────────────────────┐
│  Nginx Proxy Manager (Host separado)              │
│  billetera.qpsecuresolutions.cloud                 │
│  → http://72.62.15.23:3000                         │
└────────────────┬───────────────────────────────────┘
                 │
                 │ HTTP (3000)
                 ▼
┌────────────────────────────────────────────────────┐
│  Host Server (72.62.15.23)                         │
│  └─ 0.0.0.0:3000 → wallet-web:3000                 │
└────────────────┬───────────────────────────────────┘
                 │
    ┌────────────┴──────────────┐
    │  wallet-network (bridge)  │
    │                            │
    │  ┌──────────────────┐     │
    │  │  wallet-web      │     │
    │  │  172.18.0.3:3000 │     │
    │  │  (exposed)       │     │
    │  └────────┬─────────┘     │
    │           │               │
    │           │ TCP:5432      │
    │           ▼               │
    │  ┌──────────────────┐     │
    │  │  wallet-db       │     │
    │  │  172.18.0.2:5432 │     │
    │  │  (internal only) │     │
    │  └──────────────────┘     │
    └───────────────────────────┘
```

**Resolución DNS Interna:**
- `wallet-db` → IP del contenedor PostgreSQL (172.18.0.2)
- `wallet-web` → IP del contenedor Next.js (172.18.0.3)
- Usado en `DATABASE_URL=postgresql://wallet:pass@wallet-db:5432/wallet`

**Puertos Expuestos:**
- `wallet-web`: 3000 → Host 0.0.0.0:3000 (accesible externamente)
- `wallet-db`: 5432 → Solo en wallet-network (NO expuesto al host)

**Seguridad de Red:**
- PostgreSQL NO es accesible desde fuera del host
- Solo `wallet-web` puede conectarse a `wallet-db`
- Tráfico externo pasa por Nginx Proxy Manager con SSL

## Variables de Entorno

Archivo: `/srv/apps/wallet/.env`

```bash
# PostgreSQL (usadas por wallet-db)
POSTGRES_DB=wallet
POSTGRES_USER=wallet
POSTGRES_PASSWORD=<generado-aleatoriamente>

# Prisma / Next.js (usadas por wallet-web)
DATABASE_URL=postgresql://wallet:<password>@wallet-db:5432/wallet
# Nota: usar wallet-db (no localhost) para DNS interno de Docker

# NextAuth.js
NEXTAUTH_SECRET=<generado-aleatoriamente>
# Generar con: openssl rand -base64 32
NEXTAUTH_URL=https://billetera.qpsecuresolutions.cloud

# Node (inyectada automáticamente por docker-compose)
NODE_ENV=production
```

**Importante:**
- Usar `wallet-db` como host (NO `localhost` ni `127.0.0.1`)
- Si la contraseña tiene caracteres especiales, URL-encode en `DATABASE_URL`:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - etc.

## Contenido y Estructura del Dockerfile

**Ubicación:** `/var/www/billetera/Dockerfile`

### Estrategia Multi-Stage Build

El Dockerfile utiliza 4 etapas para optimizar el tamaño final de la imagen:

#### Stage 1: base
```dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
```
- **Propósito:** Imagen base compartida
- **Componentes:**
  - Node.js 20 en Alpine Linux (~50MB)
  - OpenSSL (requerido por Prisma Engine)
  - libc6-compat (compatibilidad de bibliotecas)

#### Stage 2: deps
```dockerfile
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
```
- **Propósito:** Instalar dependencias
- **Estrategia:** `npm ci` (clean install) para reproducibilidad
- **Output:** `node_modules/` completo (~300MB)

#### Stage 3: builder
```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
```
- **Propósito:** Compilar aplicación
- **Pasos:**
  1. Copiar dependencias de stage anterior
  2. Copiar código fuente completo
  3. Generar Prisma Client (`node_modules/.prisma/client`)
  4. Compilar Next.js → `.next/` directory
- **Output:**
  - `.next/standalone` - Servidor optimizado
  - `.next/static` - Assets estáticos
  - `public/` - Archivos públicos

#### Stage 4: runner (Imagen Final)
```dockerfile
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.* ./

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD npx prisma migrate deploy && node_modules/.bin/next start
```
- **Propósito:** Imagen de producción optimizada
- **Seguridad:**
  - Usuario no-root (`nextjs:nodejs`)
  - UID/GID fijos (1001)
- **Archivos incluidos:**
  - Solo build artifacts necesarios
  - No incluye código fuente TypeScript
  - No incluye devDependencies
- **Comando de inicio:**
  1. `prisma migrate deploy` - Aplicar migraciones pendientes
  2. `next start` - Iniciar servidor en puerto 3000

**Tamaño final de la imagen:** ~400-450MB

### Archivos Excluidos (.dockerignore)

```
node_modules
.next
.git
.env*
npm-debug.log*
.DS_Store
coverage
.vercel
README.md
```

**Beneficios:**
- Reduce tamaño del contexto de build
- Excluye archivos sensibles (.env)
- Acelera el proceso de build

## Comandos de Deployment

### Scripts Automatizados (Recomendado)

#### 1. Deployment Completo (Con Rebuild)

```bash
cd /srv/apps/wallet
./deploy.sh
```

Este script ejecuta:
- Actualiza código fuente (git pull)
- Construye imagen Docker desde cero
- Detiene contenedores actuales
- Inicia nuevos contenedores
- Ejecuta migraciones de Prisma automáticamente
- Verifica health de la aplicación
- Muestra logs y estado final

**Usar cuando:**
- Primera instalación
- Cambios en dependencias (package.json)
- Cambios en Dockerfile
- Actualizaciones mayores

#### 2. Actualización Rápida (Sin Rebuild)

```bash
cd /srv/apps/wallet
./update.sh
```

Este script ejecuta:
- Actualiza código fuente (git pull)
- Reinicia contenedor sin rebuild
- Verifica health

**Usar cuando:**
- Cambios menores en código
- Actualizaciones de UI/lógica
- No hay cambios en dependencias

#### 3. Iniciar Servicios

```bash
cd /srv/apps/wallet
./start.sh
```

#### 4. Detener Servicios

```bash
cd /srv/apps/wallet
./stop.sh
```

### Comandos Manuales de Docker

#### 1. Levantar Stack (primera vez)

```bash
cd /srv/apps/wallet
docker compose --env-file .env up -d --build
```

#### 2. Ver Logs

```bash
# Todos los servicios
docker compose -f /srv/apps/wallet/docker-compose.yml logs -f

# Solo web
docker logs -f wallet-web

# Solo BD
docker logs -f wallet-db
```

#### 3. Rebuild después de cambios

```bash
cd /var/www/billetera
# Hacer cambios en el código

cd /srv/apps/wallet
docker compose down
docker compose --env-file .env up -d --build
```

#### 4. Crear Usuario Inicial

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
