#!/bin/bash

# ================================================================================
# VERIFICACIÓN RÁPIDA DE INTERACTIVIDAD - Billetera App
# ================================================================================

echo ""
echo "🔍 VERIFICACIÓN DE COMPONENTES INTERACTIVOS"
echo "============================================"
echo ""

# 1. Verificar que WalletCard sea clickeable
echo "1️⃣  WalletCard Component:"
if grep -q "'use client'" /var/www/billetera/components/dashboard/wallet-card.tsx && \
   grep -q "Link href" /var/www/billetera/components/dashboard/wallet-card.tsx; then
    echo "   ✅ Es client component con Link"
else
    echo "   ❌ Problemas encontrados"
fi

# 2. Verificar GlassCard z-index
echo ""
echo "2️⃣  GlassCard Component:"
if grep -q 'className="relative z-10"' /var/www/billetera/components/ui/glass-card.tsx; then
    echo "   ✅ Tiene z-10 en children (no bloquea clicks)"
else
    echo "   ⚠️  Revisar z-index"
fi

# 3. Verificar CreateWalletDialog
echo ""
echo "3️⃣  CreateWalletDialog:"
if grep -q "Dialog" /var/www/billetera/components/dashboard/create-wallet-dialog.tsx && \
   grep -q "DialogTrigger asChild" /var/www/billetera/components/dashboard/create-wallet-dialog.tsx; then
    echo "   ✅ Usa Radix Dialog con asChild"
else
    echo "   ❌ Problemas con Dialog"
fi

# 4. Verificar ThemeToggle
echo ""
echo "4️⃣  ThemeToggle:"
if grep -q "'use client'" /var/www/billetera/components/theme-toggle.tsx && \
   grep -q "useTheme" /var/www/billetera/components/theme-toggle.tsx; then
    echo "   ✅ Client component con next-themes"
else
    echo "   ❌ Problemas con theme"
fi

# 5. Verificar servidor
echo ""
echo "5️⃣  Servidor Next.js:"
if ps aux | grep -v grep | grep "next dev" > /dev/null; then
    echo "   ✅ Corriendo en puerto 3002"
else
    echo "   ❌ NO está corriendo"
fi

echo ""
echo "============================================"
echo ""
echo "📋 CHECKLIST DE FUNCIONALIDAD:"
echo ""
echo "Para probar manualmente, abre: http://localhost:3002/dashboard/wallets"
echo ""
echo "Prueba estos clicks:"
echo "  [ ] Click en cualquier parte de una card de billetera"
echo "  [ ] Click en botón 'Ver Detalles' (azul)"
echo "  [ ] Click en botón 'Transacción' (gris)"
echo "  [ ] Click en menú de 3 puntos de una card"
echo "  [ ] Click en botón 'Nueva Cuenta' (header morado)"
echo "  [ ] Click en card 'Agregar Nueva Cuenta' (borde punteado)"
echo "  [ ] Click en toggle de tema (sol/luna)"
echo ""
echo "Verifica que:"
echo "  ✓ NO haya errores en la consola del navegador"
echo "  ✓ NO haya warnings de React (nested <a>, hydration, etc)"
echo "  ✓ Los hovers funcionen (cambio de cursor, efectos visuales)"
echo "  ✓ Las navegaciones funcionen correctamente"
echo "  ✓ Los modals/dialogs se abran sin problemas"
echo ""
echo "============================================"
echo ""

# Archivo de resultados
RESULTS_FILE="/tmp/interaction-test-results.txt"
echo "Resultados guardados en: $RESULTS_FILE"
{
    echo "Test ejecutado: $(date)"
    echo ""
    echo "=== ESTADO DE COMPONENTES ==="
    grep -l "'use client'" /var/www/billetera/components/dashboard/*.tsx | wc -l | xargs echo "Client components:"
    grep -l "Link" /var/www/billetera/components/dashboard/wallet-card.tsx | wc -l | xargs echo "WalletCard con Link:"
    ps aux | grep -v grep | grep -c "next dev" | xargs echo "Servidor Next.js activo:"
} > "$RESULTS_FILE"

echo "✅ Verificación completada"
echo ""
