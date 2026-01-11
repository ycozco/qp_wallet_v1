# Changelog - Wallet App

## [2026-01-09] - Correcciones de Deployment

### Arreglado
- ✅ **Error UntrustedHost**: Agregada variable `AUTH_TRUST_HOST=true` para NextAuth v5
  - Actualizado `.env` en `/srv/apps/wallet/`
  - Actualizado `docker-compose.yml` para incluir la variable en el contenedor

### Agregado
- ✅ **2 Usuarios de Prueba Creados**:
  - **Usuario 1**: `admin` / `admin123` (Administrador)
  - **Usuario 2**: `demo` / `demo123` (Usuario Demo)
  - Ambos usuarios tienen provider 'local' configurado

### Modificado  
- ✅ **Página de Login en Modo Oscuro**:
  - Fondo: `bg-gray-900` (negro azulado oscuro)
  - Contenedor: `bg-gray-800` con borde `border-gray-700`
  - Inputs: `bg-gray-700` con texto blanco
  - Labels: `text-gray-300`
  - Errores: `bg-red-900/50` con borde `border-red-700`
  - Botón: `bg-indigo-600` con hover `bg-indigo-500`
  - Spinner de carga animado agregado al botón
  - **Credenciales de prueba visibles** en la parte inferior del formulario

## Verificación

```bash
# Health Check
curl https://billetera.qpsecuresolutions.cloud/api/health

# Usuarios disponibles
admin / admin123
demo / demo123
```

## Estado del Deployment

✅ Aplicación funcionando correctamente en https://billetera.qpsecuresolutions.cloud
✅ Base de datos PostgreSQL operativa
✅ Autenticación local funcional
✅ 2 usuarios de prueba creados y verificados
✅ Login con diseño oscuro moderno implementado
