#!/bin/bash

# 🚀 Script de inicio rápido para Billetera App
# Este script verifica y configura todo lo necesario para ejecutar la aplicación

echo "🚀 Billetera App - Inicio Rápido"
echo "================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Verificar Node.js
echo "1. Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js instalado: $NODE_VERSION"
else
    print_error "Node.js no está instalado"
    echo "   Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# 2. Verificar PostgreSQL
echo ""
echo "2. Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    print_success "PostgreSQL instalado"
    
    # Verificar si está corriendo
    if sudo systemctl is-active --quiet postgresql 2>/dev/null || pgrep -x postgres > /dev/null; then
        print_success "PostgreSQL está corriendo"
    else
        print_warning "PostgreSQL no está corriendo"
        echo "   Ejecuta: ./scripts/setup-database.sh"
        exit 1
    fi
else
    print_error "PostgreSQL no está instalado"
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    exit 1
fi

# 3. Verificar dependencias npm
echo ""
echo "3. Verificando dependencias..."
if [ -d "node_modules" ]; then
    print_success "Dependencias instaladas"
else
    print_warning "Instalando dependencias..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencias instaladas correctamente"
    else
        print_error "Error al instalar dependencias"
        exit 1
    fi
fi

# 4. Verificar archivo .env
echo ""
echo "4. Verificando configuración..."
if [ -f ".env" ]; then
    print_success "Archivo .env encontrado"
else
    print_error "Archivo .env no encontrado"
    exit 1
fi

# 5. Verificar conexión a base de datos
echo ""
echo "5. Verificando base de datos..."
if npx prisma db execute --stdin <<< "SELECT 1" &> /dev/null; then
    print_success "Conexión a base de datos exitosa"
else
    print_warning "No se puede conectar a la base de datos"
    echo "   Ejecuta: ./scripts/setup-database.sh"
    
    read -p "¿Quieres ejecutar el script de configuración ahora? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        ./scripts/setup-database.sh
        if [ $? -ne 0 ]; then
            print_error "Error en la configuración de la base de datos"
            exit 1
        fi
    else
        exit 1
    fi
fi

# 6. Verificar si hay usuarios
echo ""
echo "6. Verificando usuarios..."
USER_COUNT=$(psql -U wallet -d wallet -h localhost -t -c "SELECT COUNT(*) FROM users" 2>/dev/null | xargs)
if [ -z "$USER_COUNT" ] || [ "$USER_COUNT" -eq "0" ]; then
    print_warning "No hay usuarios en la base de datos"
    echo ""
    read -p "¿Quieres crear un usuario ahora? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        npm run create-user
    else
        print_warning "Recuerda crear un usuario antes de usar la aplicación"
        echo "   Ejecuta: npm run create-user"
    fi
else
    print_success "Base de datos contiene $USER_COUNT usuario(s)"
fi

# 7. Todo listo
echo ""
echo "================================"
print_success "¡Todo está listo para comenzar!"
echo ""
echo "Ejecuta los siguientes comandos:"
echo ""
echo "  # Iniciar servidor de desarrollo"
echo "  npm run dev"
echo ""
echo "  # Luego abre tu navegador en:"
echo "  http://localhost:3000"
echo ""
echo "📚 Documentación:"
echo "  - README_COMPLETO.md - Guía completa del proyecto"
echo "  - TESTING.md - Guía de testing"
echo "  - CAMBIOS_IMPLEMENTADOS.md - Últimos cambios"
echo ""
print_success "¡Disfruta usando Billetera App! 💰"
