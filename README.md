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
