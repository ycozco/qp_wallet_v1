# 📋 Plan de Testing y Verificación - Billetera App

## Estado del Proyecto - Análisis Completo

### ✅ Funcionalidades Implementadas

#### 1. **Autenticación**
- ✅ Login con credenciales
- ✅ NextAuth configurado
- ✅ Middleware de protección de rutas
- ✅ Sesiones de usuario

#### 2. **Gestión de Cuentas** 
- ✅ Crear cuentas (Efectivo, Banco, Tarjeta, Billetera Digital)
- ✅ Listar cuentas
- ✅ **Eliminar cuentas** (con botón funcional)
- ✅ Validación de formularios
- ⚠️  **FALTA:** Editar/actualizar cuentas (función existe pero sin UI)
- ⚠️  **FALTA:** Ver balance actual calculado

#### 3. **Gestión de Categorías**
- ✅ Crear categorías (Gasto, Ingreso, Ambos)
- ✅ Listar categorías
- ✅ **Eliminar categorías** (con botón funcional)
- ⚠️  **FALTA:** Editar categorías (función no implementada)
- ⚠️  **FALTA:** Categorías por defecto al crear usuario

#### 4. **Gestión de Transacciones**
- ✅ Crear transacciones (Ingresos y Gastos)
- ✅ Listar transacciones
- ✅ **Eliminar transacciones** (RECIÉN IMPLEMENTADO ✨)
- ✅ Filtrar por tipo de movimiento
- ✅ Asociar categorías
- ⚠️  **FALTA:** Editar transacciones
- ⚠️  **FALTA:** Filtros por fecha/cuenta/categoría
- ⚠️  **FALTA:** Paginación

#### 5. **Gestión de Transferencias**
- ✅ Crear transferencias entre cuentas
- ✅ Listar transferencias
- ✅ **Eliminar transferencias** (RECIÉN IMPLEMENTADO ✨)
- ✅ Validación de cuentas diferentes
- ⚠️  **FALTA:** Editar transferencias
- ⚠️  **FALTA:** Actualización automática de balances

#### 6. **Dashboard/Billeteras**
- ✅ Vista de billeteras
- ✅ Diálogo de creación
- ⚠️  **FALTA:** Gráficos funcionales
- ⚠️  **FALTA:** Transacciones recientes
- ⚠️  **FALTA:** Resumen de gastos/ingresos

#### 7. **Reportes**
- ❌ **NO IMPLEMENTADO:** Página existe pero vacía

#### 8. **Perfil**
- ❌ **NO IMPLEMENTADO:** Página existe pero vacía

---

## 🔴 Problemas Críticos Encontrados

### 1. **Base de Datos**
**Problema:** PostgreSQL no está instalado o no está corriendo
**Síntoma:** No es posible hacer click en ninguna función porque todas las operaciones fallan
**Solución:** 
```bash
# Ejecutar script de configuración
./scripts/setup-database.sh
```

### 2. **Botones de Eliminar Faltantes** ✅ CORREGIDO
**Problema:** Transacciones y Transferencias no tenían botón de eliminar
**Solución:** Creados componentes `TransactionsList.tsx` y `TransfersList.tsx`

### 3. **Balances No Se Actualizan**
**Problema:** Al crear transacciones/transferencias, los balances no se recalculan
**Solución Pendiente:** Implementar cálculo de balance actual

---

## 🧪 Plan de Testing Manual

### Paso 1: Configurar Base de Datos
```bash
# 1. Instalar PostgreSQL si no está instalado
sudo apt install postgresql postgresql-contrib

# 2. Ejecutar script de configuración
cd /var/www/billetera
./scripts/setup-database.sh

# 3. Crear usuario de prueba
npm run create-user
```

### Paso 2: Iniciar Aplicación
```bash
npm run dev
```

### Paso 3: Test de Autenticación
- [ ] Acceder a http://localhost:3000
- [ ] Debe redirigir a /login
- [ ] Ingresar credenciales creadas
- [ ] Debe redirigir a /dashboard

### Paso 4: Test de Cuentas
- [ ] Ir a "Cuentas" en el menú
- [ ] Click en "Nueva Cuenta"
- [ ] Llenar formulario:
  - Nombre: "Billetera Principal"
  - Tipo: Efectivo
  - Moneda: PEN
  - Balance: 1000.00
- [ ] Click en "Guardar Cuenta"
- [ ] Verificar que aparece en la lista
- [ ] Click en botón de eliminar (ícono basura)
- [ ] Confirmar eliminación
- [ ] Verificar que desaparece

### Paso 5: Test de Categorías
- [ ] Ir a "Categorías"
- [ ] Click en "Nueva Categoría"
- [ ] Crear categoría:
  - Nombre: "Alimentos"
  - Tipo: Gasto
- [ ] Guardar y verificar
- [ ] Crear categoría de ingresos:
  - Nombre: "Salario"
  - Tipo: Ingreso
- [ ] Probar eliminar categoría

