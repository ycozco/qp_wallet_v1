# 💰 Billetera - Gestor de Finanzas Personales

Aplicación web moderna para gestionar tus finanzas personales, construida con Next.js 16, TypeScript, Prisma y PostgreSQL.

## ✨ Características Implementadas

### 🔐 Autenticación
- Login seguro con NextAuth
- Sesiones persistentes
- Protección de rutas

### 💳 Gestión de Cuentas
- ✅ Crear cuentas (Efectivo, Banco, Tarjeta, Billetera Digital)
- ✅ Listar cuentas
- ✅ **Balance actual calculado automáticamente**
- ✅ Eliminar cuentas
- ✅ Múltiples monedas (PEN, USD, EUR)

### 📊 Gestión de Transacciones
- ✅ Registrar ingresos y gastos
- ✅ Listar transacciones con detalles
- ✅ **Eliminar transacciones**
- ✅ Categorización opcional
- ✅ **Validación de fondos suficientes**

### 🔄 Transferencias entre Cuentas
- ✅ Transferir dinero entre tus cuentas
- ✅ Listar transferencias
- ✅ **Eliminar transferencias**
- ✅ **Validación de fondos suficientes**

### 🏷️ Categorías
- ✅ Crear categorías personalizadas
- ✅ Categorías para ingresos, gastos o ambos
- ✅ Eliminar categorías

### 📈 Balances y Estadísticas
- ✅ **Balance actual por cuenta (calculado en tiempo real)**
- ✅ Validación de fondos antes de operaciones
- ✅ Funciones helper para estadísticas financieras

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### Paso 1: Clonar e Instalar Dependencias

