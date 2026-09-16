# App_negocio — Sistema completo funcional
**Web + Pedidos por WhatsApp + Punto de Ventas + Control interno (modo administrador)**

Versión de producción: lista para operar el negocio de verdad (no es demo).
Estética Fluent / Windows 11 · responsive · modo claro/oscuro · **los datos viven en el navegador (localStorage)** para funcionar sin servidor.

## 🚀 Primer inicio (onboarding)
Al abrir la app por primera vez (en un navegador/limpo) aparece la **página de bienvenida** donde
capturas los datos de arranque:
1. **Nombre del negocio**
2. **WhatsApp Business (10 dígitos)** — es el número al que llegan pedidos y citas
3. **Dirección** y **horario** (opcional)
4. **PIN de administrador** (por defecto `2026`)

Al guardar se crea tu tienda y ya funciona todo el sistema. Ese número de WhatsApp queda
enlazado a toda la interfaz (botones de WhatsApp, pedidos, citas). Para cambiarlo después:
**Ajustes → WhatsApp**.

## Los 2 modos

### 👤 Modo usuario (lo que ve el cliente)
| Pantalla | Qué hace |
|---|---|
| **Inicio** | Presentación, servicios y precios |
| **Tienda** | Catálogo con filtros. El carrito arma el pedido **sin pedir datos antes** |
| **Confirmar pedido** | Recién ahí pide **nombre + WhatsApp (10 díg.) + dirección** para confirmar |
| **Mis pedidos** | El cliente consulta el estado de sus pedidos (Nuevo → Confirmado → En preparación → Listo → Entregado) |
| **Citas** | El cliente agenda solo; la cita se guarda y se envía por WhatsApp |

### 🔐 Modo administrador (solo tú)
Entra con **PIN** (por defecto: `2026`, cámbialo en Ajustes). Acceso por el botón "🔐 Admin".

| Pestaña | Qué hace |
|---|---|
| **📦 Pedidos** | Bandera de todos los pedidos, filtro por estado, **avanzar estado**, **💰 Cobrar** (registra venta + método + imprime ticket), WhatsApp al cliente, imprimir, eliminar. Botón "Registrar pedido" para capturar pedidos que llegan por WhatsApp/call. |
| **💰 Ventas y PDV** | KPIs (hoy, 7 días, total, ticket promedio), historial de ventas cobradas, **más vendidos**, y el **Punto de Venta**: caja rápida (elige productos, método, cobra e imprime ticket). |
| **📅 Seguimiento de citas** | Estadísticas, filtros, confirmar/completar/cancelar, WhatsApp al cliente, registrar cita manual. |
| **⚙️ Ajustes** | Nombre, WhatsApp, dirección, horario, **PIN**, IVA %, envío gratis/costo, **catálogo completo** (editar/agregar/quitar productos), servicios, respaldo (descargar JSON), restauración, restablecer datos. |

## Cómo se usa el ciclo completo
1. **Cliente** arma carrito → confirma (nombre + WhatsApp + dirección) → le llega el pedido por WhatsApp `wa.me` y queda guardado como **Nuevo**.
2. **Tú**, en el panel: **Confirmar → En preparación → Listo → 💰 Cobrar** (método de pago). La venta se registra sola en **Ventas** y puedes **imprimir el ticket**.
3. Pedidos atendidos de otra forma (llamada, mostrador, domicilio): **Registrar pedido** o PDV directo.
4. **Citas**: el cliente agenda en línea (nuevo → pendiente) y tú las **gestionas** en Seguimiento de citas.

> Nota: sin servidor, los datos se guardan en el navegador del dispositivo donde se trabaja. Si el cliente pide desde su teléfono, a ti te llega el pedido por **WhatsApp** y lo registras en el panel con "Registrar pedido" (o PDV). Así el ecosistema es 100% funcional en cualquier dispositivo.

## Antes de entregar / publicar (lista de arranque)
1. En **Ajustes**: pon tu nombre de negocio, **número de WhatsApp real (10 dígitos)**, dirección, horario y el **PIN** que quieras.
2. Revisa/edita **catálogo** (quita los productos de ejemplo) y **servicios** con tus precios reales.
3. Descarga un **respaldo** 🪙 y guárdalo.
4. Sube `App_negocio` a GitHub Pages y prueba el flujo completo en tu celular.

## Subirlo
`demos/App_negocio` → **URL:** `https://rockettes-iu.github.io/demos/App_negocio/`

## Notas técnicas
- Sin dependencias (cero CDN). Persistencia en `localStorage` (`ap_*`).
- El PIN va en el navegador del administrador (cámbialo en Ajustes → 💾).
- WhatsApp: los mensajes se montan con `wa.me/52{10dígitos}`; la app te mantiene el mismo número en toda la interfaz.
- Para probar todo: entra a Admin con el PIN, haz un pedido desde "Tienda" y pásalo por los estados hasta "Cobrar".