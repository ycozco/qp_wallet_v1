# Wallet App - Sistema de Gestión Financiera Personal

Una aplicación web completa para gestionar finanzas personales construida con Next.js, Prisma y PostgreSQL.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 con App Router, React 19, TailwindCSS
- **Backend**: Next.js API Routes con Server Actions
- **Base de Datos**: PostgreSQL 16
- **ORM**: Prisma 5
- **Autenticación**: NextAuth.js v5 (credenciales locales, preparado para Google)
- **Deployment**: Docker Compose
- **Proxy Inverso**: Nginx Proxy Manager con SSL Let's Encrypt

## 📁 Estructura del Proyecto

```
wallet-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas del dashboard
│   └── login/             # Página de login
├── components/            # Componentes React
│   ├── dashboard/         # Componentes específicos del dashboard
│   └── ui/                # Componentes UI reutilizables
├── lib/                   # Utilidades y librerías
│   ├── actions/           # Server Actions de Prisma
│   └── prisma.ts          # Cliente de Prisma
├── prisma/                # Schema y migraciones de base de datos
│   ├── schema.prisma      # Modelo de datos
│   └── migrations/        # Migraciones de BD
├── scripts/               # Scripts de utilidad
└── types/                 # Definiciones de tipos TypeScript
```

## 🗄️ Modelo de Base de Datos

### Tablas Principales:

- **users**: Usuarios del sistema
- **auth_providers**: Proveedores de autenticación (local/google)
- **accounts**: Cuentas financieras (banco, efectivo, tarjetas)
- **categories**: Categorías de ingresos/gastos
- **transactions**: Movimientos financieros (ingresos/gastos)
- **transfers**: Transferencias entre cuentas
- **tags**: Etiquetas para transacciones
- **transaction_tags**: Relación N:M entre transacciones y etiquetas

## ✨ Características Implementadas

### Autenticación y Seguridad
- ✅ Login con usuario/contraseña (bcrypt)
- ✅ Sesiones seguras con NextAuth.js
- ✅ Protección de rutas con middleware
- 🔄 Preparado para autenticación con Google (schema listo, sin implementar)

### Dashboard
- ✅ KPIs del mes actual (ingresos, gastos, balance)
- ✅ Contador de cuentas
- ✅ Listado de movimientos recientes

### Cuentas
- ✅ Crear cuenta (efectivo, banco, tarjeta, billetera digital)
- ✅ Listar cuentas
- ✅ Eliminar cuenta
- ✅ Soporte de múltiples monedas (PEN, USD, EUR)

### Categorías
- ✅ Crear categoría (gasto/ingreso/ambos)
- ✅ Listar categorías
- ✅ Eliminar categoría

### Movimientos
- ✅ Listar transacciones con detalles
- ✅ Filtrado por fecha (mes actual)
- 🔄 Formulario de creación (estructura lista, sin UI completa)

### Transferencias
- ✅ Listar transferencias entre cuentas
- 🔄 Formulario de creación (estructura lista, sin UI completa)

### Perfil
- ✅ Vista de información del usuario

## 🌐 Acceso a la Aplicación

- **URL**: https://billetera.qpsecuresolutions.cloud
- **Usuario por Defecto**: admin
- **Contraseña por Defecto**: admin123

⚠️ **IMPORTANTE**: Cambiar la contraseña del usuario admin después del primer acceso.

## 🛠️ Deployment

El proyecto está desplegado usando Docker Compose con dos servicios:

- `wallet-db`: PostgreSQL 16 (interno, no expuesto)
- `wallet-web`: Next.js en producción (puerto 3000 en el host)

## 🐳 Configuración de Contenedores

### Arquitectura Docker

La aplicación utiliza una arquitectura multi-contenedor con Docker Compose:

