#!/bin/bash

# Script de Pruebas de Interactividad
# Billetera App - Test Suite
# Fecha: 16 de Enero, 2026

set -e

echo "🧪 Iniciando Tests de Interactividad"
echo "===================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0
TOTAL=0

# Función para tests
test_check() {
    TOTAL=$((TOTAL + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $2"
        FAILED=$((FAILED + 1))
    fi
}

echo -e "${BLUE}1. Verificación del Servidor${NC}"
echo "================================"

# Test 1: Servidor está corriendo
if ps aux | grep -v grep | grep "next dev" > /dev/null; then
    test_check 0 "Servidor Next.js está corriendo"
else
    test_check 1 "Servidor Next.js NO está corriendo"
fi

# Test 2: Puerto 3002 está activo
if nc -z localhost 3002 2>/dev/null; then
    test_check 0 "Puerto 3002 está escuchando"
else
    test_check 1 "Puerto 3002 NO está accesible"
fi

# Test 3: Endpoint responde
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/dashboard/wallets 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    test_check 0 "Endpoint /dashboard/wallets responde 200"
else
    test_check 1 "Endpoint /dashboard/wallets NO responde correctamente (HTTP $HTTP_CODE)"
fi

echo ""
echo -e "${BLUE}2. Verificación de Archivos${NC}"
echo "============================"

# Test 4: WalletCard existe
if [ -f "/var/www/billetera/components/dashboard/wallet-card.tsx" ]; then
    test_check 0 "WalletCard component existe"
else
    test_check 1 "WalletCard component NO existe"
fi

# Test 5: GlassCard existe
if [ -f "/var/www/billetera/components/ui/glass-card.tsx" ]; then
    test_check 0 "GlassCard component existe"
else
    test_check 1 "GlassCard component NO existe"
fi

# Test 6: CreateWalletDialog existe
if [ -f "/var/www/billetera/components/dashboard/create-wallet-dialog.tsx" ]; then
    test_check 0 "CreateWalletDialog component existe"
else
    test_check 1 "CreateWalletDialog component NO existe"
fi

# Test 7: ThemeToggle existe
if [ -f "/var/www/billetera/components/theme-toggle.tsx" ]; then
    test_check 0 "ThemeToggle component existe"
else
    test_check 1 "ThemeToggle component NO existe"
fi

echo ""
echo -e "${BLUE}3. Verificación de Código${NC}"
echo "=========================="

# Test 8: WalletCard es Client Component
if grep -q "'use client'" /var/www/billetera/components/dashboard/wallet-card.tsx; then
    test_check 0 "WalletCard tiene 'use client'"
else
    test_check 1 "WalletCard NO tiene 'use client'"
fi

# Test 9: GlassCard tiene z-index correcto
if grep -q "z-10" /var/www/billetera/components/ui/glass-card.tsx; then
    test_check 0 "GlassCard tiene z-10 en children"
else
    test_check 1 "GlassCard NO tiene z-10 correcto"
fi

# Test 10: WalletCard usa stopPropagation
if grep -q "stopPropagation" /var/www/billetera/components/dashboard/wallet-card.tsx; then
    test_check 0 "WalletCard usa stopPropagation"
else
    test_check 1 "WalletCard NO usa stopPropagation"
fi

# Test 11: CreateWalletDialog usa Dialog de Radix
if grep -q "@/components/ui/dialog" /var/www/billetera/components/dashboard/create-wallet-dialog.tsx; then
    test_check 0 "CreateWalletDialog usa Dialog component"
else
    test_check 1 "CreateWalletDialog NO usa Dialog component"
fi

# Test 12: ThemeToggle es Client Component
if grep -q "'use client'" /var/www/billetera/components/theme-toggle.tsx; then
    test_check 0 "ThemeToggle tiene 'use client'"
else
    test_check 1 "ThemeToggle NO tiene 'use client'"
fi

echo ""
echo -e "${BLUE}4. Verificación de Links${NC}"
echo "========================"

# Test 13: WalletCard tiene Link a detalles
if grep -q "href={\`/dashboard/wallets/\${wallet.id}\`}" /var/www/billetera/components/dashboard/wallet-card.tsx; then
    test_check 0 "WalletCard tiene Link a detalle correcto"
else
    test_check 1 "WalletCard NO tiene Link correcto"
fi

# Test 14: WalletCard tiene Link a transacciones
if grep -q "/dashboard/transactions/new" /var/www/billetera/components/dashboard/wallet-card.tsx; then
    test_check 0 "WalletCard tiene Link a nueva transacción"
else
    test_check 1 "WalletCard NO tiene Link a transacciones"
fi

echo ""
echo -e "${BLUE}5. Verificación de Base de Datos${NC}"
echo "================================="

# Test 15: PostgreSQL está corriendo
if docker ps | grep wallet-db > /dev/null 2>&1; then
    test_check 0 "PostgreSQL container está corriendo"
else
    test_check 1 "PostgreSQL container NO está corriendo"
fi

# Test 16: Database tiene datos
cd /var/www/billetera
WALLET_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"Account\";" 2>/dev/null | grep -oP '\d+' | head -1 || echo "0")
if [ "$WALLET_COUNT" -gt 0 ] 2>/dev/null; then
    test_check 0 "Database tiene wallets ($WALLET_COUNT encontrados)"
else
    test_check 1 "Database NO tiene wallets"
fi

echo ""
echo -e "${BLUE}6. Verificación de Compilación${NC}"
echo "==============================="

# Test 17: No hay errores críticos de TypeScript
cd /var/www/billetera
TS_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
if [ "$TS_ERRORS" -eq 0 ]; then
    test_check 0 "Sin errores de TypeScript"
else
    test_check 1 "Hay $TS_ERRORS errores de TypeScript"
fi

echo ""
echo "===================================="
echo -e "${BLUE}RESUMEN DE TESTS${NC}"
echo "===================================="
echo -e "Total: ${TOTAL}"
echo -e "${GREEN}Pasados: ${PASSED}${NC}"
echo -e "${RED}Fallados: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
    echo ""
    echo "🎉 La aplicación está lista para pruebas manuales en:"
    echo "   http://localhost:3002/dashboard/wallets"
    echo ""
    exit 0
else
    echo -e "${RED}❌ ALGUNOS TESTS FALLARON${NC}"
    echo ""
    echo "Revisa los errores arriba y corrige antes de continuar."
    echo ""
    exit 1
fi
