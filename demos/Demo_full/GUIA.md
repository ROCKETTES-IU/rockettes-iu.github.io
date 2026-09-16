# Demo Completa — Pet & Vet Centro
**Web + WhatsApp Business + Punto de Venta + Citas con seguimiento**

Demo insignia de lo que puedes ofrecerle a un negocio (aquí una veterinaria + pet shop).
Estética **Fluent / Windows 11**: mica con blur, acento azul `#0078D4`, redondeados suaves,
modo claro/oscuro automático con persistencia.

## Módulos (pestañas)

| Pestaña | Función |
|---|---|
| **Inicio** | Hero + demostración "Todo en uno" (citas, ventas, agenda) |
| **Servicios** | Los 6 servicios veterinarios con cards |
| **Precios** | Tabla de precios con CTA a citas |
| **Tienda (PDV)** | Catálogo con filtros, carrito, cantidades, IVA 16%, envío gratis +$500 y envío del pedido **por WhatsApp** |
| **Citas** | Registro de cita: servicio, fecha, hora, cliente, mascota, WhatsApp → se guarda y se envía a WhatsApp |
| **Agenda** | Seguimiento: estadísticas (pendientes / para hoy / completadas), filtros por estado, cambiar estado (✓/✔/✕), WhatsApp al cliente, eliminar |

Todo se guarda en el **navegador (localStorage)** para que la demo funcione sin servidor.
Incluye 3 citas de ejemplo al primer acceso (bórralas con 🗑 si quieres empezar limpio).

## Configuración (importante)
En `index.html` antes de `js/main.js`:

```js
window.APP = {
  negocio: "Pet & Vet Centro",          // nombre que aparece en los mensajes
  whatsapp: "529601427950",             // a dónde llegan pedidos y citas
  direccion: "Centro · Berriozábal, Chiapas"
};
```

- **En la demo:** déjalo en `529601427950` (te llegan los leads a ti).
- **Al vender:** cambia `whatsapp` por el número del cliente, ajusta `negocio`,
  dirección y precios (arrays `SERVICIOS` y `PRODUCTOS` en `js/main.js`).

## Para subirla
`github.com/ROCKETTES-IU/rockettes-iu.github.io` → **Add file → Upload files** →
arrastra la carpeta `demo-completo` dentro de `demos` → commit.
**URL:** `https://rockettes-iu.github.io/demos/demo-completo/`

## Lo que le demuestras al prospecto
1. El cliente **no llama**: agenda solo y pide solo (todo por WhatsApp).
2. El negocio **no pierde ventas**: carrito con totales e IVA y pedido listo para cobrar.
3. El negocio **no pierde citas**: agenda con estados y botón para escribirle al cliente.
4. Se ve **moderno** (estilo Windows 11) en cualquier pantalla.

## Notas técnicas
- `body` guarda tema (claro/oscuro) y `pvc_cart` / `pvc_citas` en `localStorage`.
- Para probar en limpio: borra los datos del sitio en el navegador (o abre incógnito).
- Sin dependencias externas (cero CDN): funciona aún sin internet salvo los íconos.