```
┌─────────────────────────────────────────────┐
│   Nginx Proxy Manager (Host Externo)       │
│   https://billetera.qpsecuresolutions.cloud │
└──────────────────┬──────────────────────────┘
                   │ SSL/TLS
                   │ Puerto 443
                   ▼
┌─────────────────────────────────────────────┐
│   Host: 72.62.15.23:3000                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  wallet-web (Next.js)                       │
│  - Puerto: 3000:3000                        │
│  - Red: wallet-network                      │
│  - Volumen: código compilado                │
└──────────────────┬──────────────────────────┘
                   │
                   │ DATABASE_URL
                   │ wallet-db:5432
                   ▼
┌─────────────────────────────────────────────┐
│  wallet-db (PostgreSQL 16)                  │
│  - Puerto: 5432 (solo interno)              │
│  - Red: wallet-network                      │
│  - Volumen: ./data/postgres                 │
└─────────────────────────────────────────────┘
```

### Ubicaciones en el Servidor

**Ruta del Stack Docker:**
- `/srv/apps/wallet/` - Configuración de deployment
  - `docker-compose.yml` - Orquestación de contenedores
  - `.env` - Variables de entorno (credenciales)
  - `data/postgres/` - Datos persistentes de PostgreSQL
  - `data/backups/` - Backups de base de datos

**Ruta del Código Fuente:**
- `/var/www/billetera/` - Código fuente de la aplicación
  - Usado durante el build del contenedor
  - Referenciado en docker-compose.yml con `build.context`

### Archivo docker-compose.yml

**Ubicación:** `/srv/apps/wallet/docker-compose.yml`

```yaml
version: '3.8'

services:
  wallet-db:
    image: postgres:16-alpine
    container_name: wallet-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - wallet-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  wallet-web:
    build:
      context: /var/www/billetera
      dockerfile: Dockerfile
    container_name: wallet-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NODE_ENV: production
    depends_on:
      wallet-db:
        condition: service_healthy
    networks:
      - wallet-network

networks:
  wallet-network:
    driver: bridge
```

### Configuración de Red

**Red Docker:** `wallet-network` (bridge)
- Aislamiento entre contenedores
- Comunicación interna mediante nombres de servicio
- Solo `wallet-web` expone puerto al host (3000)

**Conectividad:**
- `wallet-db` → Accesible SOLO desde `wallet-network`
- `wallet-web` → Accesible desde:
  - Red interna: `wallet-network`
  - Host: `127.0.0.1:3000` y `0.0.0.0:3000`
  - Externa: A través de Nginx Proxy Manager

**DNS Interno:**
- `wallet-db` → Resuelve a la IP del contenedor PostgreSQL
- Usado en: `DATABASE_URL=postgresql://wallet:pass@wallet-db:5432/wallet`

### Contenido del Dockerfile

**Ubicación:** `/var/www/billetera/Dockerfile`

**Estrategia:** Multi-stage build (optimización de tamaño)

**Etapas:**

1. **base** - Imagen base con Node.js 20 Alpine
   - Instala OpenSSL (requerido por Prisma)
   - Instala libc6-compat (compatibilidad)

2. **deps** - Instalación de dependencias
   - Copia `package.json` y `package-lock.json`
   - Ejecuta `npm ci` (instalación limpia)

3. **builder** - Compilación de la aplicación
   - Genera cliente de Prisma (`npx prisma generate`)
   - Compila Next.js (`npm run build`)
   - Genera `.next/` con assets estáticos optimizados

4. **runner** - Imagen final de producción
   - Crea usuario no-root `nextjs:nodejs` (seguridad)
   - Copia solo archivos necesarios:
     - `/app/public` - Assets estáticos
     - `/app/.next` - Aplicación compilada
     - `/app/node_modules` - Dependencias de producción
     - `/app/prisma` - Schema para migraciones
   - Expone puerto 3000
   - **CMD:** `npx prisma migrate deploy && node_modules/.bin/next start`
     - Ejecuta migraciones pendientes al inicio
     - Inicia servidor Next.js en modo producción

**Tamaño de imagen:** ~400MB (optimizado con Alpine Linux)

### Variables de Entorno del Contenedor

**Archivo:** `/srv/apps/wallet/.env` (usado por docker-compose)