\`\`\`bash
cd /var/www/billetera
npm install
\`\`\`

### Paso 2: Configurar Base de Datos

#### Opción A: Script Automático (Recomendado)

\`\`\`bash
# Ejecutar script de configuración
./scripts/setup-database.sh
\`\`\`

Este script:
- Verifica que PostgreSQL esté instalado
- Inicia el servicio si está detenido
- Crea la base de datos y usuario
- Ejecuta las migraciones de Prisma

#### Opción B: Configuración Manual

\`\`\`bash
# 1. Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. Iniciar servicio
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. Crear base de datos y usuario
sudo -u postgres psql <<EOF
CREATE USER wallet WITH PASSWORD 'RNEfka+7qwIZ0L58yGiWamjlHPWyOjwTI/QTZK3373I=';
CREATE DATABASE wallet OWNER wallet;
GRANT ALL PRIVILEGES ON DATABASE wallet TO wallet;
\\c wallet
GRANT ALL ON SCHEMA public TO wallet;
EOF

# 4. Ejecutar migraciones
npx prisma db push
\`\`\`

### Paso 3: Configurar Variables de Entorno

El archivo \`.env\` ya está configurado:

\`\`\`env
DATABASE_URL="postgresql://wallet:RNEfka+7qwIZ0L58yGiWamjlHPWyOjwTI%2FQTZK3373I%3D@localhost:5432/wallet"
NEXTAUTH_SECRET="3ac7f3067e82825709c79a352a40c9f997c421ec687c8b7f3e08cf6bd323235e"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

### Paso 4: Crear Usuario de Prueba

\`\`\`bash
npm run create-user
\`\`\`

Sigue las instrucciones para crear tu primer usuario.

### Paso 5: Iniciar la Aplicación

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📝 Uso de la Aplicación

### Primera vez

1. **Acceder a la aplicación** → http://localhost:3000
2. **Iniciar sesión** con el usuario creado
3. **Crear al menos una cuenta** en "Cuentas" → "Nueva Cuenta"
4. **Crear categorías** (opcional) en "Categorías"
5. **Registrar movimientos** en "Movimientos" → "Nuevo Movimiento"

### Flujo de trabajo típico

```
1. Crear cuenta → "Billetera Principal" (Efectivo, PEN, 1000.00)
2. Crear categorías → "Alimentos", "Transporte", "Salario"
3. Registrar un gasto → -50.00 PEN, categoría "Alimentos"
4. Verificar balance → Se actualiza automáticamente
5. Crear otra cuenta → "Ahorro" (Banco, PEN, 0.00)
6. Transferir → 200.00 de "Billetera" a "Ahorro"
```

## 🔧 Funcionalidades Clave

### ✅ Balance Automático

Cada cuenta muestra:
- **Balance Inicial**: El monto con el que se creó
- **Balance Actual**: Calculado automáticamente considerando:
  - ➕ Ingresos
  - ➖ Gastos
  - ➕ Transferencias recibidas
  - ➖ Transferencias enviadas

### ✅ Validación de Fondos

Al crear gastos o transferencias, el sistema:
1. Calcula el balance actual de la cuenta
2. Verifica que haya fondos suficientes
3. Muestra error si no hay saldo disponible

### ✅ Botones de Eliminar

Todas las secciones tienen botón de eliminar:
- 🗑️ Cuentas
- 🗑️ Categorías
- 🗑️ **Transacciones** (nuevo)
- 🗑️ **Transferencias** (nuevo)

## 📂 Estructura del Proyecto

\`\`\`
billetera/
├── app/
│   ├── api/              # API routes y autenticación
│   ├── dashboard/        # Páginas del dashboard
│   │   ├── accounts/     # Gestión de cuentas
│   │   ├── categories/   # Gestión de categorías
│   │   ├── transactions/ # Gestión de transacciones ✨
│   │   ├── transfers/    # Gestión de transferencias ✨
│   │   ├── reports/      # Reportes (pendiente)
│   │   └── profile/      # Perfil de usuario (pendiente)
│   └── login/            # Página de login
├── components/           # Componentes reutilizables
│   ├── dashboard/        # Componentes del dashboard
│   └── ui/               # Componentes UI base
├── lib/
│   ├── actions/          # Server Actions
│   │   ├── accounts.ts   
│   │   ├── balances.ts   # ✨ Cálculo de balances (nuevo)
│   │   ├── categories.ts
│   │   ├── transactions.ts # ✨ Con validación de fondos
│   │   └── transfers.ts    # ✨ Con validación de fondos
│   ├── actions.ts        # Actions principales
│   ├── prisma.ts         # Cliente de Prisma
│   └── utils.ts          # Utilidades
├── prisma/
│   ├── schema.prisma     # Schema de base de datos
│   └── migrations/       # Migraciones
├── scripts/
│   ├── create-user.ts    # Script para crear usuarios
│   └── setup-database.sh # ✨ Script de configuración DB (nuevo)
├── .env                  # Variables de entorno
├── TESTING.md            # ✨ Guía completa de testing (nuevo)
└── README.md             # Este archivo
\`\`\`

## 🧪 Testing

Consulta [TESTING.md](./TESTING.md) para:
- Plan completo de testing manual
- Checklist de verificación
- Solución de problemas comunes
- Estado de todas las funcionalidades

## 🔍 Solución de Problemas

### Error: "Can't reach database server"

\`\`\`bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql

# Ejecutar script de configuración
./scripts/setup-database.sh
\`\`\`

### Error: "No autorizado"

- Asegúrate de estar logueado
- Limpia las cookies del navegador
- Verifica que \`NEXTAUTH_SECRET\` esté en \`.env\`

### Botones no funcionan

1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña Console
3. Verifica errores de red en la pestaña Network
4. Asegúrate de que la base de datos esté corriendo

### Fondos insuficientes (aunque hay saldo)

- El sistema calcula el balance en tiempo real
- Verifica todas las transacciones de la cuenta
- Asegúrate de no tener transacciones duplicadas

## 📊 Estado del Proyecto

| Módulo | Completado |
|--------|-----------|
| Autenticación | ✅ 100% |
| Cuentas | ✅ 90% |
| Categorías | ✅ 75% |
| Transacciones | ✅ 90% |
| Transferencias | ✅ 90% |
| Balances | ✅ 100% |
| Dashboard | ⚠️ 40% |
| Reportes | ❌ 0% |
| Perfil | ❌ 0% |

**Estado Global: ~75% completado**

## 🎯 Próximas Funcionalidades

### Corto plazo
- [ ] Editar cuentas
- [ ] Editar transacciones
- [ ] Editar transferencias
- [ ] Filtros en listados

### Mediano plazo
- [ ] Dashboard funcional con gráficos
- [ ] Reportes de ingresos/gastos
- [ ] Exportar datos a CSV/Excel
- [ ] Búsqueda avanzada

### Largo plazo
- [ ] Presupuestos mensuales
- [ ] Metas de ahorro
- [ ] Recordatorios de pagos
- [ ] Multi-moneda con tasas de cambio

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js v5
- **Validación**: Zod
- **Formularios**: React Hook Form
- **Iconos**: Heroicons
- **Fechas**: date-fns
- **Animaciones**: Framer Motion

## 📄 Licencia

Este proyecto es privado.

## 👤 Autor

Desarrollado para gestión personal de finanzas.

---

## 📞 Soporte

Para problemas o preguntas:
1. Consulta [TESTING.md](./TESTING.md)
2. Revisa la sección de Solución de Problemas
3. Verifica los logs del servidor en la terminal

---

**¡Disfruta gestionando tus finanzas! 💰**
