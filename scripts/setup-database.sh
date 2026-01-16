#!/bin/bash

# Script de configuración de base de datos para Billetera App
# Este script ayuda a configurar PostgreSQL para el proyecto

echo "🔧 Configurador de Base de Datos - Billetera App"
echo "================================================"
echo ""

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado."
    echo ""
    echo "Para instalar PostgreSQL:"
    echo "  • Ubuntu/Debian: sudo apt update && sudo apt install postgresql postgresql-contrib"
    echo "  • Fedora/RHEL: sudo dnf install postgresql-server postgresql-contrib"
    echo "  • macOS: brew install postgresql"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL está instalado"

# Verificar si el servicio está corriendo
if ! sudo systemctl is-active --quiet postgresql; then
    echo "⚠️  PostgreSQL no está corriendo. Intentando iniciar..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    if sudo systemctl is-active --quiet postgresql; then
        echo "✅ PostgreSQL iniciado correctamente"
    else
        echo "❌ No se pudo iniciar PostgreSQL. Verifica los logs con:"
        echo "   sudo journalctl -u postgresql -n 50"
        exit 1
    fi
else
    echo "✅ PostgreSQL está corriendo"
fi

# Crear usuario y base de datos
echo ""
echo "📦 Configurando base de datos..."

sudo -u postgres psql <<EOF
-- Crear usuario si no existe
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'wallet') THEN
        CREATE USER wallet WITH PASSWORD 'RNEfka+7qwIZ0L58yGiWamjlHPWyOjwTI/QTZK3373I=';
    END IF;
END
\$\$;

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE wallet OWNER wallet'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'wallet')\gexec

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE wallet TO wallet;

\c wallet
GRANT ALL ON SCHEMA public TO wallet;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO wallet;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO wallet;

\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ Base de datos configurada correctamente"
else
    echo "❌ Error al configurar la base de datos"
    exit 1
fi

# Ejecutar migraciones
echo ""
echo "🔄 Ejecutando migraciones de Prisma..."
cd "$(dirname "$0")/.."
npx prisma db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Configuración completada!"
    echo ""
    echo "Ahora puedes:"
    echo "  1. Crear un usuario: npm run create-user"
    echo "  2. Iniciar el servidor: npm run dev"
else
    echo "❌ Error al ejecutar migraciones"
    exit 1
fi