```bash
# PostgreSQL
POSTGRES_DB=wallet
POSTGRES_USER=wallet
POSTGRES_PASSWORD=<aleatorio-seguro>

# Next.js / Prisma
DATABASE_URL=postgresql://wallet:<password-encoded>@wallet-db:5432/wallet

# NextAuth.js
NEXTAUTH_SECRET=<generado-con-openssl>
NEXTAUTH_URL=https://billetera.qpsecuresolutions.cloud

# Node
NODE_ENV=production
```

**Notas importantes:**
- Las contraseñas deben estar URL-encoded en `DATABASE_URL`
- El `NEXTAUTH_SECRET` se genera con: `openssl rand -base64 32`
- El host `wallet-db` funciona por el DNS interno de Docker

### Volúmenes Persistentes

**wallet-db:**
- Host: `/srv/apps/wallet/data/postgres`
- Contenedor: `/var/lib/postgresql/data`
- Contiene: Bases de datos, tablas, índices, WAL logs

**wallet-web:**
- Sin volúmenes persistentes (stateless)
- Todo el código está dentro de la imagen

### Health Checks y Dependencias

**wallet-db:**
- Command: `pg_isready -U wallet -d wallet`
- Intervalo: 10s
- Timeout: 5s
- Retries: 5

**wallet-web:**
- Espera a que `wallet-db` esté healthy antes de iniciar
- `depends_on.wallet-db.condition: service_healthy`
- Garantiza que la BD está lista antes de ejecutar migraciones

### Comandos Útiles

```bash
# Ver logs
docker logs -f wallet-web

# Reiniciar servicios
cd /srv/apps/wallet
docker compose down
docker compose --env-file .env up -d

# Rebuild completo
docker compose down
docker compose --env-file .env up -d --build

# Crear nuevo usuario
docker exec -it wallet-web npx tsx scripts/create-user.ts username password

# Backup de BD
docker exec wallet-db pg_dump -U wallet wallet > backup.sql

# Restore de BD
docker exec -i wallet-db psql -U wallet wallet < backup.sql
```

## �� Variables de Entorno

Archivo: `/srv/apps/wallet/.env`

- `POSTGRES_DB`: Nombre de la base de datos
- `POSTGRES_USER`: Usuario de PostgreSQL
- `POSTGRES_PASSWORD`: Contraseña de PostgreSQL (generada aleatoriamente)
- `DATABASE_URL`: URL de conexión completa (con caracteres especiales codificados)
- `NEXTAUTH_SECRET`: Secret para NextAuth (generado aleatoriamente)
- `NEXTAUTH_URL`: URL pública de la aplicación

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Sesiones seguras con cookies httpOnly
- SSL/TLS gestionado por Nginx Proxy Manager
- Base de datos no expuesta públicamente
- Variables de entorno con permisos 600

## 📊 Estado del Proyecto

### Completado (MVP Funcional)
- ✅ Infraestructura Docker completa
- ✅ Base de datos con schema completo
- ✅ Autenticación local funcional
- ✅ CRUD básico de cuentas y categorías
- ✅ Listado de movimientos y transferencias
- ✅ Dashboard con KPIs básicos
- ✅ Deployment en producción

### Pendiente (Mejoras Futuras)
- ⏳ Formularios completos de transacciones y transferencias
- ⏳ Gráficos avanzados (Recharts)
- ⏳ Filtros y búsqueda avanzada
- ⏳ Exportación a CSV/PDF
- ⏳ Presupuestos y alertas
- ⏳ Movimientos recurrentes
- ⏳ Autenticación con Google OAuth

## 📖 Documentación Adicional

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones detalladas de deployment, troubleshooting y mantenimiento.

## 🤝 Contribuciones

Este es un proyecto MVP funcional. Las mejoras futuras pueden incluir:
- Completar formularios faltantes
- Agregar más visualizaciones
- Implementar autenticación con Google
- Agregar tests unitarios e integración
- Optimizar performance y caching

## 📄 Licencia

Proyecto privado para uso interno.