### Paso 6: Test de Transacciones
- [ ] Ir a "Movimientos"
- [ ] Click en "Nuevo Movimiento"
- [ ] Crear un gasto:
  - Tipo: Gasto
  - Monto: 50.00
  - Cuenta: Seleccionar una
  - Categoría: Alimentos
  - Descripción: "Compra en supermercado"
  - Fecha: Hoy
- [ ] Guardar y verificar que aparece
- [ ] **NUEVO:** Click en botón eliminar ✨
- [ ] Confirmar y verificar eliminación
- [ ] Crear un ingreso y probar igual

### Paso 7: Test de Transferencias
- [ ] Crear al menos 2 cuentas primero
- [ ] Ir a "Transferencias"
- [ ] Click en "Nueva Transferencia"
- [ ] Llenar:
  - Monto: 200.00
  - Desde: Cuenta 1
  - Hacia: Cuenta 2
  - Descripción: "Ahorro mensual"
  - Fecha: Hoy
- [ ] Guardar y verificar
- [ ] **NUEVO:** Click en botón eliminar ✨
- [ ] Confirmar y verificar eliminación

### Paso 8: Test de Navegación
- [ ] Probar todos los links del sidebar
- [ ] Verificar que no hay errores 404
- [ ] Probar botones "Cancelar" en formularios
- [ ] Verificar redirecciones correctas

---

## 🐛 Bugs Conocidos

1. **Balance no actualiza:** Los balances mostrados son siempre el balance inicial
2. **Falta paginación:** Todas las listas cargan máximo 50 items
3. **Sin validación de fondos:** Permite transferir/gastar más de lo disponible
4. **Categorías dinámicas ineficientes:** Las clases de Tailwind con colores dinámicos no funcionarán bien
5. **Falta manejo de errores UI:** Los errores se muestran con `alert()` básico

---

## 📝 Funcionalidades Pendientes por Implementar

### Alta Prioridad
1. ✅ ~~Botones eliminar en Transacciones~~ (COMPLETADO)
2. ✅ ~~Botones eliminar en Transferencias~~ (COMPLETADO)
3. ⏳ Cálculo de balance actual por cuenta
4. ⏳ Actualización de balances al crear/eliminar transacciones
5. ⏳ Validación de fondos suficientes

### Media Prioridad
6. Editar cuentas (UI)
7. Editar transacciones
8. Editar transferencias
9. Editar categorías
10. Filtros en listados
11. Paginación

### Baja Prioridad
12. Página de reportes funcional
13. Página de perfil funcional
14. Gráficos en dashboard
15. Exportar datos
16. Categorías por defecto
17. Búsqueda de transacciones

---

## 🎯 Checklist de Verificación Rápida

Después de configurar la base de datos:

```bash
# 1. Verificar que la BD está corriendo
sudo systemctl status postgresql

# 2. Verificar conexión
psql -U wallet -d wallet -h localhost -c "SELECT 1"

# 3. Ver tablas creadas
psql -U wallet -d wallet -h localhost -c "\dt"

# 4. Iniciar app
npm run dev

# 5. Abrir navegador
http://localhost:3000
```

### Prueba de 5 minutos:
1. ✅ Login funciona
2. ✅ Crear 1 cuenta
3. ✅ Crear 1 categoría
4. ✅ Crear 1 transacción
5. ✅ Eliminar transacción ✨ NUEVO
6. ✅ Crear transferencia (necesita 2 cuentas)
7. ✅ Eliminar transferencia ✨ NUEVO

**Si todos estos pasos funcionan, la aplicación está operativa.**

---

## 🔧 Solución de Problemas Comunes

### Error: "Can't reach database server"
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### Error: "relation does not exist"
```bash
cd /var/www/billetera
npx prisma db push --force-reset
```

### Error: "No autorizado" / "No autenticado"
- Verificar que estás logueado
- Limpiar cookies del navegador
- Verificar NEXTAUTH_SECRET en .env

### Botones no responden
- Abrir consola del navegador (F12)
- Verificar errores de JavaScript
- Verificar errores de red en tab Network

### Formularios no guardan
- Verificar conexión a BD
- Revisar logs del servidor (terminal)
- Verificar que todos los campos requeridos están llenos

---

## 📊 Resumen de Estado

| Módulo | Crear | Listar | Editar | Eliminar | Estado |
|--------|-------|--------|--------|----------|--------|
| Autenticación | ✅ | N/A | N/A | N/A | Completo |
| Cuentas | ✅ | ✅ | ❌ | ✅ | 75% |
| Categorías | ✅ | ✅ | ❌ | ✅ | 75% |
| Transacciones | ✅ | ✅ | ❌ | ✅ | 75% |
| Transferencias | ✅ | ✅ | ❌ | ✅ | 75% |
| Dashboard | ⚠️ | ⚠️ | N/A | N/A | 40% |
| Reportes | ❌ | ❌ | N/A | N/A | 0% |
| Perfil | ❌ | N/A | ❌ | N/A | 0% |

**Estado Global: ~60% completado**

---

## 🚀 Próximos Pasos Recomendados

1. **Inmediato:** Configurar base de datos con el script
2. **Corto plazo:** Implementar cálculo de balances
3. **Mediano plazo:** Completar funcionalidades de edición
4. **Largo plazo:** Dashboard funcional y reportes
