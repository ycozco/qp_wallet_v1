#!/bin/bash

echo "🔄 Reiniciando aplicación Billetera..."
echo "======================================"

# Matar procesos existentes
echo "1. Deteniendo procesos anteriores..."
pkill -f "next dev" || true
sleep 2

# Limpiar cache
echo "2. Limpiando caché..."
cd /var/www/billetera
rm -rf .next
rm -rf node_modules/.cache

# Generar Prisma client
echo "3. Generando Prisma client..."
npx prisma generate

# Iniciar servidor de desarrollo
echo "4. Iniciando servidor en puerto 3002..."
npm run dev -- --port 3002 > /tmp/billetera-dev.log 2>&1 &

# Esperar a que inicie
echo "5. Esperando que el servidor inicie..."
sleep 8

# Verificar
if ps aux | grep -v grep | grep "next dev" > /dev/null; then
    echo ""
    echo "✅ Servidor iniciado correctamente"
    echo "🌐 Accede en: http://localhost:3002/dashboard/wallets"
    echo "📝 Logs: tail -f /tmp/billetera-dev.log"
    echo ""
else
    echo ""
    echo "❌ Error al iniciar servidor"
    echo "Revisa los logs: cat /tmp/billetera-dev.log"
    echo ""
    exit 1
fi
